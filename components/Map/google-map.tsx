'use client';

import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { SourceCoordinatesContext } from '@/context/source-coordinates-context';
import { DestinationCoordinatesContext } from '@/context/destination-coordinates-context';
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
  const { sourceCoordinates } = useContext(SourceCoordinatesContext) ?? {};
  const { destinationCoordinates } = useContext(DestinationCoordinatesContext) ?? {};
  const { setDirectionsData } = useContext(DirectionsDataContext) ?? {};
  const { isLoaded, loadError } = useGoogleMaps();
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const getDirections = useCallback(async () => {
    if (!sourceCoordinates || !destinationCoordinates || !isMapReady) return;

    try {
      const directionsService = new google.maps.DirectionsService();
      const result = await directionsService.route({
        origin: { lat: sourceCoordinates.lat, lng: sourceCoordinates.lng },
        destination: { lat: destinationCoordinates.lat, lng: destinationCoordinates.lng },
        travelMode: google.maps.TravelMode.DRIVING,
      });

      setDirections(result);
      setDirectionsData?.({
        distance: result.routes[0].legs[0].distance?.value || 0,
        duration: result.routes[0].legs[0].duration?.value || 0,
        routes: result.routes.map(route => ({
          distance: route.legs[0].distance?.value || 0,
          duration: route.legs[0].duration?.value || 0,
          geometry: {
            type: 'LineString',
            coordinates: route.overview_path.map(point => [point.lng(), point.lat()])
          }
        }))
      });
    } catch (error) {
      console.error('Error getting directions:', error);
      setError('Failed to get directions. Please try again.');
    }
  }, [sourceCoordinates, destinationCoordinates, setDirectionsData, isMapReady]);

  useEffect(() => {
    if (sourceCoordinates && mapRef.current) {
      mapRef.current.panTo({ lat: sourceCoordinates.lat, lng: sourceCoordinates.lng });
    }
  }, [sourceCoordinates]);

  useEffect(() => {
    if (destinationCoordinates && mapRef.current) {
      mapRef.current.panTo({ lat: destinationCoordinates.lat, lng: destinationCoordinates.lng });
      if (sourceCoordinates && isMapReady) {
        getDirections();
      }
    }
  }, [destinationCoordinates, sourceCoordinates, getDirections, isMapReady]);

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
    <div className="p-5 h-[calc(100vh-100px)] mb-16">
      <h2 className="text-[20px] font-semibold">Map</h2>
      <div className="rounded-lg overflow-hidden h-full">
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
          }}
        >
          {sourceCoordinates && (
            <Marker
              position={{ lat: sourceCoordinates.lat, lng: sourceCoordinates.lng }}
              icon={{
                url: '/location.png',
                scaledSize: new google.maps.Size(40, 40),
              }}
            />
          )}

          {destinationCoordinates && (
            <Marker
              position={{ lat: destinationCoordinates.lat, lng: destinationCoordinates.lng }}
              icon={{
                url: '/pin.png',
                scaledSize: new google.maps.Size(40, 40),
              }}
            />
          )}

          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>
      {error && (
        <div className="absolute top-20 right-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <div className="absolute bottom-[-85%] md:bottom-[50px] z-20 md:right-[30px] right-[1.25rem] pl-5 md:pl-0">
        <DistanceTime />
      </div>
    </div>
  );
} 