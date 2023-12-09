'use client'
import Image from 'next/image'

export default function Home() {

  const generatePopUp = async () => {
    let parentUrl = window.location.href; // Or window.location.origin for just the origin
    let popupUrl = "http://localhost:3000?parentUrl=" + encodeURIComponent(parentUrl);
    let popup = window.open(popupUrl, "Generating passkey", "height=400,width=600,resizable=yes");
        window.addEventListener('message', (event) => {
      if (event.origin !== "http://localhost:3000") return;

      if (typeof event.data === 'string') {
        console.log("Received value from popup:", event.data);
        popup?.close();
      }
    }, false);
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <button onClick={generatePopUp} className='text-white'>Generate</button>
      </div>
    </main>
  )
}
