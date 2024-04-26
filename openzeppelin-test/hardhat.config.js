require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: "https://ethereum-sepolia.publicnode.com",
      chainId: 11155111
    },
    base: {
      url: "https://sepolia.base.org",
      chainId: 84532
    }
  },
  defender: {
    apiKey: process.env.DEFENDER_KEY,
    apiSecret: process.env.DEFENDER_SECRET,
  }
};