import React, { useState } from "react";
import { connectWallet } from "../utils/wallet";
import { walletLogin } from "../api";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Leaf, ShieldCheck, Gift } from 'lucide-react';

const features = [
  {
    icon: <Gift className="w-8 h-8 text-green-400 mb-2" />, 
    title: "Earn Rewards",
    desc: "Get eco-tokens for every verified cleanup you complete."
  },
  {
    icon: <Leaf className="w-8 h-8 text-emerald-400 mb-2" />, 
    title: "Eco Impact",
    desc: "Track your positive environmental impact on the blockchain."
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-blue-400 mb-2" />, 
    title: "Verified & Transparent",
    desc: "All cleanups are verified and stored transparently."
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-yellow-400 mb-2" />, 
    title: "Community Driven",
    desc: "Join a movement of people cleaning up the world together."
  },
];

const steps = [
  {
    icon: <ShieldCheck className="w-7 h-7 text-blue-400 mb-2" />,
    title: "Connect Wallet",
    desc: "Start by connecting your crypto wallet."
  },
  {
    icon: <Leaf className="w-7 h-7 text-emerald-400 mb-2" />,
    title: "Clean a Location",
    desc: "Find a spot, clean it, and document your work."
  },
  {
    icon: <CheckCircle className="w-7 h-7 text-yellow-400 mb-2" />,
    title: "Upload Proof",
    desc: "Share before & after photos for verification."
  },
  {
    icon: <Gift className="w-7 h-7 text-green-400 mb-2" />,
    title: "Earn Rewards",
    desc: "Receive tokens and recognition for your effort!"
  },
];

