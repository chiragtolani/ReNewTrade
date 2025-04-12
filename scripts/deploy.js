const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

async function main() {
  console.log("Deploying EnergyTrading contract...");
  
  const EnergyTrading = await hre.ethers.getContractFactory("EnergyTrading");
  const contract = await EnergyTrading.deploy();
  await contract.deployed();

  const address = contract.address;
  console.log("Contract deployed to:", address);

  // Create frontend-data directory if it doesn't exist
  const frontendDir = path.join(__dirname, "..", "frontend-data");
  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir);
  }

  // Get contract ABI
  const contractArtifact = await hre.artifacts.readArtifact("EnergyTrading");
  
  const contractData = {
    address,
    abi: contractArtifact.abi
  };

  // Save contract data for frontend
  fs.writeFileSync(
    path.join(frontendDir, "EnergyTrading.json"),
    JSON.stringify(contractData, null, 2)
  );

  console.log("Contract ABI and address saved to frontend-data/EnergyTrading.json");

  // Verify contract on Etherscan (if on a supported network)
  if (hre.network.name !== "localhost") {
    console.log("Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: [],
      });
      console.log("Contract verified on Etherscan");
    } catch (error) {
      console.error("Error verifying contract:", error.message);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
