import React from 'react';

const Logo = () => {
  return (
    <div className="w-16 h-16 bg-transparent border-2 border-white rounded-lg flex items-center justify-center rotate-45 mb-8">
      <div className="transform -rotate-45">
        <span className="text-white font-bold text-xl">CC</span>
      </div>
    </div>
  );
};

export default Logo;