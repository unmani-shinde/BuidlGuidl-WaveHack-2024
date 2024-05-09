"use client";

//import Link from "next/link";
// import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
// import { Address } from "~~/components/scaffold-eth";
import HeroBanner from "../components/Hero";
import type { NextPage } from "next";
import { useAccount } from "wagmi";

const Home: NextPage = () => {
  // const { address: connectedAddress } = useAccount();

  return (
    <>
      <HeroBanner />
    </>
  );
};

export default Home;
