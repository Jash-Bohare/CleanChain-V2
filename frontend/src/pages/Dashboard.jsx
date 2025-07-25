import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserLocations, fetchAllCleanedLocations, voteOnLocation } from '../api';

const Navigation = () => (
  <nav className="absolute top-0 left-0 right-0 z-10 p-6">
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
          <span className="text-black font-bold text-sm">CC</span>
        </div>
        <span className="text-white font-medium text-lg">CleanChain</span>
      </div>
      <div className="flex items-center space-x-8">
        <a href="/" className="text-gray-400 hover:text-white transition-colors">Welcome</a>
        <a href="/map" className="text-gray-400 hover:text-white transition-colors">Map</a>
        <a href="/dashboard" className="text-white font-medium">Dashboard</a>
      </div>
    </div>
  </nav>
);

const TokenCard = ({ tokens, username }) => (
  <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-medium opacity-90">Your Tokens</h3>
        <p className="text-3xl font-bold mt-2">{tokens || 0}</p>
        <p className="text-sm opacity-75 mt-1">CleanChain Tokens</p>
      </div>
      <div className="text-5xl opacity-20">🪙</div>
    </div>
    {username && (
      <div className="mt-4 pt-4 border-t border-green-500/30">
        <p className="text-sm opacity-90">Welcome back, <span className="font-semibold">{username}</span>!</p>
      </div>
    )}
  </div>
);

