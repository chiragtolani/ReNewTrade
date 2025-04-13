const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

async function main() {
  console.log("Deploying EnergyLedger contract...");
  
  // Get the contract factory
  const EnergyLedger = await hre.ethers.getContractFactory("EnergyLedger");
  console.log("Deploying EnergyLedger...");
  const contract = await EnergyLedger.deploy();
  
  console.log("Contract deployed to:", await contract.getAddress());
  console.log("Waiting for deployment to be confirmed...");
  await contract.waitForDeployment();
  console.log("Deployment confirmed!");

  // Create frontend-data directory if it doesn't exist
  const frontendDir = path.join(__dirname, "..", "frontend-data");
  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir);
  }

  // Get contract ABI
  const artifact = await hre.artifacts.readArtifact("EnergyLedger");
  
  const contractData = {
    address: await contract.getAddress(),
    abi: artifact.abi
  };

  // Save contract data for frontend
  fs.writeFileSync(
    path.join(frontendDir, "EnergyLedger.json"),
    JSON.stringify(contractData, null, 2)
  );

  console.log("Contract ABI and address saved to frontend-data/EnergyLedger.json");

  // Verify contract on Etherscan (if on a supported network)
  if (network.name !== "localhost" && process.env.ETHERSCAN_API_KEY) {
    console.log("Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: await contract.getAddress(),
        constructorArguments: [],
      });
      console.log("Contract verified on Etherscan");
    } catch (error) {
      console.error("Error verifying contract:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
