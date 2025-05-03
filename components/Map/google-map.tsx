'use client';

import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { DirectionsDataContext } from '@/context/directions-data-context';
import { useGoogleMaps } from '@/context/google-maps-context';
import DistanceTime from './distanceTime';
import { Loader2 } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '10px'
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
};

export default function GoogleMapComponent() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const { directionsData, setDirectionsData } = useContext(DirectionsDataContext) ?? {};
  const { isLoaded, loadError } = useGoogleMaps();
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [sourceCoords, setSourceCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [destCoords, setDestCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isUpdatingDirections, setIsUpdatingDirections] = useState(false);
  const [isUpdatingCoordinates, setIsUpdatingCoordinates] = useState(false);

  // Function to get directions
  const getDirections = useCallback(async (source: { lat: number; lng: number }, destination: { lat: number; lng: number }) => {
    if (!isMapReady || isUpdatingDirections) return;

    try {
      setIsUpdatingDirections(true);
      
      const directionsService = new google.maps.DirectionsService();
      const result = await directionsService.route({
        origin: source,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      });

      setDirections(result);
      
      if (!result.routes || result.routes.length === 0) {
        throw new Error('No routes found');
      }

      const route = result.routes[0];
      if (!route.legs || route.legs.length === 0) {
        throw new Error('No legs found in route');
      }

      const leg = route.legs[0];
      
      // Convert distance from meters to kilometers and duration from seconds to minutes
      const distanceInKm = (leg.distance?.value || 0) / 1000;
      const durationInMinutes = (leg.duration?.value || 0) / 60;

      // Only update if values actually changed
      if (directionsData?.distance !== distanceInKm || directionsData?.duration !== durationInMinutes) {
        setDirectionsData?.({
          distance: distanceInKm,
          duration: durationInMinutes,
          routes: [{
            distance: distanceInKm,
            duration: durationInMinutes,
            geometry: {
              type: 'LineString',
              coordinates: route.overview_path.map(point => [point.lng(), point.lat()])
            },
            legs: [{
              start_address: leg.start_address,
              end_address: leg.end_address
            }]
          }]
        });
      }
      
      setTimeout(() => setIsUpdatingDirections(false), 500);
    } catch (error) {
      console.error('Error getting directions:', error);
      setError('Failed to get directions. Please try again.');
      setDirectionsData?.(null);
      setIsUpdatingDirections(false);
    }
  }, [directionsData, setDirectionsData, isMapReady, isUpdatingDirections]);

  // First mount effect - fit map to directions if they exist
  useEffect(() => {
    if (isMapReady && mapRef.current && directionsData?.routes?.[0]?.legs?.[0] && !sourceCoords && !destCoords) {
      setIsUpdatingCoordinates(true);
      
      const leg = directionsData.routes[0].legs[0];
      const geocoder = new google.maps.Geocoder();
      
      // Geocode addresses to get coordinates
      Promise.all([
        new Promise<{lat: number, lng: number}>((resolve) => {
          geocoder.geocode({ address: leg.start_address }, (results, status) => {
            if (status === 'OK' && results?.[0]?.geometry?.location) {
              const location = results[0].geometry.location;
              resolve({ lat: location.lat(), lng: location.lng() });
            } else {
              resolve(defaultCenter); // Fallback to default
            }
          });
        }),
        new Promise<{lat: number, lng: number}>((resolve) => {
          geocoder.geocode({ address: leg.end_address }, (results, status) => {
            if (status === 'OK' && results?.[0]?.geometry?.location) {
              const location = results[0].geometry.location;
              resolve({ lat: location.lat(), lng: location.lng() });
            } else {
              resolve(defaultCenter); // Fallback to default
            }
          });
        })
      ]).then(([source, destination]) => {
        setSourceCoords(source);
        setDestCoords(destination);
        
        // Fit the map to show both markers
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(source);
        bounds.extend(destination);
        mapRef.current?.fitBounds(bounds);
        
        setTimeout(() => setIsUpdatingCoordinates(false), 500);
      });
    }
  }, [isMapReady, directionsData]);

  // Update directions when coordinates change
  useEffect(() => {
    if (sourceCoords && destCoords && !isUpdatingCoordinates && !isUpdatingDirections) {
      // Get directions
      getDirections(sourceCoords, destCoords);
    }
  }, [sourceCoords, destCoords, getDirections, isUpdatingCoordinates, isUpdatingDirections]);

  // Handle map loading error
  useEffect(() => {
    if (loadError && retryCount < 3) {
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loadError, retryCount]);

  if (loadError && retryCount >= 3) {
    return (
      <div className="p-5 h-[calc(100vh-100px)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-red-500 text-xl font-semibold mb-2">Error Loading Map</h2>
          <p className="text-gray-600">Please check your internet connection and try again.</p>
          <button 
            onClick={() => setRetryCount(0)}
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="p-5 h-[calc(100vh-100px)] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
          <p className="mt-2 text-gray-600">Loading map...</p>
          {retryCount > 0 && (
            <p className="text-sm text-gray-500 mt-1">Attempt {retryCount + 1} of 3</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 h-full mt-6">
      <h2 className="text-2xl font-semibold mb-3">Map</h2>
      <div className="rounded-lg overflow-hidden h-[calc(100%-3rem)] relative">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={14}
          onLoad={(map) => {
            mapRef.current = map;
            setIsMapReady(true);
          }}
          onUnmount={() => {
            mapRef.current = null;
            setIsMapReady(false);
          }}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            gestureHandling: 'greedy',
            disableDoubleClickZoom: true,
            scrollwheel: false,
          }}
        >
          {directions && <DirectionsRenderer directions={directions} options={{ suppressMarkers: true }} />}
          {sourceCoords && (
            <Marker 
              position={sourceCoords}
              icon={{
                url: '/location.png',
                scaledSize: new google.maps.Size(30, 30),
              }}
            />
          )}
          {destCoords && (
            <Marker 
              position={destCoords}
              icon={{
                url: '/pin.png',
                scaledSize: new google.maps.Size(30, 30),
              }}
            />
          )}
        </GoogleMap>
      </div>
      {error && (
        <div className="absolute top-20 right-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <div className="absolute bottom-4 right-4 z-20 md:block hidden">
        <DistanceTime />
      </div>
      <div className="md:hidden mt-4">
        <DistanceTime />
      </div>
    </div>
  );
} 