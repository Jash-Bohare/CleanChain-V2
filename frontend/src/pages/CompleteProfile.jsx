import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Logo from '../components/Logo';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '../api';

const CompleteProfile = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedWallet = localStorage.getItem('walletAddress') || '';
    setWalletAddress(savedWallet);
    if (!savedWallet) {
      navigate('/');
    }
    // Only prefill if userEmail/username exist (i.e., returning user)
    const savedEmail = localStorage.getItem('userEmail');
    const savedUsername = localStorage.getItem('username');
    setEmail(savedEmail || '');
    setUsername(savedUsername || '');
  }, [navigate]);

  const handleSave = async () => {
    if (!walletAddress || !username) {
      alert('Wallet address and username are required.');
      return;
    }
    setLoading(true);
    try {
      const res = await updateUserProfile({ walletAddress, username, email });
      if (res && res.message === 'Profile updated successfully') {
        localStorage.setItem('userEmail', email);
        localStorage.setItem('username', username);
        alert('Profile saved successfully!');
        navigate('/map');
      } else {
        alert('Failed to update profile.');
      }
    } catch (err) {
      alert('Error updating profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/map');
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] relative overflow-hidden">
      <Navigation />
      {/* Decorative dots pattern */}
      <div className="absolute bottom-0 left-0 opacity-20">
        <div className="grid grid-cols-8 gap-2 p-8">
          {[...Array(64)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-white rounded-full"></div>
          ))}
        </div>
      </div>
      {/* Main content */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center text-center">
            <Logo />
            <h1 className="text-white text-4xl font-bold mb-4 leading-tight">
              Complete Your Profile
            </h1>
            <p className="text-gray-400 text-sm uppercase tracking-wider mb-12">
              Confirm your information
            </p>
            <div className="w-full space-y-6">
              {/* Email */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                />
              </div>
              {/* Username */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="yourname"
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                />
              </div>
              {/* Show wallet address if present */}
              {walletAddress && (
                <div className="w-full py-3 px-6 bg-gray-800 text-white font-semibold rounded-lg flex items-center justify-center space-x-2">
                  <span>🦊</span>
                  <span>
                    Wallet Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </span>
                </div>
              )}
              {/* Save & Continue */}
              <button
                onClick={handleSave}
                className="w-full py-3 px-6 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                disabled={loading}
              >
                <span>✅</span>
                <span>{loading ? 'Saving...' : 'Save & Continue'}</span>
              </button>
              {/* Skip */}
              <button
                onClick={handleSkip}
                className="w-full py-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
