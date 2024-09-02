import { useEffect } from "react";
import { Platform, View } from "react-native";
import { getLocale } from "../i18n/LocalesHandler";
import type { MapViewProps } from "./MapView";

export function MapView(props: MapViewProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js";

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
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

    const map = new window.mapkit.Map(`map${props.id ? `-${props.id}` : ""}`);

    if (props.initialRegion)
      map.region = new window.mapkit.CoordinateRegion(
        new window.mapkit.Coordinate(
          props.initialRegion.latitude,
          props.initialRegion.longitude,
        ),
        new window.mapkit.CoordinateSpan(
          props.initialRegion.latitudeDelta,
          props.initialRegion.longitudeDelta,
        ),
      );

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

    if (props.markers)
      for (const marker of props.markers) {
        const annotation = new window.mapkit.MarkerAnnotation(
          new window.mapkit.Coordinate(
            marker.coordinate.latitude,
            marker.coordinate.longitude,
          ),
          {
            title: marker.title,
            subtitle: marker.description,
          },
        );

        annotation.addEventListener("select", () => marker.onPress());

        map.addAnnotation(annotation);
      }

    return () => {
      map.destroy();
    };
  }, [window.mapkit]);

  return (
    <View {...props}>
      <div
        id={`map${props.id ? `-${props.id}` : ""}`}
        style={{
          height: "100%",
          width: "100%",
          borderRadius: 10,
        }}
      />
    </View>
  );
}
