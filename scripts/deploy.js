import hre from "hardhat";

async function main() {
  console.log("Deploying SupplyChain contract to Sepolia...");

  const SupplyChain = await hre.ethers.getContractFactory("SupplyChain");
  const supplyChain = await SupplyChain.deploy();

  await supplyChain.waitForDeployment();

  const address = await supplyChain.getAddress();
  console.log(`SupplyChain contract deployed to: ${address}`);
  console.log("Save this address! You will need it for your React app.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
