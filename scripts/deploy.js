const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

async function main() {
  console.log("Deploying EnergyLedger contract...");
  
  const EnergyLedger = await hre.ethers.getContractFactory("EnergyLedger");
  const contract = await EnergyLedger.deploy();
  await contract.deployed();

  const address = contract.address;
  console.log("Contract deployed to:", address);

  // Create frontend-data directory if it doesn't exist
  const frontendDir = path.join(__dirname, "..", "frontend-data");
  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir);
  }

  // Get contract ABI
  const contractArtifact = await hre.artifacts.readArtifact("EnergyLedger");
  
  const contractData = {
    address,
    abi: contractArtifact.abi
  };

  // Save contract data for frontend
  fs.writeFileSync(
    path.join(frontendDir, "EnergyLedger.json"),
    JSON.stringify(contractData, null, 2)
  );

  console.log("Contract ABI and address saved to frontend-data/EnergyLedger.json");

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
