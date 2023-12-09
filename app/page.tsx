'use client'
import Image from 'next/image'
import { payUsingBase } from "paasskeys-server"
import { useState } from 'react';
import { client } from '@passwordless-id/webauthn'
import {ethers} from "ethers";

export default function Home() {

  const [privateKey, setPrivateKey] = useState("");
  const [address, setAddress] = useState("");
  const [ev, setEv] = useState("");
  const[addr,setAddr]=useState("");
  const[tx,setTx]=useState("");
  const generatePopUp = async () => {
    let parentUrl = window.location.href; // Or window.location.origin for just the origin
    let popupUrl = "http://localhost:3000?parentUrl=" + encodeURIComponent(parentUrl) + "&username=" + encodeURIComponent("archis");
    let popup = window.open(popupUrl, "Generating passkey", "height=400,width=600,resizable=yes");

    window.addEventListener('message', async (event) => {
      if (event.origin !== "http://localhost:3000") return;

      if (typeof event.data === 'string') {
        console.log("Received value from popup:", event.data);
        setPrivateKey(event.data)
        popup?.close();
        //BASE Paymaster Integration
        try {
          const { address, ev } = (await payUsingBase(event.data))
          setAddress(address);
          setEv(ev?.transactionHash||"");
        } catch (e) {
          console.log(e)
        }
      }
    }, false);
  }

  const generateClientRegister = async () => {
    const challenge = "a7c61ef9-dc23-4806-b486-2428938a547e"
    const registration = await client.register("archis", challenge, {
      authenticatorType: "auto",
      userVerification: "required",
      timeout: 60000,
      attestation: false,
      userHandle: "recommended to set it to a random 64 bytes value",
      debug: false
    })

    console.log(registration)
    const pvtkey = ethers.keccak256(ethers.toUtf8Bytes(registration.credential.id));
    const{address,ev}=await payUsingBase(pvtkey);
    setAddr(address);
    setTx(ev?.transactionHash||"");
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <button onClick={generatePopUp} className='text-white'>Generate</button>
      </div> */}
      <div className='flex flex-row h-full w-full' >
        <div className='flex flex-col h-full w-1/2 items-center justify-center' >
          <p>With SDK</p>
          <button onClick={generatePopUp} >
            Generate
          </button>
          <p>
            SCW Address : {address}
          </p>
          <p>
            Transaction Hash : {ev}
          </p>
        </div>
        <div className='flex flex-col h-full w-1/2 items-center justify-center' >
          <p>Without SDK</p>
          <button onClick={generateClientRegister} >
            Generate
          </button>
          <p>
            SCW Address : {addr}
          </p>
          <p>
            Transaction Hash : {tx}
          </p>
        </div>
      </div>
    </main>
  )
}
