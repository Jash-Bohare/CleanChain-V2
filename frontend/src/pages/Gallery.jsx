import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { ChevronUp, ChevronDown, MapPin, Calendar, Search, Heart, CheckCircle, Clock, Image } from 'lucide-react';
import { getGalleryLocations, submitVote } from '../api';

const Gallery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [filterCategory, setFilterCategory] = useState('all');
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [votingStates, setVotingStates] = useState({});
  const [walletAddress, setWalletAddress] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const loadGalleryData = async () => {
      try {
        setLoading(true);
        const address = localStorage.getItem('walletAddress');
        setWalletAddress(address);
        
        const data = await getGalleryLocations();
        setPlaces(data);
      } catch (err) {
        console.error('Error loading gallery data:', err);
        setError('Failed to load gallery data');
      } finally {
        setLoading(false);
      }
    };

    loadGalleryData();
  }, []);

  const handleVote = async (placeId, voteType) => {
    if (!walletAddress) {
      setToast('Please connect your wallet to vote');
      setTimeout(() => setToast(null), 3000);
      return;
    }

    try {
      setVotingStates(prev => ({ ...prev, [placeId]: true }));
      
      await submitVote(placeId, voteType);
      
      // Refresh the gallery data to get updated vote counts
      const updatedData = await getGalleryLocations();
      setPlaces(updatedData);
      
      setToast(`Vote submitted successfully! ${voteType === 'up' ? 'Upvoted' : 'Downvoted'}`);
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      console.error('Vote error:', error);
      setToast(error.message || 'Failed to submit vote');
      setTimeout(() => setToast(null), 3000);
    } finally {
      setVotingStates(prev => ({ ...prev, [placeId]: false }));
    }
  };

  const hasUserVoted = (place) => {
    if (!walletAddress) return false;
    return place.votes?.some(vote => vote.voterId === walletAddress);
  };

  const getUserVote = (place) => {
    if (!walletAddress) return null;
    const userVote = place.votes?.find(vote => vote.voterId === walletAddress);
    return userVote?.voteType;
  };

  const isUserOwner = (place) => {
    return place.claimedBy === walletAddress;
  };

  const filteredPlaces = places.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${place.lat}, ${place.lng}`.includes(searchTerm);
    return matchesSearch;
  });

  const sortedPlaces = [...filteredPlaces].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.claimedAt) - new Date(a.claimedAt);
      case 'upvotes':
        return b.upvotes - a.upvotes;
      case 'downvotes':
        return b.downvotes - a.downvotes;
      default:
        return 0;
    }
  });

  // Calculate statistics
  const stats = {
    total: places.length,
    upvoted: places.reduce((sum, place) => sum + (place.upvotes || 0), 0),
    downvoted: places.reduce((sum, place) => sum + (place.downvotes || 0), 0)
  };

  const PlaceCard = ({ place }) => {
    const userVote = getUserVote(place);
    const hasVoted = hasUserVoted(place);
    const isOwner = isUserOwner(place);
    const isVoting = votingStates[place.id];

    return (
      <div className="relative">
        <div className="bg-[#1a1a1a]/80 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
          {/* Before and After Photos */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-1">
              <div className="relative">
                <img 
                  src={place.beforePhotoUrl || 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=400'} 
                  alt="Before cleanup"
                  className="w-full h-32 sm:h-48 object-cover"
                />
                <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1">
                  <span className="text-white text-xs font-medium">Before</span>
                </div>
              </div>
              <div className="relative">
                <img 
                  src={place.afterPhotoUrl} 
                  alt="After cleanup"
                  className="w-full h-32 sm:h-48 object-cover"
                />
                <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1">
                  <span className="text-white text-xs font-medium">After</span>
                </div>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className="absolute bottom-2 left-2">
              {isOwner ? (
                <div className="bg-blue-500/90 backdrop-blur-sm rounded-lg px-2 py-1">
                  <span className="text-white text-xs font-medium">Your Cleanup</span>
                </div>
              ) : hasVoted ? (
                <div className="bg-purple-500/90 backdrop-blur-sm rounded-lg px-2 py-1">
                  <span className="text-white text-xs font-medium">Voted</span>
                </div>
              ) : (
                <div className="bg-green-500/90 backdrop-blur-sm rounded-lg px-2 py-1">
                  <span className="text-white text-xs font-medium">Available</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-bold text-sm sm:text-base">
                {place.name}
              </h3>
              {place.rewardTokens && (
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1 shadow-lg">
                  <span className="text-white text-xs font-bold">+{place.rewardTokens} ECO</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="text-gray-400" size={12} />
              <span className="text-gray-400 text-xs sm:text-sm">
                {place.lat?.toFixed(4)}, {place.lng?.toFixed(4)}
              </span>
            </div>
            
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="text-gray-400" size={12} />
              <span className="text-gray-400 text-xs sm:text-sm">
                {place.claimedAt ? new Date(place.claimedAt).toLocaleDateString() : 'Unknown date'}
              </span>
            </div>

            {/* Vote Counts */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 bg-green-500/10 rounded-lg px-2 py-1">
                  <ChevronUp className="text-green-400" size={14} />
                  <span className="text-green-400 text-sm font-bold">{place.upvotes || 0}</span>
                </div>
                <div className="flex items-center space-x-1 bg-red-500/10 rounded-lg px-2 py-1">
                  <ChevronDown className="text-red-400" size={14} />
                  <span className="text-red-400 text-sm font-bold">{place.downvotes || 0}</span>
                </div>
              </div>
              <div className="text-gray-400 text-xs bg-gray-800/50 rounded-lg px-2 py-1">
                {place.totalVotes || 0} votes
              </div>
            </div>

            {/* Voting Buttons */}
            {!isOwner && !hasVoted && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleVote(place.id, 'up')}
                  disabled={isVoting}
                  className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                    isVoting 
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-green-600/20 text-green-400 hover:bg-green-600/30 hover:shadow-lg'
                  }`}
                >
                  <ChevronUp size={16} />
                  <span>Upvote</span>
                </button>
                
                <button
                  onClick={() => handleVote(place.id, 'down')}
                  disabled={isVoting}
                  className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                    isVoting 
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-red-600/20 text-red-400 hover:bg-red-600/30 hover:shadow-lg'
                  }`}
                >
                  <ChevronDown size={16} />
                  <span>Downvote</span>
                </button>
              </div>
            )}

            {isOwner && (
              <div className="text-center py-2 px-3 bg-blue-600/20 text-blue-400 rounded-lg text-sm border border-blue-500/30">
                Your cleanup - waiting for community votes
              </div>
            )}

            {hasVoted && !isOwner && (
              <div className="text-center py-2 px-3 bg-purple-600/20 text-purple-400 rounded-lg text-sm border border-purple-500/30">
                You voted: {userVote === 'up' ? 'Upvoted' : 'Downvoted'}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
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
      
      <div className="pt-32 px-6 h-screen flex flex-col relative z-10">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <Image className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Community Gallery</h1>
                <p className="text-gray-300 text-sm">Vote on community cleanups and help verify environmental impact</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={16} />
              <input
                type="text"
                placeholder="Search locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#1a1a1a]/80 backdrop-blur-sm border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
              />
            </div>
            
            <div className="relative w-full sm:w-64">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none pl-10 pr-10 py-2 bg-[#1a1a1a]/80 backdrop-blur-sm border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all hover:border-gray-600 hover:bg-[#1a1a1a]/90 cursor-pointer shadow-lg"
              >
                <option value="recent" className="bg-[#1a1a1a] text-white">Most Recent</option>
                <option value="upvotes" className="bg-[#1a1a1a] text-white">Most Upvotes</option>
                <option value="downvotes" className="bg-[#1a1a1a] text-white">Most Downvotes</option>
              </select>
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none transition-transform duration-200" size={16} />
            </div>
          </div>
          
          <div className="text-gray-400 text-sm bg-[#1a1a1a]/60 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-2 text-center sm:text-left">
            {sortedPlaces.length} cleanup{sortedPlaces.length !== 1 ? 's' : ''} to vote on
          </div>
        </div>

        {/* Gallery Content */}
        <div className="flex-1 overflow-y-auto">
          {sortedPlaces.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="text-gray-400 mx-auto mb-4" size={48} />
              <p className="text-gray-400 text-lg">No cleanups to vote on yet</p>
              <p className="text-gray-500 text-sm mt-2">Check back later for new community cleanups!</p>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedPlaces.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;