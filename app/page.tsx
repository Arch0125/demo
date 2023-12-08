'use client'
import Image from 'next/image'

export default function Home() {

  const generatePopUp= async()=>{
    let popup = window.open("http://localhost:3000","Generating passkey","height=400,width=600,resizable=yes")
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <button onClick={generatePopUp} className='text-white'>Generate</button>
      </div>
    </main>
  )
}
