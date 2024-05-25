"use client"

import { Contract, BrowserProvider, Provider, utils } from "zksync-ethers";
import { ethers } from "ethers";
import allowedTokens from "./eth.json"; // change to "./erc20.json" to use ERC20 tokens
import GreeterContractABI from "../../../artifacts-zk/contracts/Greeter.sol/Greeter.json";
import { useState,useEffect } from "react";
declare var window: any
declare let selectedToken: SelectedToken;
interface SelectedToken {
  value: {
      l2Address: string;
      decimals: number;
  };
}




export default function Home() {
  const GreeterContractAddress = "0x4a0f002986D9Bb669CA509F264C1bAf9D6c80588";
  const [selectedToken, setSelectedToken] = useState<SelectedToken | null>(null);
  const [newGreeting,setNewGreeting]= useState<String>("");
  const [currentGreeting,setCurrentGreeting] = useState<String>("");
  const [currentGasFee,setCurrentGasFee] = useState<String>("");
  let provider: Provider;
  let signer: ethers.Signer;
  let contract: Contract;
  const initializeProviderAndSigner = async (): Promise<void> => {
    provider = new Provider("https://sepolia.era.zksync.dev");
    // Ensure window.ethereum is of type any to avoid type errors
    signer = await new BrowserProvider(window.ethereum as any).getSigner();
    contract = new Contract(GreeterContractAddress, GreeterContractABI.abi, signer);
};

useEffect(() => {
  // Example logic to set selectedToken from allowedTokens
  if (allowedTokens && allowedTokens.length > 0) {
    const token = allowedTokens[0]; // Select the first token as an example
    setSelectedToken({
      value: {
        l2Address: token.address,
        decimals: token.decimals,
      }
    });
  }
}, []);

useEffect(() => {
  const initialize = async () => {
    await initializeProviderAndSigner();
    const greeting = await getGreeting();
    setCurrentGreeting(greeting);
    const gasFee = await getFee();
    if(gasFee==undefined)return;
    setCurrentGasFee(gasFee);
  };

  initialize();
}, []);

const getGreeting = async () => {
  // Smart contract calls work the same way as in `ethers`
  return await contract.greet();
};

const getFee = async () => {
  if(selectedToken!==null){
    const feeInGas = await contract.setGreeting.estimateGas(newGreeting);
  const gasPriceInUnits = await provider.getGasPrice();
  return ethers.formatUnits(feeInGas * gasPriceInUnits, selectedToken.value.decimals);
  }
  
};

const getOverrides = async()=> {
  let testnetPaymaster: string | null;

  testnetPaymaster = await provider?.getTestnetPaymasterAddress();
  if(testnetPaymaster==null){testnetPaymaster="NULL";;
  }
  if(selectedToken==null){return;}
  const gasPrice = await provider?.getGasPrice();
  const paramsForFeeEstimation = utils.getPaymasterParams(
    testnetPaymaster,
    {
      type: "ApprovalBased",
      minimalAllowance: BigInt("1"),
      token: selectedToken.value.l2Address,
      innerInput: new Uint8Array(),
    }
  );

  const gasLimit = await contract.setGreeting.estimateGas(
    newGreeting,
    {
      customData: {
        gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
        paymasterParams: paramsForFeeEstimation,
      },
    }
  );    

  const fee = gasPrice * gasLimit;

  const paymasterParams = utils.getPaymasterParams(testnetPaymaster, {
    type: "ApprovalBased",
    token: selectedToken.value.l2Address,
    // provide estimated fee as allowance
    minimalAllowance: fee,
    // empty bytes as testnet paymaster does not use innerInput
    innerInput: new Uint8Array(),
  });

  return {
    maxFeePerGas: gasPrice,
    maxPriorityFeePerGas: BigInt(1),
    gasLimit,
    customData: {
      gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
      paymasterParams,
    },
  };
  return {};
}





const changeGreeting = async () => {
  try {
    const overrides = await getOverrides();
    const txHandle = await contract.setGreeting(newGreeting,overrides);
    await txHandle.wait();
    // Update greeting
    let current = await getGreeting();
    setCurrentGreeting(current);
    let fee = await getFee();
    if(fee==undefined) return;
    setCurrentGasFee(fee);
  } catch (e) {
    console.error(e);
    alert(e);
  }
};

  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form style={{marginTop:'30vh'}}>
  <div className="mb-5">
    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter New Greeting</label>
    <input id="newGreeting"
          onChange={(e)=>{setNewGreeting(e.target.value)}} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Hahahahaaa World" required />
  </div>

  
  <button onClick={(e)=>{e.preventDefault();changeGreeting();
  }} type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Change Greeting</button>
</form>
<h3>Current Greeting: {currentGreeting} </h3>
<h3>Current Expected Gas Fee: {currentGasFee} </h3>
      
      {/* <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
       
        
      </div> */}

      {/* <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        
      </div> */}
      

      
      
      




      {/* <div className="greeting-input">
        <input
          id="newGreeting"
          placeholder="Write new greeting here..."
          onChange={(e)=>{setNewGreeting(e.target.value)}}
        />

        <button
          className="change-button"
          onClick={()=>{console.log("Hello");
          }}
        >
          <span>Change greeting</span>

        </button>
      </div> */}
        

      

        
      
    </main>
  );
}
