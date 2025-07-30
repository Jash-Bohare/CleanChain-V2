import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { Coins, TrendingUp, MapPin, Heart, Users, Calendar, ChevronUp, CheckCircle, Clock, AlertCircle, User, Wallet } from 'lucide-react';
import { getUserLocations, getUserProfile, getWalletBalance, getTokenBalance, uploadAfterImage } from '../api';

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    tokens: 0
  });
  const [walletBalances, setWalletBalances] = useState({
    ethBalance: 0,
    tokenBalance: 0
  });
  const [animatedTokens, setAnimatedTokens] = useState(0);
  const [claimedPlaces, setClaimedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const initDashboard = async () => {
      try {
        setLoading(true);
        await loadDashboardData();
      } catch (err) {
        console.error('Error initializing dashboard:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, []);

  const animateTokenCounter = (targetTokens) => {
    const duration = 2000;
    const steps = 60;
    const increment = targetTokens / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(current + increment, targetTokens);
      setAnimatedTokens(Math.floor(current));
      
      if (step >= steps) {
        clearInterval(timer);
        setAnimatedTokens(targetTokens);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  };

  const getStatusIcon = (status, cleaned, rewarded, verified) => {
    if (verified) {
      return <CheckCircle className="text-green-400" size={16} />;
    } else if (cleaned && rewarded) {
      return <CheckCircle className="text-green-400" size={16} />;
    } else if (cleaned && !rewarded) {
      return <Clock className="text-blue-400" size={16} />;
    } else if (status === 'photo_uploaded') {
      return <Clock className="text-purple-400" size={16} />;
    } else if (status === 'claimed') {
      return <Clock className="text-yellow-400" size={16} />;
    } else {
      return <AlertCircle className="text-red-400" size={16} />;
    }
  };

  const getStatusText = (status, cleaned, rewarded, verified) => {
    if (verified) {
      return 'Verified';
    } else if (cleaned && rewarded) {
      return 'Rewarded';
    } else if (cleaned && !rewarded) {
      return 'Cleaned';
    } else if (status === 'photo_uploaded') {
      return 'Photo Uploaded';
    } else if (status === 'claimed') {
      return 'Claimed';
    } else {
      return 'Unknown';
    }
  };

  const getStatusColor = (status, cleaned, rewarded, verified) => {
    if (verified) {
      return 'text-green-400';
    } else if (cleaned && rewarded) {
      return 'text-green-400';
    } else if (cleaned && !rewarded) {
      return 'text-blue-400';
    } else if (status === 'photo_uploaded') {
      return 'text-purple-400';
    } else if (status === 'claimed') {
      return 'text-yellow-400';
    } else {
      return 'text-red-400';
    }
  };

  const calculateStats = () => {
    const totalPlacesClaimed = claimedPlaces.length;
    const totalCleaned = claimedPlaces.filter(place => place.cleaned || place.verified).length;
    const totalVerified = claimedPlaces.filter(place => place.verified).length;
    const totalRewarded = claimedPlaces.filter(place => place.rewarded).length;
    const totalUpvotes = claimedPlaces.reduce((sum, place) => {
      const votes = place.votes || [];
      return sum + votes.filter(v => v.voteType === 'up').length;
    }, 0);

    return {
      totalPlacesClaimed,
      totalCleaned,
      totalVerified,
      totalRewarded,
      totalUpvotes
    };
  };

  const handleImageUpload = async (locationId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(locationId);
      await uploadAfterImage(locationId, file);
      
      // Refresh the locations data
      await loadDashboardData();
      
      setToast('Image uploaded successfully!');
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setToast('Failed to upload image. Please try again.');
      setTimeout(() => setToast(null), 3000);
    } finally {
      setUploadingImage(null);
    }
  };

  const loadDashboardData = async () => {
    try {
      const walletAddress = localStorage.getItem('walletAddress');
      
      if (!walletAddress) {
        setError('No wallet connected');
        return;
      }

      // Fetch user profile, locations, and wallet balance in parallel
      const [profileData, locationsData] = await Promise.all([
        getUserProfile(walletAddress),
        getUserLocations(walletAddress)
      ]);

      // Try to fetch wallet balance, but don't fail if it doesn't work
      let balanceData = { tokenBalance: 0, ethBalance: 0 };
      try {
        balanceData = await getWalletBalance(walletAddress);
      } catch (balanceError) {
        console.warn('Could not fetch wallet balance:', balanceError);
        // Use Firestore tokens as fallback
        balanceData = { 
          tokenBalance: profileData.userData?.tokens || 0,
          ethBalance: 0
        };
      }

      // Set user info and wallet balances
      setUserInfo({
        username: profileData.userData?.username || localStorage.getItem('username') || 'Explorer',
        email: profileData.userData?.email || localStorage.getItem('email') || '',
        tokens: balanceData.tokenBalance || 0
      });

      setWalletBalances({
        ethBalance: balanceData.ethBalance || 0,
        tokenBalance: balanceData.tokenBalance || 0
      });

      // Set claimed places and log for debugging
      console.log('Dashboard - User Locations Data:', locationsData.locations);
      console.log('Dashboard - Total locations found:', locationsData.locations?.length || 0);
      setClaimedPlaces(locationsData.locations || []);

      // Animate token counter
      animateTokenCounter(balanceData.tokenBalance || 0);

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
    }
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 text-lg">{error}</p>
        </div>
      </div>
    );
  }

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
      
      <Navigation />
      
      <div className="pt-32 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-300 text-sm">Welcome back, @{userInfo.username}</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider">Wallet Balance</p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
              <div className="flex items-center justify-center sm:justify-end space-x-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">Ξ</span>
                </div>
                <span className="text-white text-lg sm:text-2xl font-bold">
                  {walletBalances.ethBalance.toFixed(4)}
                </span>
                <span className="text-blue-400 text-xs sm:text-sm font-medium">Sepolia ETH</span>
              </div>
              
              <div className="flex items-center justify-center sm:justify-end space-x-2">
                <Coins className="text-yellow-500" size={20} />
                <span className="text-white text-lg sm:text-2xl font-bold">
                  {animatedTokens.toLocaleString()}
                </span>
                <span className="text-yellow-500 text-xs sm:text-sm font-medium">ECO</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="bg-[#1a1a1a]/80 backdrop-blur-sm border border-gray-700 rounded-xl p-4 sm:p-6 mb-6">
          <div className="mb-4">
            <h2 className="text-white text-lg sm:text-xl font-bold">Profile Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-400 text-sm uppercase tracking-wider mb-2">Username</label>
              <p className="text-white text-base sm:text-lg">@{userInfo.username}</p>
            </div>

            <div>
              <label className="block text-gray-400 text-sm uppercase tracking-wider mb-2">Email</label>
              <p className="text-white text-base sm:text-lg">{userInfo.email || 'Not provided'}</p>
            </div>

            <div>
              <label className="block text-gray-400 text-sm uppercase tracking-wider mb-2">Wallet Address</label>
              <div className="flex items-center space-x-2">
                <Wallet className="text-gray-400" size={16} />
                <p className="text-white font-mono text-sm">
                  {localStorage.getItem('walletAddress')?.slice(0, 6)}...{localStorage.getItem('walletAddress')?.slice(-4)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-[#1a1a1a]/80 backdrop-blur-sm border border-gray-700 rounded-xl p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Total Claimed</p>
                <p className="text-white text-lg sm:text-xl font-bold">{stats.totalPlacesClaimed}</p>
              </div>
              <MapPin className="text-blue-400" size={18} />
            </div>
          </div>
          
          <div className="bg-[#1a1a1a]/80 backdrop-blur-sm border border-gray-700 rounded-xl p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Total Cleaned</p>
                <p className="text-white text-lg sm:text-xl font-bold">{stats.totalCleaned}</p>
              </div>
              <CheckCircle className="text-green-400" size={18} />
            </div>
          </div>
          
          <div className="bg-[#1a1a1a]/80 backdrop-blur-sm border border-gray-700 rounded-xl p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Total Verified</p>
                <p className="text-white text-lg sm:text-xl font-bold">{stats.totalVerified}</p>
              </div>
              <CheckCircle className="text-blue-400" size={18} />
            </div>
          </div>
          
          <div className="bg-[#1a1a1a]/80 backdrop-blur-sm border border-gray-700 rounded-xl p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Total Rewarded</p>
                <p className="text-white text-lg sm:text-xl font-bold">{stats.totalRewarded}</p>
              </div>
              <Heart className="text-yellow-400" size={18} />
            </div>
          </div>
        </div>

        {/* User Locations Section */}
        <div className="mb-0 pb-8 sm:pb-12">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-white text-lg sm:text-xl font-bold">Your Locations</h2>
            <p className="text-gray-400 text-sm mt-1">All your claimed, cleaned, and verified locations</p>
          </div>

          {claimedPlaces.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <MapPin className="text-gray-400 mx-auto mb-4" size={48} />
              <p className="text-gray-400 text-base sm:text-lg">No locations yet</p>
              <p className="text-gray-500 text-sm mt-2">Start by claiming a location on the map!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {claimedPlaces.map((place) => (
                <div key={place.id} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-500/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-[#1a1a1a]/80 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden hover:border-green-400/50 hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02]">
                    <div className="relative">
                      <img 
                        src={place.beforePhotoUrl || 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=400'} 
                        alt={place.name}
                        className="w-full h-32 sm:h-40 object-cover group-hover:brightness-110 transition-all duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
                        {getStatusIcon(place.status, place.cleaned, place.rewarded, place.verified)}
                        <span className={`text-xs font-medium ${getStatusColor(place.status, place.cleaned, place.rewarded, place.verified)}`}>
                          {getStatusText(place.status, place.cleaned, place.rewarded, place.verified)}
                        </span>
                      </div>
                      
                      {/* Reward badge for cleaned locations */}
                      {place.rewarded && (
                        <div className="absolute bottom-2 left-2 bg-green-600/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
                          <Coins size={10} className="text-white" />
                          <span className="text-white text-xs font-medium">+{place.rewardTokens || 10}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-3 sm:p-4">
                      <h3 className="text-white font-semibold mb-2 group-hover:text-green-400 transition-colors text-sm sm:text-base">
                        {place.name}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="text-gray-400" size={12} />
                        <span className="text-gray-400 text-xs sm:text-sm">
                          {place.lat?.toFixed(4)}, {place.lng?.toFixed(4)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="text-gray-400" size={12} />
                        <span className="text-gray-400 text-xs sm:text-sm">
                          {place.claimedAt ? new Date(place.claimedAt).toLocaleDateString() : 'Unknown date'}
                        </span>
                      </div>
                      
                      {/* Reward Tokens Display */}
                      {place.rewardTokens && (
                        <div className="flex items-center space-x-2 mb-2">
                          <Coins className="text-yellow-500" size={12} />
                          <span className="text-yellow-500 text-xs sm:text-sm font-medium">
                            Reward: {place.rewardTokens} ECO tokens
                          </span>
                        </div>
                      )}
                      
                      {/* Upload button for claimed locations */}
                      {place.status === 'claimed' && (
                        <div className="mt-2">
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(place.id, e)}
                              className="hidden"
                              disabled={uploadingImage === place.id}
                            />
                            <div className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-3 rounded-lg transition-colors text-xs sm:text-sm font-medium">
                              {uploadingImage === place.id ? 'Uploading...' : 'Upload After Photo'}
                            </div>
                          </label>
                        </div>
                      )}

                      {/* Show after photo if uploaded */}
                      {place.afterPhotoUrl && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-400 mb-1">After Photo:</p>
                          <img 
                            src={place.afterPhotoUrl} 
                            alt="After cleanup" 
                            className="w-full h-24 sm:h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;