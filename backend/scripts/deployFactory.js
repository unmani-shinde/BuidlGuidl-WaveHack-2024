const hre = require('hardhat');
const { ethers } = require('ethers');
require('dotenv').config();

const providerBaseSepolia = new ethers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC_UR);
const providerEthSepolia = new ethers.JsonRpcProvider(process.env.ETH_SEPOLIA_RPC_URL);

const signer = new ethers.Wallet(process.env.PRIVATE_KEY, providerEthSepolia); // Using the signer for eth sepolia first

export async function deployWhistleFactory() {
    try {
        const WhistleFactory = await hre.ethers.getContractFactory('WhistleFactory', signer);
        
        // Deploy to eth sepolia
        console.log('Deploying WhistleFactory to eth sepolia...');
        const factoryEthSepolia = await WhistleFactory.connect(signer).deploy();
        await factoryEthSepolia.waitForDeployment();
        console.log(`WhistleFactory deployed to eth sepolia: ${await factoryEthSepolia.getAddress()}`);

        // Switch signer to base sepolia
        signer.provider = providerBaseSepolia;

        // Deploy to base sepolia
        console.log('Deploying WhistleFactory to base sepolia...');
        const factoryBaseSepolia = await WhistleFactory.connect(signer).deploy();
        await factoryBaseSepolia.waitForDeployment();
        console.log(`WhistleFactory deployed to base sepolia: ${await factoryBaseSepolia.getAddress()}`);
    } catch (err) {
        console.error('Error in deployWhistleFactory:', err);
    }
}

async function main() {
    await deployWhistleFactory();
}

main().catch(err => console.error('Error in main function:', err));
