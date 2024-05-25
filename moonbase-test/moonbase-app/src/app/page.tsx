"use client";

import { useState, useEffect } from 'react';
import { Contract, ethers } from 'ethers';
import useWeb3 from "../../../hooks/useWeb3"; // Adjust the import path as needed
import GREETER_CONTRACT_ABI from '../../../artifacts/contracts/Greeter.sol/Greeter.json'; // Adjust the import based on your project structure
import {MOONBASE_GREETER_ADDRESS} from "../../../constants/index";
import callPermitABI from "../../../constants/callPermitABI";
import { networks } from '../../../hardhat.config';
require('dotenv').config();

export default function Home() {
  const { provider, signer } = useWeb3();
  const [greeting, setGreeting] = useState<string>('');
  const [newGreeting, setNewGreeting] = useState<string>('');
  const [greeterContract, setGreeterContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (provider && signer) {
      initialize();
    }
  }, [provider, signer]);

  const initialize = async () => {
    try {
      if (!signer) throw new Error('Signer is not available');
      const contract = new ethers.Contract(MOONBASE_GREETER_ADDRESS, GREETER_CONTRACT_ABI.abi, signer);
      setGreeterContract(contract);
      const currentGreeting = await contract.greet();
      setGreeting(currentGreeting);
    } catch (error) {
      console.error('Error initializing contract:', error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!greeterContract || !provider || !signer || !process.env.NEXT_PUBLIC_DEPLOYER_PRIVATE_KEY) {
      console.error('Missing necessary components');
      return;
    }
  
    const thirdPartyGasSigner = new ethers.Wallet(process.env.NEXT_PUBLIC_DEPLOYER_PRIVATE_KEY.toString(), provider);
  
    const domain = {
      name: 'Call Permit Precompile',
      version: '1',
      chainId: 1284,
      verifyingContract: '0x000000000000000000000000000000000000080a',
    };
  
    const types = {
      CallPermit: [
        { name: 'from', type: 'address' },
        { name: 'to', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'data', type: 'bytes' },
        { name: 'gaslimit', type: 'uint64' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
    };
    
  
    const GreeterInterface = new ethers.Interface(GREETER_CONTRACT_ABI.abi);
    const data = GreeterInterface.encodeFunctionData('setGreeting', ["Meow"]);
  
    try {
      const signerAddress = await (signer as ethers.Signer).getAddress();
      
  
      const gasEstimate = await (provider as ethers.JsonRpcProvider).estimateGas({
        from: signerAddress,
        to: MOONBASE_GREETER_ADDRESS,
        data,
      });
  
      const callPermit = new ethers.Contract(
        '0x000000000000000000000000000000000000080a',
        callPermitABI,
        thirdPartyGasSigner
      );
  
      const nonce = await callPermit.nonces(signerAddress);
  
      const message = {
        from: signerAddress,
        to: MOONBASE_GREETER_ADDRESS,
        value: 0,
        data,
        gaslimit: gasEstimate + BigInt(50000),
        nonce,
        deadline: '1714762357000',
      };
  
      const signature = await (signer as ethers.Signer).signTypedData(domain, types, message);
      console.log(`Signature hash: ${signature}`);
      
      const formattedSignature = ethers.Signature.from(signature);
  
      const dispatch = await callPermit.dispatch(
        message.from,
        message.to,
        message.value,
        message.data,
        message.gaslimit,
        message.deadline,
        formattedSignature.v,
        formattedSignature.r,
        formattedSignature.s
      );
  
      await dispatch.wait();
      console.log(`Transaction hash: ${dispatch.hash}`);
  
      const tx = await greeterContract.setGreeting(newGreeting);
      await tx.wait();
      setGreeting(newGreeting);
      setNewGreeting('');
    } catch (error) {
      console.error('Error setting new greeting:', error);
    }
  };
  
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-sm lg:flex">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Current Greeting: {greeting}</h2>
          <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="greeting" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Set New Greeting
              </label>
              <input
                type="text"
                id="greeting"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="New Greeting"
                value={newGreeting}
                onChange={(e) => setNewGreeting(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
