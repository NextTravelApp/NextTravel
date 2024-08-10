import { cssInterop } from "nativewind";
import RNMapView from "react-native-maps";

export const MapView = cssInterop(RNMapView, {
  className: { target: "style" },
});
