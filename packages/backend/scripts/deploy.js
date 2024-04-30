const hre = require('hardhat');
const { ethers } = require('ethers');
require('dotenv').config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

const artFactoryContractAddress = process.env.FACTORY_CONTRACT_ADDRESS;
const deployerAddress = signer.address;
const deployerBytes = ethers.getBytes(deployerAddress).slice(0, 20);
const randomString = "meow"; // This value must change on every ArtworkToken deployment
const randomBytes = ethers.toUtf8Bytes(randomString);
const concatenatedBytes = ethers.concat([deployerBytes, randomBytes]);

// Generating the salt by hashing the concatenated bytes
const salt = ethers.keccak256(concatenatedBytes);
const metadata = "Unmani deployed this Whistle";  // Example ID for the artwork

async function deployWhistle() {
    try {
        const WhistleFactory = await hre.ethers.getContractAt('WhistleFactory', artFactoryContractAddress, signer);
        // Compute expected address before deployment
        const expectedAddress = await WhistleFactory.computeTokenAddress(salt, metadata);
        console.log('Expected Whistle address:', expectedAddress);

        // Deploying Whistle using WhistleFactory
        const txn = await WhistleFactory.deployWhistle(salt, metadata);
        await txn.wait()
        const tokenAddress = await WhistleFactory.latestWhistleAddress()
        console.log('Deployed Whistle address:', tokenAddress);
        if (expectedAddress == tokenAddress) {
            console.log("Expected and deployed address match, CREATE2 functionality verified!");
        } else {
            console.error("Mismatch in expected and deployed addresses!");
        }

    } catch (err) {
        console.error('Error in deployWhistle:', err);
    }
}

async function main() {
    await deployWhistle();
}

main().catch(err => console.error('Error in main function:', err));