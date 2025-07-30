import React, { useState, useEffect, useRef } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { fetchLocations, claimLocation, testDistance } from '../api';
import Navigation from '../components/Navigation';
import { MapPin, Target, CheckCircle, Clock, AlertCircle } from 'lucide-react';

// Google Map Component
const MapComponent = ({ center, zoom, markers, onClaim, walletAddress }) => {
  const ref = useRef(null);
  const [map, setMap] = useState(null);
  const [googleMarkers, setGoogleMarkers] = useState([]);
  const infoWindowRef = useRef(null);

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
          {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }]
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{ color: '#263c3f' }]
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#6b9a76' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#38414e' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#212a37' }]
          },
          {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#9ca5b3' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: '#746855' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#1f2835' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#f3d19c' }]
          },
          {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{ color: '#2f3948' }]
          },
          {
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#17263c' }]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#515c6d' }]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#17263c' }]
          }
        ]
      });
      setMap(newMap);
    }
  }, [ref, map, center, zoom]);

  useEffect(() => {
    if (map) {
      googleMarkers.forEach(marker => marker.setMap(null));

      const newGoogleMarkers = markers.map((marker) => {
        const googleMarker = new window.google.maps.Marker({
          position: { lat: marker.lat, lng: marker.lng },
          map: map,
          title: marker.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: marker.status === 'cleaned' ? '#22c55e' : marker.status === 'claimed' ? '#eab308' : '#ef4444',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3,
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="color: #333; padding: 12px; max-width: 280px; font-family: 'Inter', sans-serif;">
              <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: bold; color: #1f2937;">${marker.name}</h3>
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">
                <strong>Coordinates:</strong><br>
                Lat: ${marker.lat.toFixed(6)}<br>
                Lng: ${marker.lng.toFixed(6)}
              </p>
              <div style="margin: 8px 0; padding: 6px 10px; border-radius: 6px; background: ${marker.status === 'cleaned' ? '#dcfce7' : marker.status === 'claimed' ? '#fef3c7' : '#fee2e2'}; color: ${marker.status === 'cleaned' ? '#166534' : marker.status === 'claimed' ? '#92400e' : '#991b1b'}; font-weight: 500;">
                Status: <strong>${marker.status}</strong>
              </div>
              ${marker.rewardTokens ? `<p style="margin: 8px 0; font-size: 14px; color: #059669;"><strong>Reward:</strong> ${marker.rewardTokens} ECO tokens</p>` : ''}
              ${marker.claimedBy ? `<p style="margin: 4px 0; font-size: 14px; color: #6b7280;"><strong>Claimed By:</strong> ${marker.claimedBy.slice(0, 6)}...${marker.claimedBy.slice(-4)}</p>` : ''}
              ${marker.cleanedBy ? `<p style="margin: 4px 0; font-size: 14px; color: #6b7280;"><strong>Cleaned By:</strong> ${marker.cleanedBy.slice(0, 6)}...${marker.cleanedBy.slice(-4)}</p>` : ''}
              ${marker.beforePhotoUrl ? `<img src='${marker.beforePhotoUrl}' alt='Before' style='margin-top:8px;max-width:100%;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1);' />` : ''}
              ${marker.afterPhotoUrl ? `<img src='${marker.afterPhotoUrl}' alt='After' style='margin-top:8px;max-width:100%;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1);' />` : ''}
              ${marker.status === 'unclaimed' && walletAddress ? `<button id='claim-btn-${marker.id}' style='margin-top:12px;padding:10px 20px;background:linear-gradient(135deg, #22c55e, #16a34a);color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:14px;box-shadow:0 4px 6px rgba(34,197,94,0.3);transition:all 0.2s;'>Claim Location</button>` : ''}
            </div>
          `
        });

        googleMarker.addListener('click', () => {
          if (infoWindowRef.current) {
            infoWindowRef.current.close();
          }
          infoWindow.open(map, googleMarker);
          infoWindowRef.current = infoWindow;

          // Attach claim button event after infoWindow is rendered
          if (marker.status === 'unclaimed' && walletAddress) {
            window.setTimeout(() => {
              const btn = document.getElementById(`claim-btn-${marker.id}`);
              if (btn) {
                btn.onclick = (e) => {
                  e.stopPropagation();
                  onClaim(marker, googleMarker, infoWindow);
                };
              }
            }, 0);
          }
        });

        return googleMarker;
      });

      setGoogleMarkers(newGoogleMarkers);
    }
  }, [map, markers, onClaim, walletAddress]);

  return <div ref={ref} className="w-full h-full rounded-lg" />;
};

const render = (status) => {
  switch (status) {
    case Status.LOADING:
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading Map...</p>
          </div>
        </div>
      );
    case Status.FAILURE:
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-400 text-lg">Failed to load Map</p>
          </div>
        </div>
      );
    default:
      return null;
  }
};

const MapView = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [claimingId, setClaimingId] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const infoWindowRef = useRef(null);
  const markerRef = useRef(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const loadLocations = async () => {
      setLoading(true);
      try {
        const data = await fetchLocations();
        setLocations(data);
      } catch (err) {
        setError('Failed to load locations');
      } finally {
        setLoading(false);
      }
    };
    loadLocations();
    // Get wallet address from localStorage
    const addr = localStorage.getItem('walletAddress') || '';
    setWalletAddress(addr);
  }, []);

  // Center map on first location if available
  const center = locations.length > 0
    ? { lat: locations[0].lat, lng: locations[0].lng }
    : { lat: 40.7128, lng: -74.0060 };
  const zoom = 12;

  // Handler for claim button
  const handleClaim = async (marker, googleMarker, infoWindow) => {
    if (!walletAddress) {
      setToast('Please connect your wallet to claim a location.');
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setClaimingId(marker.id);
    infoWindowRef.current = infoWindow;
    markerRef.current = googleMarker;
    if (!navigator.geolocation) {
      setToast('Geolocation is not supported by your browser.');
      setTimeout(() => setToast(null), 3000);
      setClaimingId(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;
      try {
        const res = await claimLocation({
          walletAddress,
          locationId: marker.id,
          userLat,
          userLng
        });
        if (res.status === 'claimed') {
          setLocations((prev) => prev.map((loc) =>
            loc.id === marker.id
              ? { ...loc, status: 'claimed', claimedBy: walletAddress, claimedAt: new Date().toISOString() }
              : loc
          ));
          const distance = res.distance ? ` (${Math.round(res.distance)}m away)` : '';
          const msg = `<div style='color:#22c55e;padding:8px;font-weight:600;'>Location successfully claimed!${distance}</div>`;
          infoWindow.setContent(msg);
          infoWindow.open(googleMarker.getMap(), googleMarker);
          infoWindowRef.current = infoWindow;
          setToast(`You have successfully claimed this location!${distance}`);
          setTimeout(() => setToast(null), 3000);
        } else if (res.status === 'too far') {
          const distance = res.distance || 0;
          const threshold = res.threshold || 15000;
          const msg = `<div style='color:#b91c1c;padding:8px;font-weight:600;'>
            You are too far to claim this location.<br/>
            Distance: <strong>${Math.round(distance)} meters</strong> (must be within ${threshold/1000}km).
          </div>`;
          infoWindow.setContent(msg);
          infoWindow.open(googleMarker.getMap(), googleMarker);
          infoWindowRef.current = infoWindow;
          setToast(`You are too far to claim this location. Distance: ${Math.round(distance)} meters (must be within ${threshold/1000}km).`);
          setTimeout(() => setToast(null), 3000);
        } else {
          const msg = `<div style='color:#b91c1c;padding:8px;font-weight:600;'>${res.status || 'Failed to claim location.'}</div>`;
          infoWindow.setContent(msg);
          infoWindow.open(googleMarker.getMap(), googleMarker);
          infoWindowRef.current = infoWindow;
          setToast(res.status || 'Failed to claim location.');
          setTimeout(() => setToast(null), 3000);
        }
      } catch (err) {
        const msg = `<div style='color:#b91c1c;padding:8px;font-weight:600;'>Error claiming location.</div>`;
        infoWindow.setContent(msg);
        infoWindow.open(googleMarker.getMap(), googleMarker);
        infoWindowRef.current = infoWindow;
        setToast('Error claiming location.');
        setTimeout(() => setToast(null), 3000);
      } finally {
        setClaimingId(null);
      }
    }, (err) => {
      setToast('Failed to get your location. Please allow location access.');
      setTimeout(() => setToast(null), 3000);
      setClaimingId(null);
    });
  };

  // Calculate statistics
  const stats = {
    total: locations.length,
    unclaimed: locations.filter(loc => loc.status === 'unclaimed').length,
    claimed: locations.filter(loc => loc.status === 'claimed').length,
    cleaned: locations.filter(loc => loc.status === 'cleaned').length
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
      
      <Navigation />
      
      <div className="pt-32 px-6 h-screen flex flex-col relative z-10">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Cleanup Locations</h1>
                <p className="text-gray-300 text-sm">Find and claim locations to clean</p>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="hidden md:flex space-x-4">
              <div className="bg-[#1a1a1a]/80 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-2 text-center w-20 h-16 flex flex-col justify-center">
                <div className="text-white font-bold text-lg">{stats.total}</div>
                <div className="text-gray-400 text-xs">Total</div>
              </div>
              <div className="bg-[#1a1a1a]/80 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-2 text-center w-20 h-16 flex flex-col justify-center">
                <div className="text-red-400 font-bold text-lg">{stats.unclaimed}</div>
                <div className="text-gray-400 text-xs">Available</div>
              </div>
              <div className="bg-[#1a1a1a]/80 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-2 text-center w-20 h-16 flex flex-col justify-center">
                <div className="text-yellow-400 font-bold text-lg">{stats.claimed}</div>
                <div className="text-gray-400 text-xs">Claimed</div>
              </div>
              <div className="bg-[#1a1a1a]/80 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-2 text-center w-20 h-16 flex flex-col justify-center">
                <div className="text-green-400 font-bold text-lg">{stats.cleaned}</div>
                <div className="text-gray-400 text-xs">Cleaned</div>
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-300">Unclaimed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-300">Claimed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-300">Cleaned</span>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 bg-[#1a1a1a]/80 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden shadow-2xl">
          <Wrapper apiKey="AIzaSyCS_IB38aIgTPXl4ze-uo_UkolH11TaIFA" render={render}>
            {!loading && !error && (
              <MapComponent
                center={center}
                zoom={zoom}
                markers={locations}
                onClaim={handleClaim}
                walletAddress={walletAddress}
              />
            )}
            {loading && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
                  <p className="text-white text-lg">Loading locations...</p>
                </div>
              </div>
            )}
            {error && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <p className="text-red-400 text-lg">{error}</p>
                </div>
              </div>
            )}
          </Wrapper>
        </div>

        {/* Footer Info */}
        <div className="mt-4 mb-6 text-center">
          <div className="bg-[#1a1a1a]/60 backdrop-blur-sm border border-gray-700 rounded-lg px-6 py-3 inline-block">
            <p className="text-gray-300 text-sm">
              <Target className="inline w-4 h-4 mr-2" />
              Click markers to view details. Unclaimed locations can be claimed if you are within 15km.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
