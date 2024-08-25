import { useEffect } from "react";
import { Platform, View } from "react-native";
import { getLocale } from "../i18n/LocalesHandler";
import type { MapViewProps } from "./MapView";

export function MapView(props: MapViewProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js";

    document.body.appendChild(script);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: window.mapkit is injected by the script tag
  useEffect(() => {
    if (Platform.OS !== "web" || !window.mapkit) return;

    window.mapkit.init({
      authorizationCallback: (done) => {
        done(process.env.EXPO_PUBLIC_MAPKIT ?? "");
      },
      language: getLocale(),
    });

    const Rome = new window.mapkit.CoordinateRegion(
      new window.mapkit.Coordinate(
        props.initialRegion?.latitude ?? 0,
        props.initialRegion?.longitude ?? 0,
      ),
      new window.mapkit.CoordinateSpan(
        props.initialRegion?.latitudeDelta ?? 0,
        props.initialRegion?.longitudeDelta ?? 0,
      ),
    );

    const map = new window.mapkit.Map("map");
    map.region = Rome;

    // @ts-expect-error: mapkit events are not typed correctly
    map.element.addEventListener("click", (event: MouseEvent) => {
      if ((event.target as HTMLElement)?.parentNode !== map.element) return;

      const domPoint = new DOMPoint(event.pageX, event.pageY);
      const coordinate = map.convertPointOnPageToCoordinate(domPoint);

      // biome-ignore lint/suspicious/noExplicitAny: onPress is a prop of MapView
      (props.onPress as any)?.({
        nativeEvent: { coordinate },
      });
    });
  }, [window.mapkit]);

  return (
    <View {...props}>
      <div
        id="map"
        style={{
          height: "100%",
          width: "100%",
          borderRadius: 10,
        }}
      />
    </View>
  );
}
