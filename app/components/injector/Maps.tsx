import { cssInterop } from "nativewind";
import RNMapView from "../ui/MapView";

export const MapView = cssInterop(RNMapView, {
  className: { target: "style" },
});
