import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Logo from '../components/Logo';
import { ChevronUp, ChevronDown, MapPin, Calendar, Filter, Search, Grid, List, Heart, CheckCircle, Clock } from 'lucide-react';
import { getGalleryLocations, submitVote } from '../api';

const Gallery = () => {
  const [viewMode, setViewMode] = useState('grid');
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

  const PlaceCard = ({ place }) => {
    const userVote = getUserVote(place);
    const hasVoted = hasUserVoted(place);
    const isOwner = isUserOwner(place);
    const isVoting = votingStates[place.id];

    return (
      <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 hover:shadow-lg transition-all group">
        {/* Before and After Photos */}
        <div className="relative">
          <div className="grid grid-cols-2 gap-1">
            <div className="relative">
              <img 
                src={place.beforePhotoUrl || 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=400'} 
                alt="Before cleanup"
                className="w-full h-32 sm:h-48 object-cover"
              />
              <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded px-2 py-1">
                <span className="text-white text-xs font-medium">Before</span>
              </div>
            </div>
            <div className="relative">
              <img 
                src={place.afterPhotoUrl} 
                alt="After cleanup"
                className="w-full h-32 sm:h-48 object-cover"
              />
              <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded px-2 py-1">
                <span className="text-white text-xs font-medium">After</span>
              </div>
            </div>
          </div>
          
          {/* Reward Badge */}
          {place.rewardTokens && (
            <div className="absolute top-2 right-2 bg-yellow-600/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
              <span className="text-white text-xs font-medium">+{place.rewardTokens} ECO</span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-white font-semibold mb-2 group-hover:text-blue-400 transition-colors text-sm sm:text-base">
            {place.name}
          </h3>
          
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
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <ChevronUp className="text-green-400" size={16} />
                <span className="text-green-400 text-sm font-medium">{place.upvotes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ChevronDown className="text-red-400" size={16} />
                <span className="text-red-400 text-sm font-medium">{place.downvotes}</span>
              </div>
            </div>
            <div className="text-gray-400 text-xs">
              {place.totalVotes} votes
            </div>
          </div>

          {/* Voting Buttons */}
          {!isOwner && (
            <div className="flex space-x-2">
              <button
                onClick={() => handleVote(place.id, 'up')}
                disabled={hasVoted || isVoting}
                className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-lg transition-colors text-sm font-medium ${
                  userVote === 'up' 
                    ? 'bg-green-600 text-white' 
                    : hasVoted 
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                }`}
              >
                <ChevronUp size={16} />
                <span>Upvote</span>
              </button>
              
              <button
                onClick={() => handleVote(place.id, 'down')}
                disabled={hasVoted || isVoting}
                className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-lg transition-colors text-sm font-medium ${
                  userVote === 'down' 
                    ? 'bg-red-600 text-white' 
                    : hasVoted 
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                }`}
              >
                <ChevronDown size={16} />
                <span>Downvote</span>
              </button>
            </div>
          )}

          {isOwner && (
            <div className="text-center py-2 px-3 bg-blue-600/20 text-blue-400 rounded-lg text-sm">
              Your cleanup - waiting for community votes
            </div>
          )}

          {hasVoted && !isOwner && (
            <div className="text-center py-2 px-3 bg-gray-600/20 text-gray-400 rounded-lg text-sm">
              You voted: {userVote === 'up' ? 'Upvoted' : 'Downvoted'}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-white text-xl">Loading Gallery...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] relative">
      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 text-lg font-semibold">
          {toast}
        </div>
      )}
      <Navigation />
      
      <div className="pt-16 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Logo />
            <div>
              <h1 className="text-white text-2xl sm:text-3xl font-bold">Gallery</h1>
              <p className="text-gray-400 text-sm">
                Vote on community cleanups and help verify environmental impact
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-[#1a1a1a] border border-gray-700 rounded-lg p-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="recent">Most Recent</option>
              <option value="upvotes">Most Upvotes</option>
              <option value="downvotes">Most Downvotes</option>
            </select>
          </div>
          
          <div className="text-gray-400 text-sm">
            {sortedPlaces.length} cleanup{sortedPlaces.length !== 1 ? 's' : ''} to vote on
          </div>
        </div>

        {/* Gallery Content */}
        {sortedPlaces.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="text-gray-400 mx-auto mb-4" size={48} />
            <p className="text-gray-400 text-lg">No cleanups to vote on yet</p>
            <p className="text-gray-500 text-sm mt-2">Check back later for new community cleanups!</p>
          </div>
        ) : (
          <div className={`grid gap-4 sm:gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {sortedPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;