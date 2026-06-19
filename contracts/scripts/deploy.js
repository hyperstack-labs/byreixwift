require("dotenv").config();
const hre = require("hardhat");

async function main() {
  console.log("ByReiXwift Escrow Deployment");

  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying with:", deployer.address);

  const ByReiXwiftEscrow = await hre.ethers.getContractFactory(
    "ByReiXwiftEscrow"
  );

  const feeCollector = deployer.address;
  const fixedFee = 0;

  const escrow = await ByReiXwiftEscrow.deploy(
    feeCollector,
    fixedFee
  );

  await escrow.waitForDeployment();

  console.log("Contract deployed successfully!");
  console.log("Contract Address:", await escrow.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});