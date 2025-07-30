import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, MapPin, User, BarChart3, Image, LogOut } from 'lucide-react';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('onboardingComplete');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('username');
    navigate('/');
  };

  const navItems = [
    { name: 'Logout', path: '/logout', icon: LogOut, action: handleLogout },
    { name: 'Map', path: '/map', icon: MapPin, action: () => navigate('/map') },
    { name: 'Dashboard', path: '/dashboard', icon: BarChart3, action: () => navigate('/dashboard') },
    { name: 'Gallery', path: '/Gallery', icon: Image, action: () => navigate('/Gallery') },
    { name: 'Profile', path: '/profile', icon: User, action: () => navigate('/profile') }
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="bg-[#1a1a1a]/80 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-2xl">
        <div className="flex justify-between items-center p-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div>
              <span className="text-white font-bold text-lg">CleanChain</span>
              <p className="text-gray-400 text-xs">Eco Rewards Platform</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.name}
                  onClick={item.action}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium ${
                    active
                      ? 'bg-gradient-to-r from-green-400/20 to-emerald-500/20 text-green-400 border border-green-400/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-700/50 bg-[#1a1a1a]/95 backdrop-blur-md">
            <div className="flex flex-col space-y-1 p-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      item.action();
                      closeMenu();
                    }}
                    className={`flex items-center space-x-3 text-left py-3 px-4 rounded-xl transition-all duration-200 text-sm font-medium ${
                      active
                        ? 'bg-gradient-to-r from-green-400/20 to-emerald-500/20 text-green-400 border border-green-400/30'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;