// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ByReiXwiftEscrow
 * @dev Shariah-compliant escrow contract with no interest or dynamic fees.
 * This contract ensures fixed execution without Riba.
 */
contract ByReiXwiftEscrow {
    enum EscrowState { Pending, Locked, Released, Refunded }

    struct EscrowTransaction {
        address buyer;
        address seller;
        uint256 amount;
        EscrowState state;
        bool isInitialized;
    }

    mapping(uint256 => EscrowTransaction) public transactions;
    uint256 public nextTransactionId;

    event EscrowCreated(uint256 indexed txId, address indexed buyer, address indexed seller, uint256 amount);
    event EscrowLocked(uint256 indexed txId);
    event EscrowReleased(uint256 indexed txId);
    event EscrowRefunded(uint256 indexed txId);

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

    /**
     * @dev Deposit funds to initiate the escrow (Pending state natively, locks immediately upon deposit here for simplicity, or we separate deposit and lock).
     */
    function deposit(address _seller) external payable returns (uint256) {
        require(msg.value > 0, "Amount must be greater than zero");

        uint256 txId = nextTransactionId++;
        
        transactions[txId] = EscrowTransaction({
            buyer: msg.sender,
            seller: _seller,
            amount: msg.value,
            state: EscrowState.Pending,
            isInitialized: true
        });

        emit EscrowCreated(txId, msg.sender, _seller, msg.value);
        return txId;
    }

    /**
     * @dev Lock the funds (Optional intermediate state if external verification is needed).
     */
    function lock(uint256 _txId) external onlyBuyer(_txId) inState(_txId, EscrowState.Pending) {
        transactions[_txId].state = EscrowState.Locked;
        emit EscrowLocked(_txId);
    }

    /**
     * @dev Release funds to the seller. Only buyer can authorize this natively.
     */
    function release(uint256 _txId) external onlyBuyer(_txId) inState(_txId, EscrowState.Locked) {
        transactions[_txId].state = EscrowState.Released;
        uint256 amount = transactions[_txId].amount;
        
        address seller = transactions[_txId].seller;
        
        (bool success, ) = seller.call{value: amount}("");
        require(success, "Transfer failed");

        emit EscrowReleased(_txId);
    }

    /**
     * @dev Refund funds to the buyer. Can be called by seller to reject, or an arbiter in future extensions.
     */
    function refund(uint256 _txId) external onlySeller(_txId) {
        require(
            transactions[_txId].state == EscrowState.Pending || 
            transactions[_txId].state == EscrowState.Locked, 
            "Cannot refund in current state"
        );

        transactions[_txId].state = EscrowState.Refunded;
        uint256 amount = transactions[_txId].amount;
        
        address buyer = transactions[_txId].buyer;
        
        (bool success, ) = buyer.call{value: amount}("");
        require(success, "Refund failed");

        emit EscrowRefunded(_txId);
    }
}
