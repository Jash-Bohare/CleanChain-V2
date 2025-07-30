import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Wallet, CheckCircle, ArrowRight } from 'lucide-react';
import { updateUserProfile } from '../api';

const CompleteProfile = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
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
      setToast('Wallet address and username are required.');
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setLoading(true);
    try {
      const res = await updateUserProfile({ walletAddress, username, email });
      if (res && res.message === 'Profile updated successfully') {
        localStorage.setItem('userEmail', email);
        localStorage.setItem('username', username);
        setToast('Profile saved successfully!');
        setTimeout(() => {
          setToast(null);
          navigate('/map');
        }, 2000);
      } else {
        setToast('Failed to update profile.');
        setTimeout(() => setToast(null), 3000);
      }
    } catch (err) {
      setToast('Error updating profile.');
      setTimeout(() => setToast(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/map');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/3 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Floating elements */}
        <div className="absolute top-32 right-32 w-8 h-8 bg-green-400/10 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-32 left-32 w-6 h-6 bg-emerald-400/10 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-blue-400/10 rounded-full animate-bounce delay-1000"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-[60] text-lg font-semibold">
          {toast}
        </div>
      )}

      {/* Main content */}
      <div className="flex items-center justify-center min-h-screen px-4 relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-[#1a1a1a]/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-white text-2xl sm:text-3xl font-bold mb-2">
                Complete Your Profile
              </h1>
              <p className="text-gray-400 text-sm">
                Set up your account to start earning ECO tokens
              </p>
            </div>

            <div className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2 flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2 flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Username</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="yourname"
                  className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                />
              </div>

              {/* Show wallet address if present */}
              {walletAddress && (
                <div className="bg-[#0d0d0d] border border-gray-700 rounded-lg p-4 flex items-center space-x-3">
                  <Wallet className="text-green-400" size={20} />
                  <div className="flex-1">
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Connected Wallet</p>
                    <p className="text-white font-mono text-sm">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </p>
                  </div>
                  <CheckCircle className="text-green-400" size={16} />
                </div>
              )}

              {/* Save & Continue */}
              <button
                onClick={handleSave}
                className="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center space-x-2 shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Save & Continue</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
