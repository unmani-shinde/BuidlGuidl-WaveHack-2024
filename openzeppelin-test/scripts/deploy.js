const { ethers, defender } = require("hardhat");

async function main() {
  const VotingContract = await ethers.getContractFactory("Voting");

  const deployment = await defender.deployContract(VotingContract);
//   await deployment.waitForDeployment();
  console.log(`Contract deployed to: ${await deployment.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
