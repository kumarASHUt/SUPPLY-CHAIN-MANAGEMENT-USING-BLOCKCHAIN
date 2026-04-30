import { ethers } from "ethers";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
    const PRIVATE_KEY = process.env.PRIVATE_KEY;

    if (!SEPOLIA_RPC_URL || !PRIVATE_KEY) {
        console.error("Missing SEPOLIA_RPC_URL or PRIVATE_KEY in .env");
        process.exit(1);
    }

    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    console.log(`Deploying with account: ${wallet.address}`);

    const artifactPath = path.join(__dirname, "../artifacts/contracts/SupplyChain.sol/SupplyChain.json");
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

    const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
    
    console.log("Deploying SupplyChain...");
    const contract = await factory.deploy();
    
    await contract.waitForDeployment();
    const address = await contract.getAddress();

    console.log(`SupplyChain deployed to: ${address}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
