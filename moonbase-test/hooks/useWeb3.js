import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { networks } from '../hardhat.config';

const useWeb3 = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    const initializeWeb3 = async () => {
      const web3Provider = new ethers.providers.JsonRpcProvider(networks.moonbase.url);
      const web3Signer = web3Provider.getSigner();
      setProvider(web3Provider);
      setSigner(web3Signer);
    };

    initializeWeb3();
  }, []);

  return { provider, signer };
};

export default useWeb3;
