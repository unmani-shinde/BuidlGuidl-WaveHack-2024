import React, { useState, useEffect } from "react";
import { utils, Contract } from "zksync-web3";
import { ethers } from "ethers";
import useWeb3 from "../hooks/useWeb3";
import useAccountChanges from "../hooks/useAccountChanges";
import Greeting from "../components/Greeting";
import Input from "../components/Input";
import Loading from "../components/Spinner";
import Button from "@/components/Button";
import Title from "@/components/Title";
import ContractDropdown from "@/components/Dropdown";
import TxDetails from "@/components/TxDetails";
import PaymasterMessage from "@/components/PaymasterMessage";
import {
  GREETER_CONTRACT_ABI,
  GREETER_CONTRACT_ADDRESS,
  GASLESS_PAYMASTER_ADDRESS
} from "../constants/consts";
import InstructionsCard from "@/components/InstructionsCard";

const Home = () => {
  // State variables
  const [greeterContractInstance, setGreeterContractInstance] = useState(null);
  const [newGreeting, setNewGreeting] = useState("");
  const [greeting, setGreeting] = useState("");
  const [greeterSet, isGreeterSet] = useState("");
  const [selectedPaymaster, setSelectedPaymaster] = useState("");
  const [paymasterAddress, setPaymasterAddress] = useState("");
  const [paymasterSet, isPaymasterSet] = useState("");
  const [greeterAddress, setGreeterAddress] = useState("");
  const [inputAddress, setInputAddress] = useState("");
  const [txDetails, setTxDetails] = useState(null);
  const [qualify, isQualify] = useState("");
  const { provider, signer, setProvider, setSigner, signerBalance } = useWeb3();
  const [loading, setLoading] = useState(true);
  // Handler to manage Paymaster selection
  useEffect(() => {
    const initializeContract = async () => {
      try {
        setTxDetails(null);
        isQualify(null);

        if (provider && signer) {
          const greeterContract = new Contract(
            GREETER_CONTRACT_ADDRESS,
            GREETER_CONTRACT_ABI,
            signer
          );

          setGreeterContractInstance(greeterContract);

          const fetchedGreeting = await greeterContract.greet();
          setGreeting(fetchedGreeting);
          isGreeterSet(true);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error setting up the greeter contract:", error);
      }
    };

    initializeContract();
  }, [provider, signer]);
  
 
  const updateGreeting = async (newGreeting, params) => {
    try {
      let txHandle;
      if (params) {
        txHandle = await greeterContractInstance.setGreeting(
          newGreeting,
          params,
        );
      } else {
        txHandle = await greeterContractInstance.setGreeting(newGreeting);
      }
      // Wait until the transaction is committed
      await txHandle.wait();
      // Set transaction details
      setTxDetails(txHandle.hash);

      // Update greeting
      const updatedGreeting = await greeterContractInstance.greet();
      setGreeting(updatedGreeting);
    } catch (error) {
      console.error("Failed to update greeting: ", error);
    }
  };
  // Handler to pay for greeting change
  const payForGreetingChange = async () => {
    try {
      const paymasterResult = await payWithPayMaster();
      if (paymasterResult.error) {
        // Handle the error message here
        
        if (
          paymasterResult.error.data.message.includes(
            "failed paymaster validation",
          )
        ) {
          isQualify(false);
          console.log(
            "You do not qualify to use the paymaster. You will have to pay your own way!",
          );
          await updateGreeting(newGreeting);
        }
      } else {
        console.log("no error");
        isQualify(true);
        await updateGreeting(newGreeting, paymasterResult);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Function to get Paymaster params; TODO: move these to utils
  const getPaymasterParams = async () => {
    let params;
    params = utils.getPaymasterParams(GASLESS_PAYMASTER_ADDRESS, {
      type: "General",
      innerInput: new Uint8Array(),
    });

    return params;
  };
  // Pays for the transaction with the Paymaster
  const payWithPayMaster = async () => {
    try {
      const gasPrice = await provider.getGasPrice();

      const paramsForFeeEstimation = await getPaymasterParams();

      const gasLimit = await greeterContractInstance.estimateGas.setGreeting(
        newGreeting,
        {
          customData: {
            gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
            paymasterParams: paramsForFeeEstimation,
          },
        },
      );

      const paymasterParams = await getPaymasterParams();
      return {
        maxFeePerGas: gasPrice,
        maxPriorityFeePerGas: ethers.BigNumber.from(0),
        gasLimit,
        customData: {
          gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
          paymasterParams,
        },
      };
    } catch (error) {
      return { error: error };
    }
  };

  return (
    <div className="flex flex-col min-h-screen py-2 mb-10">
      <Title />
      <div className="mt-8 mx-8 max-w-fit">
        <InstructionsCard />
      </div>
      <Greeting greeting={greeting} />
      

      <div className="flex flex-row">
        <Input
          placeholder="Greeter message..."
          title="Enter Greeter message"
          className="ml-8 mt-10"
          value={newGreeting}
          onChange={(e) => setNewGreeting(e.target.value)}
        />
        <Button className="mt-16" onClick={() => payForGreetingChange()}>
          Change Greeting{" "}
        </Button>
      </div>
      {qualify ? (
        <p className="text-green-600 ml-8">
          You are lucky! You qualify to use the paymaster!
        </p>
      ) : (
        <p className="text-red-600 ml-8">
          You do not qualify and will have to pay your own way!
        </p>
      )}
      {txDetails ? (
        <TxDetails
          txHash={txDetails}
          signer={signer}
          initialSignerBalance={signerBalance}
        />
      ) : null}
    </div>
  );
};

export default Home;
