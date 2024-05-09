"use client";

// import Link from "next/link";
// import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
// import { Address } from "~~/components/scaffold-eth";
import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";

const GetStarted: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [secret, setSecret] = useState<number[]>([]);
  const [displayedSecretIndex, setDisplayedSecretIndex] = useState<number>(0);
  const [showSecret, setShowSecret] = useState<boolean>(false);
  const [generated, setGenerated] = useState<boolean>(false);

  useEffect(() => {
    if (secret.length > 0 && showSecret) {
      const interval = setInterval(() => {
        setDisplayedSecretIndex(prevIndex => (prevIndex < secret.length - 1 ? prevIndex + 1 : 0));
      }, 1000); // Change interval duration as needed
      return () => clearInterval(interval);
    }
  }, [secret, displayedSecretIndex, showSecret]);

  const handleToggleShowSecret = () => {
    setShowSecret(!showSecret);
  };

  function generateRandomArray() {
    if (!generated) {
      const randomArray = [];
      for (let i = 0; i < 12; i++) {
        randomArray.push(Math.floor(Math.random() * 1000)); // Generates random number between 0 and 999
      }
      setSecret(randomArray);
      setGenerated(true);
    }
  }

  const displayedSecret = secret.slice(0, displayedSecretIndex + 1).join(", ");

  return (
    <>
      <section
        style={{ marginBottom: "-3vh" }}
        className="bg-gradient-to-b from-cyan-400 to-cyan-100 dark:bg-gradient-to-b dark:from-cyan-900 dark:to-cyan-500 flex items-left flex-col flex-grow pt-10 "
      >
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div style={{ marginBottom: "-3vh" }} className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
              Create Your (Secret) Profile
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" action="#" method="POST">
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                  Connected Wallet Address
                </label>
                <div className="mt-2">
                  <input
                    id="connected-address"
                    name="Connected Wallet Address"
                    type="string"
                    value={connectedAddress}
                    readOnly
                    style={{ paddingLeft: "0.5vw" }}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black-900 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6 dark:bg-slate-50  border"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-90 dark:text-white"
                  >
                    Create Your Secret
                  </label>
                  {!generated && (
                    <div className="text-sm">
                      <a
                        onClick={generateRandomArray}
                        href="#"
                        style={{ cursor: "pointer" }}
                        className="font-semibold text-cyan-600 dark:text-cyan-100 hover:text-cyan-950"
                      >
                        Generate Secret
                      </a>
                    </div>
                  )}
                  {generated && (
                    <div className="text-sm">
                      <a
                        onClick={handleToggleShowSecret}
                        href="#"
                        style={{ cursor: "pointer" }}
                        className="font-semibold text-cyan-600 dark:text-cyan-100 hover:text-cyan-950"
                      >
                        {showSecret ? "Hide Secret" : "Show Secret"}
                      </a>
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="text"
                    autoComplete="off"
                    style={{ paddingLeft: "0.5vw" }}
                    required
                    value={
                      secret.length == 0 ? "No Secret Generated" : showSecret ? displayedSecret : "****************"
                    }
                    readOnly
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-cyan-600 dark:bg-cyan-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                >
                  Continue to Create Profile
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-black dark:text-white">
              Already a member?{" "}
              <a href="#" className="font-semibold text-cyan-600 dark:text-cyan-100 hover:text-cyan-950">
                Click Here to Login
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default GetStarted;
