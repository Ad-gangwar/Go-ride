'use client';

import { useContext, useState, useCallback, useEffect } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { Loader2 } from "lucide-react";
import { useGoogleMaps } from "@/context/google-maps-context";
import { DirectionsDataContext } from "@/context/directions-data-context";

interface AutocompleteAddressProps {
  onAddressChange?: (source: string, destination: string) => void;
}

export default function AutocompleteAddress({ onAddressChange }: AutocompleteAddressProps) {
  const [source, setSource] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [sourceAutocomplete, setSourceAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [destinationAutocomplete, setDestinationAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCalculatingDirections, setIsCalculatingDirections] = useState(false);

  const { directionsData, setDirectionsData } = useContext(DirectionsDataContext) ?? {};
  const { isLoaded, loadError } = useGoogleMaps();

  // Fill in the addresses from existing directions data
  useState(() => {
    if (directionsData?.routes?.[0]?.legs?.[0]) {
      const leg = directionsData.routes[0].legs[0];
      setSource(leg.start_address);
      setDestination(leg.end_address);
    }
  });

  // Notify parent component when addresses change
  useEffect(() => {
    if (source && destination && onAddressChange) {
      onAddressChange(source, destination);
    }
  }, [source, destination, onAddressChange]);

  const onSourceLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setSourceAutocomplete(autocomplete);
  };

  const onDestinationLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setDestinationAutocomplete(autocomplete);
  };

  const calculateDirections = useCallback((sourceAddress: string, destinationAddress: string) => {
    if (!isLoaded || isCalculatingDirections || !sourceAddress || !destinationAddress) return;

    setIsCalculatingDirections(true);
    
    const geocoder = new google.maps.Geocoder();
    
    // First, geocode the addresses to get coordinates
    Promise.all([
      new Promise<{lat: number, lng: number} | null>((resolve) => {
        geocoder.geocode({ address: sourceAddress }, (results, status) => {
          if (status === 'OK' && results?.[0]?.geometry?.location) {
            const location = results[0].geometry.location;
            resolve({ lat: location.lat(), lng: location.lng() });
          } else {
            resolve(null);
          }
        });
      }),
      new Promise<{lat: number, lng: number} | null>((resolve) => {
        geocoder.geocode({ address: destinationAddress }, (results, status) => {
          if (status === 'OK' && results?.[0]?.geometry?.location) {
            const location = results[0].geometry.location;
            resolve({ lat: location.lat(), lng: location.lng() });
          } else {
            resolve(null);
          }
        });
      })
    ]).then(([sourceCoords, destCoords]) => {
      if (!sourceCoords || !destCoords) {
        setError('Could not find coordinates for the addresses. Please try different locations.');
        setIsCalculatingDirections(false);
        return;
      }
      
      // Calculate directions
      const directionsService = new google.maps.DirectionsService();
      directionsService.route({
        origin: sourceCoords,
        destination: destCoords,
        travelMode: google.maps.TravelMode.DRIVING,
      }, (result, status) => {
        if (status === 'OK' && result) {
          const route = result.routes[0];
          const leg = route.legs[0];
          
          // Convert distance from meters to kilometers and duration from seconds to minutes
          const distanceInKm = (leg.distance?.value || 0) / 1000;
          const durationInMinutes = (leg.duration?.value || 0) / 60;

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
          
          setError(null);
        } else {
          setError('Could not calculate directions. Please try different locations.');
          console.error('Directions request failed due to ' + status);
        }
        
        setIsCalculatingDirections(false);
      });
    });
  }, [isLoaded, setDirectionsData, isCalculatingDirections]);

  const onSourcePlaceChanged = () => {
    if (sourceAutocomplete) {
      try {
        const place = sourceAutocomplete.getPlace();
        if (place.formatted_address) {
          setSource(place.formatted_address);
          
          if (destination) {
            calculateDirections(place.formatted_address, destination);
          }
        } else {
          setError('Please select a valid location from the dropdown');
        }
      } catch (error) {
        console.error('Error selecting source:', error);
        setError('Failed to select location. Please try again.');
      }
    }
  };

  const onDestinationPlaceChanged = () => {
    if (destinationAutocomplete) {
      try {
        const place = destinationAutocomplete.getPlace();
        if (place.formatted_address) {
          setDestination(place.formatted_address);
          
          if (source) {
            calculateDirections(source, place.formatted_address);
          }
        } else {
          setError('Please select a valid location from the dropdown');
        }
      } catch (error) {
        console.error('Error selecting destination:', error);
        setError('Failed to select location. Please try again.');
      }
    }
  };

  if (loadError) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p>Error loading location services. Please check your internet connection and try again.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin text-yellow-500" />
        <span className="ml-2 text-gray-600">Loading location services...</span>
      </div>
    );
  }

  return (
    <form className="mt-5">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {isCalculatingDirections && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded flex items-center">
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          <span>Calculating route...</span>
        </div>
      )}
      {/* Source Input */}
      <div className="relative">
        <label className="text-gray-400 text-[20px]" htmlFor="source">
          Where From?
        </label>
        <Autocomplete
          onLoad={onSourceLoad}
          onPlaceChanged={onSourcePlaceChanged}
        >
          <input
            type="text"
            name="source"
            id="source"
            className="bg-white p-3 mt-2 border-[1px] w-full rounded-md outline-none focus:border-yellow-300 text-[20px]"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Enter pickup location"
          />
        </Autocomplete>
      </div>

      {/* Destination Input */}
      <div className="relative mt-5">
        <label className="text-gray-400 text-[20px]" htmlFor="destination">
          Where To?
        </label>
        <Autocomplete
          onLoad={onDestinationLoad}
          onPlaceChanged={onDestinationPlaceChanged}
        >
          <input
            type="text"
            name="destination"
            id="destination"
            className="bg-white p-3 mt-2 border-[1px] w-full rounded-md outline-none focus:border-yellow-300 text-[20px]"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter drop-off location"
          />
        </Autocomplete>
      </div>
    </form>
  );
}
