import { DirectionsDataContext } from "@/context/directions-data-context";
import { useContext } from "react";

export default function DistanceTime() {
  const { directionsData } = useContext(DirectionsDataContext) ?? {};

  if (!directionsData?.routes?.[0]) return null;

  const route = directionsData.routes[0];
  const distance = route.distance + ' km' || '0 km';
  const duration = route.duration + ' mins' || '0 mins';

  return (
    <div className="bg-yellow-500 p-3">
      <h2 className="text-yellow-100 opacity-80 text-[15px]">
        Distance:&nbsp;{""}
        <span className="font-bold mr-3 text-black ml-1">
          {distance}
        </span>
        Duration:&nbsp;{""}
        <span className="font-bold text-black">
          {duration}
        </span>
      </h2>
    </div>
  );
}
