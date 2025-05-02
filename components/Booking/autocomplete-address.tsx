'use client';

import { DestinationCoordinatesContext } from "@/context/destination-coordinates-context";
import { SourceCoordinatesContext } from "@/context/source-coordinates-context";
import { useContext, useState } from "react";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";

export default function AutocompleteAddress() {
  const [source, setSource] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [sourceAutocomplete, setSourceAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [destinationAutocomplete, setDestinationAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const { setSourceCoordinates } = useContext(SourceCoordinatesContext) ?? {};
  const { setDestinationCoordinates } = useContext(DestinationCoordinatesContext) ?? {};

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY!,
    libraries: ['places'],
  });

  const onSourceLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setSourceAutocomplete(autocomplete);
  };

  const onDestinationLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setDestinationAutocomplete(autocomplete);
  };

  const onSourcePlaceChanged = () => {
    if (sourceAutocomplete) {
      const place = sourceAutocomplete.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setSource(place.formatted_address || '');
        setSourceCoordinates?.({ lat, lng });
      }
    }
  };

  const onDestinationPlaceChanged = () => {
    if (destinationAutocomplete) {
      const place = destinationAutocomplete.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setDestination(place.formatted_address || '');
        setDestinationCoordinates?.({ lat, lng });
      }
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <form className="mt-5">
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
          />
        </Autocomplete>
      </div>

      {/* Destination Input */}
      <div className="relative">
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
          />
        </Autocomplete>
      </div>
    </form>
  );
}
