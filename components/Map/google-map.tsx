'use client';

import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { UserLocationContext } from '@/context/user-location-context';
import { SourceCoordinatesContext } from '@/context/source-coordinates-context';
import { DestinationCoordinatesContext } from '@/context/destination-coordinates-context';
import { DirectionsDataContext } from '@/context/directions-data-context';
import DistanceTime from './distanceTime';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '10px'
};

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ['places'];

export default function GoogleMapComponent() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const { userLocation } = useContext(UserLocationContext) ?? {};
  const { sourceCoordinates } = useContext(SourceCoordinatesContext) ?? {};
  const { destinationCoordinates } = useContext(DestinationCoordinatesContext) ?? {};
  const { setDirectionsData } = useContext(DirectionsDataContext) ?? {};
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY!,
    libraries
  });

  const getDirections = useCallback(async () => {
    if (!sourceCoordinates || !destinationCoordinates) return;

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
  }, [sourceCoordinates, destinationCoordinates, setDirectionsData]);

  useEffect(() => {
    if (sourceCoordinates && mapRef.current) {
      mapRef.current.panTo({ lat: sourceCoordinates.lat, lng: sourceCoordinates.lng });
    }
  }, [sourceCoordinates]);

  useEffect(() => {
    if (destinationCoordinates && mapRef.current) {
      mapRef.current.panTo({ lat: destinationCoordinates.lat, lng: destinationCoordinates.lng });
      if (sourceCoordinates) {
        getDirections();
      }
    }
  }, [destinationCoordinates, sourceCoordinates, getDirections]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-5 h-[calc(100vh-100px)] mb-16">
      <h2 className="text-[20px] font-semibold">Map</h2>
      <div className="rounded-lg overflow-hidden h-full">
        {userLocation && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{ lat: userLocation.lat, lng: userLocation.lng }}
            zoom={14}
            onLoad={(map) => {
              mapRef.current = map;
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
        )}
      </div>
      <div className="absolute bottom-[-85%] md:bottom-[50px] z-20 md:right-[30px] right-[1.25rem] pl-5 md:pl-0">
        <DistanceTime />
      </div>
    </div>
  );
} 