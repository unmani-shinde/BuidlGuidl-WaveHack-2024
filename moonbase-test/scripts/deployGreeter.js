const hre = require("hardhat");

async function main() {
  // Get the deployment signer
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying Greeter to Moonbase Alpha...");

  // We get the contract to deploy
  const Greeter = await hre.ethers.getContractFactory("Greeter");

  // Get the current timestamp
  const timestamp = Math.floor(Date.now() / 1000);

  // Deploy contract with timestamp as nonce
  const greeter = await Greeter.deploy("Hello, world!", {
    nonce: timestamp
  });

  console.log(`Greeter contract deployed to: ${await greeter.getAddress()}`);
}

// Run the main function
main().catch((error) => {
  console.error("Error in deployFactory:", error);
  process.exitCode = 1;
});
