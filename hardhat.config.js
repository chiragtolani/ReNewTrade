require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 10,
        accountsBalance: "1" // This sets 1 ETH as initial balance
      }
    },
    sepolia: {
      url: process.env.SEPOLIA_HTTP_URL || "https://necessary-orbital-daylight.ethereum-sepolia.quiknode.pro/3e918e1e3a58fe7cd1657f55c227ff78f400a8c6/",
      // For WebSocket connection, use SEPOLIA_WSS_URL in your frontend code
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
      timeout: 120000, // 2 minutes timeout
      gas: "auto",
      gasPrice: "auto"
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
