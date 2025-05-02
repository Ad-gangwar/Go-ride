'use client';

import { DestinationCoordinatesContext } from "@/context/destination-coordinates-context";
import { SourceCoordinatesContext } from "@/context/source-coordinates-context";
import { useContext, useState } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { Loader2 } from "lucide-react";
import { useGoogleMaps } from "@/context/google-maps-context";

export default function AutocompleteAddress() {
  const [source, setSource] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [sourceAutocomplete, setSourceAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [destinationAutocomplete, setDestinationAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { setSourceCoordinates } = useContext(SourceCoordinatesContext) ?? {};
  const { setDestinationCoordinates } = useContext(DestinationCoordinatesContext) ?? {};
  const { isLoaded, loadError } = useGoogleMaps();

  const onSourceLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setSourceAutocomplete(autocomplete);
  };

  const onDestinationLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setDestinationAutocomplete(autocomplete);
  };

  const onSourcePlaceChanged = () => {
    if (sourceAutocomplete) {
      try {
        const place = sourceAutocomplete.getPlace();
        if (place.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          setSource(place.formatted_address || '');
          setSourceCoordinates?.({ lat, lng });
          setError(null);
        } else {
          setError('Please select a valid location');
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
        if (place.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          setDestination(place.formatted_address || '');
          setDestinationCoordinates?.({ lat, lng });
          setError(null);
        } else {
          setError('Please select a valid location');
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
      {/* Source Input */}
      <div className="relative">
        <label className="text-gray-400 text-[13px]" htmlFor="source">
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
            className="bg-white p-1 border-[1px] w-full rounded-md outline-none focus:border-yellow-300 text-[14px]"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Enter pickup location"
          />
        </Autocomplete>
      </div>

      {/* Destination Input */}
      <div className="relative mt-4">
        <label className="text-gray-400 text-[13px]" htmlFor="destination">
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
            className="bg-white p-1 border-[1px] w-full rounded-md outline-none focus:border-yellow-300 text-[14px]"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter drop-off location"
          />
        </Autocomplete>
      </div>
    </form>
  );
}