const Welcome = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleConnectWallet = async () => {
    setLoading(true);
    const address = await connectWallet();
    setLoading(false);
    if (!address) return;
    setWalletAddress(address);
    try {
      const res = await walletLogin(address);
      localStorage.setItem("walletAddress", address);
      if (res.isNewUser) {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("username");
        navigate("/complete-profile");
      } else {
        navigate("/map");
      }
    } catch (error) {
      console.error("Wallet login error:", error);
      setToast("Error logging in. Please try again.");
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900 flex flex-col relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/3 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-10 right-1/3 w-64 h-64 bg-purple-500/4 rounded-full blur-3xl animate-pulse delay-1500"></div>
        <div className="absolute bottom-10 left-1/3 w-56 h-56 bg-cyan-500/3 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-32 right-32 w-8 h-8 bg-green-400/10 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-32 left-32 w-6 h-6 bg-emerald-400/10 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-blue-400/10 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-1/3 right-1/4 w-5 h-5 bg-yellow-400/10 rounded-full animate-bounce delay-500"></div>
        <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-purple-400/10 rounded-full animate-bounce delay-1200"></div>
        <div className="absolute bottom-1/4 left-1/3 w-7 h-7 bg-cyan-400/10 rounded-full animate-bounce delay-800"></div>
        <div className="absolute top-2/3 right-1/6 w-4 h-4 bg-pink-400/10 rounded-full animate-bounce delay-1500"></div>
        <div className="absolute bottom-2/3 left-1/6 w-5 h-5 bg-orange-400/10 rounded-full animate-bounce delay-600"></div>
        
        {/* Animated lines */}
        <div className="absolute top-1/4 left-0 w-32 h-px bg-gradient-to-r from-transparent via-green-400/20 to-transparent animate-pulse"></div>
        <div className="absolute bottom-1/4 right-0 w-32 h-px bg-gradient-to-l from-transparent via-emerald-400/20 to-transparent animate-pulse delay-1000"></div>
        <div className="absolute top-0 left-1/3 w-px h-32 bg-gradient-to-b from-transparent via-blue-400/20 to-transparent animate-pulse delay-500"></div>
        <div className="absolute bottom-0 right-1/3 w-px h-32 bg-gradient-to-t from-transparent via-purple-400/20 to-transparent animate-pulse delay-1500"></div>
        
        {/* Rotating elements */}
        <div className="absolute top-20 right-20 w-16 h-16 border border-green-400/10 rounded-full animate-spin duration-20s"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 border border-emerald-400/10 rounded-full animate-spin duration-15s reverse"></div>
        <div className="absolute top-1/2 right-10 w-8 h-8 border border-blue-400/10 rounded-full animate-spin duration-25s"></div>
        
        {/* Particle effects */}
        <div className="absolute top-40 left-1/2 w-2 h-2 bg-white/5 rounded-full animate-ping delay-1000"></div>
        <div className="absolute bottom-40 right-1/2 w-1 h-1 bg-green-400/10 rounded-full animate-ping delay-2000"></div>
        <div className="absolute top-1/2 left-20 w-1.5 h-1.5 bg-emerald-400/10 rounded-full animate-ping delay-1500"></div>
        <div className="absolute bottom-1/2 right-20 w-1 h-1 bg-blue-400/10 rounded-full animate-ping delay-3000"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Subtle noise texture */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent animate-pulse"></div>
        
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-green-400/10"></div>
        <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-emerald-400/10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-blue-400/10"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-purple-400/10"></div>
      </div>
      
      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-[60] text-lg font-semibold">
          {toast}
        </div>
      )}
      <main className="flex-1 flex flex-col items-center justify-center px-4 w-full py-4 relative z-10">
        {/* Decorative elements around title */}
        <div className="relative mb-3 md:mb-4">
          <div className="absolute -top-4 -left-4 w-8 h-8 border border-green-400/30 rounded-full animate-pulse"></div>
          <div className="absolute -top-4 -right-4 w-6 h-6 border border-emerald-400/30 rounded-full animate-pulse delay-500"></div>
          <div className="absolute -bottom-4 -left-4 w-6 h-6 border border-blue-400/30 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute -bottom-4 -right-4 w-8 h-8 border border-purple-400/30 rounded-full animate-pulse delay-1500"></div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white text-center drop-shadow-lg bg-gradient-to-r from-white via-green-100 to-emerald-100 bg-clip-text text-transparent">
            Welcome to CleanChain
          </h1>
        </div>
        
        <p className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-6 md:mb-8 lg:mb-10 max-w-2xl text-center relative">
          <span className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-green-400 to-transparent"></span>
          <span className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-emerald-400 to-transparent"></span>
          Earn eco-tokens for verified waste cleanups. <br></br>
          Track your environmental impact, submit proof, and get rewarded — all powered by transparent, on-chain verification.
        </p>
        
        {!walletAddress && (
          <div className="relative">
            
            <button
              onClick={handleConnectWallet}
              className="relative w-64 md:w-72 py-3 md:py-4 px-6 md:px-8 bg-gradient-to-r from-green-400 to-emerald-500 text-black font-bold rounded-xl shadow-xl hover:from-green-500 hover:to-emerald-600 transition-all text-lg md:text-xl mb-8 md:mb-10 lg:mb-12 border border-white/20"
              disabled={loading}
            >
              {loading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          </div>
        )}
        {walletAddress && (
          <p className="mb-8 md:mb-10 lg:mb-12 text-green-400 text-base md:text-lg">
            Wallet Connected: <strong>{walletAddress}</strong>
          </p>
        )}
        
        <div className="relative">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 text-center">How It Works??</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-4 md:mb-6 w-full max-w-5xl">
          {steps.map((step, i) => (
            <div key={i} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-[#1a1a1a]/80 border border-gray-700 rounded-xl p-4 md:p-6 flex flex-col items-center shadow-lg hover:scale-105 transition-all backdrop-blur-sm group-hover:border-green-400/50">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-sm md:text-lg font-bold text-white mb-1 text-center group-hover:text-green-400 transition-colors">{step.title}</h3>
                <p className="text-gray-400 text-xs md:text-sm text-center group-hover:text-gray-300 transition-colors">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <footer className="py-2 md:py-3 text-center text-gray-500 text-xs bg-transparent relative z-10">
        <div className="flex items-center justify-center space-x-4 mb-1">
          <div className="w-8 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
          <span>&copy; {new Date().getFullYear()} CleanChain. All rights reserved.</span>
          <div className="w-8 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;