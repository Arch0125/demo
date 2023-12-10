"use client";
import Image from "next/image";
import { generateUsingBase, payUsingBase } from "paasskeys-server";
import { useState } from "react";
import { client } from "@passwordless-id/webauthn";
import { ethers } from "ethers";

export default function Home() {
  const [privateKey, setPrivateKey] = useState("");
  const [address, setAddress] = useState("");
  const [ev, setEv] = useState("");
  const [addr, setAddr] = useState("");
  const [tx, setTx] = useState("");
  const generatePopUp = async () => {
    let parentUrl = window.location.href; // Or window.location.origin for just the origin
    let popupUrl =
      "http://localhost:3000?parentUrl=" +
      encodeURIComponent(parentUrl) +
      "&username=" +
      encodeURIComponent("passkeys");
    let popup = window.open(
      popupUrl,
      "Generating passkey",
      "height=400,width=600,resizable=yes"
    );

    window.addEventListener(
      "message",
      async (event) => {
        if (event.origin !== "http://localhost:3000") return;

        if (typeof event.data === "string") {
          console.log("Received value from popup:", event.data);
          setPrivateKey(event.data);
          popup?.close();
          //BASE Paymaster Integration
          const address1 = await generateUsingBase(event.data);
          setAddress(address1);
          const {address,ev}=await payUsingBase(event.data);
          setEv(ev?.transactionHash||"");
        }
      },
      false
    );
  };

  const generateClientRegister = async () => {
    const challenge = "a7c61ef9-dc23-4806-b486-2428938a547e";
    const registration = await client.register("passkeys", challenge, {
      authenticatorType: "auto",
      userVerification: "required",
      timeout: 60000,
      attestation: false,
      userHandle: "recommended to set it to a random 64 bytes value",
      debug: false,
    });

    console.log(registration);
    const pvtkey = ethers.keccak256(
      ethers.toUtf8Bytes(registration.credential.id)
    );
    const address = await generateUsingBase(pvtkey);
    setAddr(address);
    // setTx(ev?.transactionHash||"");
  };
  return (
    <main className="flex h-10 flex-col items-center justify-between p-24">
      {/* <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <button onClick={generatePopUp} className='text-white'>Generate</button>
      </div> */}
      <div className="flex flex-row">
        <div className="flex flex-col ">
          {" "}
          <div className="z-10 max-w-xl w-full items-center justify-between font-mono text-sm lg:flex">
            <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-2 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
              With SDK&nbsp;
            </p>
          </div>
          <div className="flex  items-center justify-center p-12">
            <div className="max-w-fit rounded-3xl bg-gradient-to-b from-sky-300 to-purple-500 p-px dark:from-gray-800 dark:to-transparent">
              <div className="rounded-[calc(1.5rem-1px)] bg-white px-10 p-12 dark:bg-gray-900">
                <div>
                  <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Create Smart Wallet
                  </h1>
                  <p className="text-sm tracking-wide text-gray-600 dark:text-gray-300">
                    Powered by Stackup
                  </p>
                </div>

                <div className="mt-8 space-y-8">
                  <p>
                    Acc : {address}
                  </p>
                  <p>
                    Tx Hash : {ev}
                  </p>
                  <button
                    onClick={generatePopUp}
                    className="h-9 px-3 w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:bg-blue-700 transition duration-500 rounded-md text-white"
                  >
                    Generate & Send Tx
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="z-10 max-w-xl w-full items-center justify-between font-mono text-sm lg:flex">
            <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-2 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
              Without SDK&nbsp;
            </p>
          </div>
          <div className="flex  items-center justify-center p-12">
            <div className="max-w-sm rounded-3xl bg-gradient-to-b from-sky-300 to-purple-500 p-px dark:from-gray-800 dark:to-transparent">
              <div className="rounded-[calc(1.5rem-1px)] bg-white px-10 p-12 dark:bg-gray-900">
                <div>
                  <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Create Smart Wallet
                  </h1>
                  <p className="text-sm tracking-wide text-gray-600 dark:text-gray-300">
                    Powered by Stackup
                  </p>
                </div>

                <div className="mt-8 space-y-8">
                  <p>
                    Acc : {addr.slice(0, 7)}...{addr.slice(36)}
                  </p>
                  <button
                    onClick={generateClientRegister}
                    className="h-9 px-3 w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:bg-blue-700 transition duration-500 rounded-md text-white"
                  >
                    Generate & Send Tx
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
