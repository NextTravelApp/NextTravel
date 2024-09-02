import RNMapView, { Marker, type LatLng } from "react-native-maps";

export type MapViewProps = React.ComponentProps<typeof RNMapView> & {
  markers?: {
    coordinate: LatLng;
    title: string;
    description: string;
    onPress: () => void;
  }[];
};

export function MapView(props: MapViewProps) {
  return (
    <RNMapView {...props}>
      {props.markers?.map((marker) => (
        <Marker
          key={marker.title}
          coordinate={marker.coordinate}
          title={marker.title}
          description={marker.description}
          onPress={marker.onPress}
        />
      ))}
    </RNMapView>
  );
}
