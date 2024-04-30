const { ethers, defender } = require("hardhat");

async function main() {
  const WhistleContract = await ethers.getContractFactory("Whistle");
  const deployment = await defender.deployContract(WhistleContract);
  //await deployment.waitForDeployment();
  console.log(`Contract deployed to: ${await deployment.getAddress()}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});