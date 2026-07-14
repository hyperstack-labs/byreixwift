// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ByReiXwiftEscrow
 * @dev Minimal escrow lifecycle with fixed-fee execution and no time-based charges.
 * The contract keeps the first version intentionally small: deposit, lock, release, refund.
 */
contract ByReiXwiftEscrow is ReentrancyGuard, Ownable {
    enum EscrowState { Pending, Locked, Released, Refunded }

    struct EscrowTransaction {
        address buyer;
        address seller;
        uint256 grossAmount;
        uint256 netAmount;
        bytes32 agreementHash;
        EscrowState state;
        uint64 createdAt;
        uint64 lockedAt;
        uint64 resolvedAt;
        bool isInitialized;
    }

    mapping(uint256 => EscrowTransaction) public transactions;
    uint256 public nextTransactionId;
    address public feeCollector;
    uint256 public fixedFee;

    event EscrowCreated(
        uint256 indexed txId,
        address indexed buyer,
        address indexed seller,
        uint256 grossAmount,
        uint256 fixedFee,
        bytes32 agreementHash
    );
    event EscrowLocked(uint256 indexed txId, address indexed actor);
    event EscrowReleased(uint256 indexed txId, address indexed actor, uint256 sellerAmount, uint256 feeAmount);
    event EscrowRefunded(uint256 indexed txId, address indexed actor, uint256 refundedAmount);
    event FeeCollectorUpdated(address indexed oldCollector, address indexed newCollector);
    event FixedFeeUpdated(uint256 oldFee, uint256 newFee);

    constructor(address _feeCollector, uint256 _fixedFee) Ownable(msg.sender) {
        require(_feeCollector != address(0), "Fee collector is required");
        feeCollector = _feeCollector;
        fixedFee = _fixedFee;
    }

    function setFeeCollector(address _newFeeCollector) external onlyOwner {
        require(_newFeeCollector != address(0), "Invalid collector address");
        emit FeeCollectorUpdated(feeCollector, _newFeeCollector);
        feeCollector = _newFeeCollector;
    }

    function setFixedFee(uint256 _newFixedFee) external onlyOwner {
        emit FixedFeeUpdated(fixedFee, _newFixedFee);
        fixedFee = _newFixedFee;
    }

    modifier escrowExists(uint256 _txId) {
        require(transactions[_txId].isInitialized, "Escrow does not exist");
        _;
    }

    modifier onlyBuyer(uint256 _txId) {
        require(msg.sender == transactions[_txId].buyer, "Only buyer can call this");
        _;
    }

    modifier onlySeller(uint256 _txId) {
        require(msg.sender == transactions[_txId].seller, "Only seller can call this");
        _;
    }

    modifier inState(uint256 _txId, EscrowState _state) {
        require(transactions[_txId].state == _state, "Invalid state");
        _;
    }

    function deposit(address _seller, bytes32 _agreementHash)
        external
        payable
        nonReentrant
        returns (uint256)
    {
        require(_seller != address(0), "Seller is required");
        require(_seller != msg.sender, "Buyer and seller must differ");
        require(msg.value > fixedFee, "Deposit must be greater than fixed fee");

        uint256 txId = nextTransactionId++;
        uint256 netAmount = msg.value - fixedFee;

        transactions[txId] = EscrowTransaction({
            buyer: msg.sender,
            seller: _seller,
            grossAmount: msg.value,
            netAmount: netAmount,
            agreementHash: _agreementHash,
            state: EscrowState.Pending,
            createdAt: uint64(block.timestamp),
            lockedAt: 0,
            resolvedAt: 0,
            isInitialized: true
        });

        emit EscrowCreated(txId, msg.sender, _seller, msg.value, fixedFee, _agreementHash);
        return txId;
    }

    function lock(uint256 _txId)
        external
        escrowExists(_txId)
        onlyBuyer(_txId)
        inState(_txId, EscrowState.Pending)
    {
        transactions[_txId].state = EscrowState.Locked;
        transactions[_txId].lockedAt = uint64(block.timestamp);
        emit EscrowLocked(_txId, msg.sender);
    }

    function release(uint256 _txId)
        external
        nonReentrant
        escrowExists(_txId)
        onlyBuyer(_txId)
        inState(_txId, EscrowState.Locked)
    {
        EscrowTransaction storage escrow = transactions[_txId];
        escrow.state = EscrowState.Released;
        escrow.resolvedAt = uint64(block.timestamp);

        (bool paidSeller, ) = escrow.seller.call{value: escrow.netAmount}("");
        require(paidSeller, "Seller transfer failed");

        if (fixedFee > 0) {
            (bool paidFeeCollector, ) = feeCollector.call{value: fixedFee}("");
            require(paidFeeCollector, "Fee transfer failed");
        }

        emit EscrowReleased(_txId, msg.sender, escrow.netAmount, fixedFee);
    }

    function refund(uint256 _txId)
        external
        nonReentrant
        escrowExists(_txId)
        onlySeller(_txId)
    {
        EscrowTransaction storage escrow = transactions[_txId];
        require(
            escrow.state == EscrowState.Pending || escrow.state == EscrowState.Locked,
            "Cannot refund in current state"
        );

        escrow.state = EscrowState.Refunded;
        escrow.resolvedAt = uint64(block.timestamp);

        (bool refundedBuyer, ) = escrow.buyer.call{value: escrow.grossAmount}("");
        require(refundedBuyer, "Refund failed");

        emit EscrowRefunded(_txId, msg.sender, escrow.grossAmount);
    }
}
