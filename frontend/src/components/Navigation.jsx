import React from 'react';

const Navigation = () => {
  return (
    <nav className="absolute top-0 left-0 right-0 z-10 p-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
            <span className="text-black font-bold text-sm">CC</span>
          </div>
          <span className="text-white font-medium text-lg">Crypto Connect</span>
        </div>
        <div className="flex items-center space-x-8">
          <button className="text-gray-400 hover:text-white transition-colors">
            Welcome
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            Login
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            Connect Wallet
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;