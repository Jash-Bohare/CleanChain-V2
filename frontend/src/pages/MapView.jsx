import React, { useState, useEffect, useRef } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { fetchLocations, claimLocation, testDistance } from '../api';

// Navigation Bar
const Navigation = () => (
  <nav className="absolute top-0 left-0 right-0 z-10 p-6">
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
          <span className="text-black font-bold text-sm">CC</span>
        </div>
        <span className="text-white font-medium text-lg">Crypto Connect</span>
      </div>
      <div className="flex items-center space-x-8">
        <a href="/" className="text-gray-400 hover:text-white transition-colors">Welcome</a>
        <a href="/map" className="text-gray-400 hover:text-white transition-colors">Map</a>
      </div>
    </div>
  </nav>
);

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
        styles: [/* dark style array omitted for brevity */]
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
            scale: 10,
            fillColor: marker.status === 'cleaned' ? '#22c55e' : marker.status === 'claimed' ? '#eab308' : '#ef4444',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="color: #333; padding: 8px; max-width: 250px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${marker.name}</h3>
              <p style="margin: 0; font-size: 14px; color: #666;">
                Lat: ${marker.lat.toFixed(6)}<br>
                Lng: ${marker.lng.toFixed(6)}
              </p>
              <p style="margin: 8px 0 0 0; font-size: 14px;">Status: <strong>${marker.status}</strong></p>
              ${marker.rewardTokens ? `<p style=\"margin: 0; font-size: 14px;\">Reward: ${marker.rewardTokens} tokens</p>` : ''}
              ${marker.claimedBy ? `<p style=\"margin: 0; font-size: 14px;\">Claimed By: ${marker.claimedBy}</p>` : ''}
              ${marker.cleanedBy ? `<p style=\"margin: 0; font-size: 14px;\">Cleaned By: ${marker.cleanedBy}</p>` : ''}
              ${marker.beforePhotoUrl ? `<img src='${marker.beforePhotoUrl}' alt='Before' style='margin-top:8px;max-width:100%;border-radius:6px;' />` : ''}
              ${marker.afterPhotoUrl ? `<img src='${marker.afterPhotoUrl}' alt='After' style='margin-top:8px;max-width:100%;border-radius:6px;' />` : ''}
              ${marker.status === 'unclaimed' && walletAddress ? `<button id='claim-btn-${marker.id}' style='margin-top:10px;padding:8px 16px;background:#22c55e;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:bold;'>Claim</button>` : ''}
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

  return <div ref={ref} className="w-full h-full" />;
};

const render = (status) => {
  switch (status) {
    case Status.LOADING:
      return <div className="flex items-center justify-center h-full text-white">Loading Maps...</div>;
    case Status.FAILURE:
      return <div className="flex items-center justify-center h-full text-red-400">Failed to load Maps</div>;
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
  const [toast, setToast] = useState(null); // <-- add toast state

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
      alert('Please connect your wallet to claim a location.');
      return;
    }
    setClaimingId(marker.id);
    infoWindowRef.current = infoWindow;
    markerRef.current = googleMarker;
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
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
          const msg = `<div style='color:#22c55e;padding:8px;'>Location successfully claimed!</div>`;
          infoWindow.setContent(msg);
          infoWindow.open(googleMarker.getMap(), googleMarker);
          infoWindowRef.current = infoWindow;
          setToast('You have successfully claimed this location!');
          setTimeout(() => setToast(null), 3000);
        } else if (res.status === 'too far') {
          try {
            const distRes = await testDistance({
              lat1: userLat,
              lng1: userLng,
              lat2: marker.lat,
              lng2: marker.lng
            });
            const msg = `<div style='color:#b91c1c;padding:8px;'>You are too far to claim this location.<br/>Distance: <strong>${distRes.distanceInMeters} meters</strong> (must be within 10000 meters).</div>`;
            infoWindow.setContent(msg);
            infoWindow.open(googleMarker.getMap(), googleMarker);
            infoWindowRef.current = infoWindow;
            alert(`You are too far to claim this location. Distance: ${distRes.distanceInMeters} meters (must be within 10000 meters).`);
          } catch (distErr) {
            const msg = `<div style='color:#b91c1c;padding:8px;'>You are too far to claim this location. (Distance check failed)</div>`;
            infoWindow.setContent(msg);
            infoWindow.open(googleMarker.getMap(), googleMarker);
            infoWindowRef.current = infoWindow;
            alert('You are too far to claim this location. (Distance check failed)');
          }
        } else {
          const msg = `<div style='color:#b91c1c;padding:8px;'>${res.status || 'Failed to claim location.'}</div>`;
          infoWindow.setContent(msg);
          infoWindow.open(googleMarker.getMap(), googleMarker);
          infoWindowRef.current = infoWindow;
          alert(res.status || 'Failed to claim location.');
        }
      } catch (err) {
        const msg = `<div style='color:#b91c1c;padding:8px;'>Error claiming location.</div>`;
        infoWindow.setContent(msg);
        infoWindow.open(googleMarker.getMap(), googleMarker);
        infoWindowRef.current = infoWindow;
        alert('Error claiming location.');
      } finally {
        setClaimingId(null);
      }
    }, (err) => {
      alert('Failed to get your location. Please allow location access.');
      setClaimingId(null);
    });
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] relative">
      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 text-lg font-semibold">
          {toast}
        </div>
      )}
      <Navigation />
      <div className="pt-20 px-6 h-screen flex flex-col">
        <div className="flex justify-between mb-6 items-center">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 border-2 border-white rounded-lg flex items-center justify-center rotate-45">
              <span className="-rotate-45 text-white font-bold text-sm">CC</span>
            </div>
            <h1 className="text-white text-2xl font-bold">Cleanup Locations</h1>
          </div>
        </div>
        <div className="flex-1 bg-[#1a1a1a] rounded-lg border border-gray-700 overflow-hidden">
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
            {loading && <div className="flex items-center justify-center h-full text-white">Loading locations...</div>}
            {error && <div className="flex items-center justify-center h-full text-red-400">{error}</div>}
          </Wrapper>
        </div>
        <div className="mt-4 text-center text-gray-400 text-sm">
          Locations are managed by CleanChain admins. Click a marker to view details. Unclaimed locations can be claimed if you are nearby.
        </div>
      </div>
    </div>
  );
};

export default MapView;
