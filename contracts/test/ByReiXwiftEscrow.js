const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ByReiXwiftEscrow", function () {
  async function deployFixture() {
    const [buyer, seller, feeCollector, outsider] = await ethers.getSigners();
    const fixedFee = ethers.parseEther("0.01");
    const Escrow = await ethers.getContractFactory("ByReiXwiftEscrow");
    const escrow = await Escrow.deploy(feeCollector.address, fixedFee);
    await escrow.waitForDeployment();

    return { escrow, buyer, seller, feeCollector, outsider, fixedFee };
  }

  it("creates and locks escrow", async function () {
    const { escrow, buyer, seller, fixedFee } = await deployFixture();
    const depositValue = ethers.parseEther("1");
    const agreementHash = ethers.keccak256(ethers.toUtf8Bytes("escrow-v0"));

    await expect(
      escrow.connect(buyer).deposit(seller.address, agreementHash, { value: depositValue })
    )
      .to.emit(escrow, "EscrowCreated")
      .withArgs(0, buyer.address, seller.address, depositValue, fixedFee, agreementHash);

    const createdEscrow = await escrow.transactions(0);
    expect(createdEscrow.buyer).to.equal(buyer.address);
    expect(createdEscrow.seller).to.equal(seller.address);
    expect(createdEscrow.state).to.equal(0);
    expect(createdEscrow.netAmount).to.equal(depositValue - fixedFee);

    await expect(escrow.connect(buyer).lock(0))
      .to.emit(escrow, "EscrowLocked")
      .withArgs(0, buyer.address);

    const lockedEscrow = await escrow.transactions(0);
    expect(lockedEscrow.state).to.equal(1);
  });

  it("releases locked escrow and pays seller plus fee collector", async function () {
    const { escrow, buyer, seller, feeCollector, fixedFee } = await deployFixture();
    const depositValue = ethers.parseEther("1");
    const expectedSellerAmount = depositValue - fixedFee;

    await escrow.connect(buyer).deposit(seller.address, ethers.ZeroHash, { value: depositValue });
    await escrow.connect(buyer).lock(0);

    await expect(() => escrow.connect(buyer).release(0)).to.changeEtherBalances(
      [seller, feeCollector],
      [expectedSellerAmount, fixedFee]
    );

    const releasedEscrow = await escrow.transactions(0);
    expect(releasedEscrow.state).to.equal(2);
  });

  it("allows seller to refund pending escrow", async function () {
    const { escrow, buyer, seller } = await deployFixture();
    const depositValue = ethers.parseEther("1");

    await escrow.connect(buyer).deposit(seller.address, ethers.ZeroHash, { value: depositValue });

    await expect(() => escrow.connect(seller).refund(0)).to.changeEtherBalances(
      [buyer],
      [depositValue]
    );

    const refundedEscrow = await escrow.transactions(0);
    expect(refundedEscrow.state).to.equal(3);
  });

  it("blocks outsiders from mutating escrow state", async function () {
    const { escrow, buyer, seller, outsider } = await deployFixture();
    const depositValue = ethers.parseEther("1");

    await escrow.connect(buyer).deposit(seller.address, ethers.ZeroHash, { value: depositValue });

    await expect(escrow.connect(outsider).lock(0)).to.be.revertedWith("Only buyer can call this");
    await expect(escrow.connect(outsider).refund(0)).to.be.revertedWith(
      "Only seller can call this"
    );
  });
});
