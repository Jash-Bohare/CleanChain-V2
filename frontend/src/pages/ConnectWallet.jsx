import React from "react";
import { connectWallet } from "../utils/wallet";

export default function ConnectWallet() {
  const handleConnect = async () => {
    const wallet = await connectWallet();
    console.log("Connected wallet:", wallet);
  };

  return (
    <div className="text-white bg-[#0d0d0d] min-h-screen flex items-center justify-center">
      <div>
        <h1 className="text-2xl font-semibold mb-4">Connect Wallet</h1>
        <button
          onClick={handleConnect}
          className="py-2 px-6 bg-white text-black font-bold rounded hover:bg-gray-200"
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
}
