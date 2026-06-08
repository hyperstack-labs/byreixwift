require("dotenv").config();

async function main() {
  console.log("ByReiXwift Escrow Deployment");

  console.log("RPC URL:", process.env.RPC_URL);

  console.log("Deployment script ready.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});