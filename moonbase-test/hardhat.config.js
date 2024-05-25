require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    moonbase: {
      url: 'https://moonbase-rpc.dwellir.com', // Insert your RPC URL here
      chainId: 1287, // (hex: 0x507),
      accounts: [`0x${process.env.DEPLOYER_PRIVATE_KEY}`]
    },    
  },
  //defaultNetwork:'sepolia',
  // defender: {
  //   apiKey: process.env.DEFENDER_KEY,
  //   apiSecret: process.env.DEFENDER_SECRET,
  //   useDefenderDeploy: false
  // }
};