import { cssInterop } from "nativewind";
import { MapView as RNMapView } from "../ui/MapView";

export const MapView = cssInterop(RNMapView, {
  className: { target: "style" },
});