const ClaimedLocationCard = ({ location, onUploadClick }) => (
  <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors">
    <div className="flex justify-between items-start mb-3">
      <h4 className="text-white font-semibold text-lg">{location.name}</h4>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        location.cleaned 
          ? 'bg-green-900 text-green-300' 
          : 'bg-yellow-900 text-yellow-300'
      }`}>
        {location.cleaned ? 'Cleaned' : 'Claimed'}
      </span>
    </div>
    
    <div className="space-y-2 text-sm text-gray-400 mb-4">
      <p>📍 Lat: {location.lat?.toFixed(6)}, Lng: {location.lng?.toFixed(6)}</p>
      <p>🪙 Reward: {location.rewardTokens} tokens</p>
      <p>📅 Claimed: {new Date(location.claimedAt).toLocaleDateString()}</p>
    </div>

    {location.beforePhotoUrl && (
      <div className="mb-4">
        <p className="text-gray-400 text-xs mb-2">Before Photo:</p>
        <img 
          src={location.beforePhotoUrl} 
          alt="Before cleanup" 
          className="w-full h-32 object-cover rounded-lg"
        />
      </div>
    )}

    {location.afterPhotoUrl && (
      <div className="mb-4">
        <p className="text-gray-400 text-xs mb-2">After Photo:</p>
        <img 
          src={location.afterPhotoUrl} 
          alt="After cleanup" 
          className="w-full h-32 object-cover rounded-lg"
        />
      </div>
    )}

    {!location.cleaned && (
      <button
        onClick={() => onUploadClick(location)}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
      >
        📸 Upload Cleanup Photo
      </button>
    )}
  </div>
);

const CommunityVerificationCard = ({ location, onVote, userVotes }) => {
  const userVote = userVotes[location.id];
  
  return (
    <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-white font-semibold text-lg">{location.name}</h4>
        <span className="px-2 py-1 bg-blue-900 text-blue-300 rounded-full text-xs font-medium">
          Awaiting Verification
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-400 mb-4">
        <p>🧹 Cleaned by: {location.cleanedBy}</p>
        <p>📅 Completed: {new Date(location.cleanedAt || location.claimedAt).toLocaleDateString()}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {location.beforePhotoUrl && (
          <div>
            <p className="text-gray-400 text-xs mb-2">Before:</p>
            <img 
              src={location.beforePhotoUrl} 
              alt="Before cleanup" 
              className="w-full h-24 object-cover rounded-lg"
            />
          </div>
        )}
        {location.afterPhotoUrl && (
          <div>
            <p className="text-gray-400 text-xs mb-2">After:</p>
            <img 
              src={location.afterPhotoUrl} 
              alt="After cleanup" 
              className="w-full h-24 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <span className="text-green-400">👍</span>
            <span className="text-white text-sm">{location.upvotes || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-red-400">👎</span>
            <span className="text-white text-sm">{location.downvotes || 0}</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onVote(location.id, 'upvote')}
            disabled={userVote === 'upvote'}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              userVote === 'upvote'
                ? 'bg-green-600 text-white cursor-not-allowed'
                : 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
            }`}
          >
            👍 {userVote === 'upvote' ? 'Voted' : 'Approve'}
          </button>
          <button
            onClick={() => onVote(location.id, 'downvote')}
            disabled={userVote === 'downvote'}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              userVote === 'downvote'
                ? 'bg-red-600 text-white cursor-not-allowed'
                : 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
            }`}
          >
            👎 {userVote === 'downvote' ? 'Voted' : 'Reject'}
          </button>
        </div>
      </div>
    </div>
  );
};

const UploadModal = ({ location, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    try {
      await onUpload(location.id, selectedFile);
      onClose();
    } catch (error) {
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white text-xl font-semibold">Upload Cleanup Photo</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>
        
        <p className="text-gray-400 mb-4">Location: <span className="text-white">{location.name}</span></p>
        
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="w-full p-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white"
          />
        </div>

        {preview && (
          <div className="mb-4">
            <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userLocations, setUserLocations] = useState([]);
  const [communityLocations, setCommunityLocations] = useState([]);
  const [userVotes, setUserVotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState('');
  const [userData, setUserData] = useState({});
  const [uploadModal, setUploadModal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const addr = localStorage.getItem('walletAddress');
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('userEmail');
    
    if (!addr) {
      navigate('/');
      return;
    }
    
    setWalletAddress(addr);
    setUserData({ username, email });
    loadDashboardData(addr);
  }, [navigate]);

  const loadDashboardData = async (address) => {
    setLoading(true);
    try {
      const [userLocs, communityLocs] = await Promise.all([
        fetchUserLocations(address),
        fetchAllCleanedLocations()
      ]);
      
      setUserLocations(userLocs.locations || []);
      setCommunityLocations(communityLocs || []);
      
      // Load user votes from localStorage
      const savedVotes = JSON.parse(localStorage.getItem(`votes_${address}`) || '{}');
      setUserVotes(savedVotes);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (locationId, voteType) => {
    try {
      await voteOnLocation(locationId, voteType, walletAddress);
      
      // Update local state
      const newVotes = { ...userVotes, [locationId]: voteType };
      setUserVotes(newVotes);
      localStorage.setItem(`votes_${walletAddress}`, JSON.stringify(newVotes));
      
      // Update community locations
      setCommunityLocations(prev => prev.map(loc => {
        if (loc.id === locationId) {
          const updated = { ...loc };
          if (voteType === 'upvote') {
            updated.upvotes = (updated.upvotes || 0) + 1;
          } else {
            updated.downvotes = (updated.downvotes || 0) + 1;
          }
          return updated;
        }
        return loc;
      }));
    } catch (error) {
      alert('Failed to submit vote. Please try again.');
    }
  };

  const handleUploadPhoto = async (locationId, file) => {
    const formData = new FormData();
    formData.append('afterImage', file);
    
    const response = await fetch(`http://localhost:5000/api/upload/${locationId}`, {
      method: 'POST',
      body: formData,
    });
    
    if (response.ok) {
      // Reload user locations to show updated data
      const userLocs = await fetchUserLocations(walletAddress);
      setUserLocations(userLocs.locations || []);
      alert('Photo uploaded successfully!');
    } else {
      throw new Error('Upload failed');
    }
  };

  const calculateTotalTokens = () => {
    return userLocations.reduce((total, loc) => {
      return total + (loc.cleaned ? loc.rewardTokens : 0);
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] relative">
      <Navigation />
      
      <div className="pt-20 px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 border-2 border-white rounded-lg flex items-center justify-center rotate-45">
              <span className="-rotate-45 text-white font-bold">CC</span>
            </div>
            <div>
              <h1 className="text-white text-3xl font-bold">Dashboard</h1>
              <p className="text-gray-400">Track your cleanup impact and community contributions</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-8 bg-[#1a1a1a] p-1 rounded-lg w-fit">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'locations', label: 'My Locations', icon: '📍' },
              { id: 'community', label: 'Community Verification', icon: '🏆' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <TokenCard tokens={calculateTotalTokens()} username={userData.username} />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6">
                  <h3 className="text-white text-lg font-semibold mb-2">Locations Claimed</h3>
                  <p className="text-3xl font-bold text-blue-400">{userLocations.length}</p>
                </div>
                <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6">
                  <h3 className="text-white text-lg font-semibold mb-2">Locations Cleaned</h3>
                  <p className="text-3xl font-bold text-green-400">
                    {userLocations.filter(loc => loc.cleaned).length}
                  </p>
                </div>
                <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6">
                  <h3 className="text-white text-lg font-semibold mb-2">Community Votes</h3>
                  <p className="text-3xl font-bold text-purple-400">{Object.keys(userVotes).length}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'locations' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-2xl font-bold">My Claimed Locations</h2>
                <span className="text-gray-400">{userLocations.length} locations</span>
              </div>
              
              {userLocations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🗺️</div>
                  <h3 className="text-white text-xl font-semibold mb-2">No locations claimed yet</h3>
                  <p className="text-gray-400 mb-6">Start by claiming a location that needs cleanup!</p>
                  <button
                    onClick={() => navigate('/map')}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Explore Map
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userLocations.map(location => (
                    <ClaimedLocationCard
                      key={location.id}
                      location={location}
                      onUploadClick={setUploadModal}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'community' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-2xl font-bold">Community Verification</h2>
                <span className="text-gray-400">{communityLocations.length} submissions</span>
              </div>
              
              {communityLocations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏆</div>
                  <h3 className="text-white text-xl font-semibold mb-2">No submissions to verify</h3>
                  <p className="text-gray-400">Check back later for community cleanup submissions to verify!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {communityLocations.map(location => (
                    <CommunityVerificationCard
                      key={location.id}
                      location={location}
                      onVote={handleVote}
                      userVotes={userVotes}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {uploadModal && (
        <UploadModal
          location={uploadModal}
          onClose={() => setUploadModal(null)}
          onUpload={handleUploadPhoto}
        />
      )}
    </div>
  );
};

export default Dashboard;