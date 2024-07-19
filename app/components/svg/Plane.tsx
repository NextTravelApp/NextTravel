import Svg, { type SvgProps, Path } from "react-native-svg";

const Plane = (props: SvgProps) => (
  <Svg width={172} height={148} {...props}>
    <Path
      fill="currentColor"
      d="m.489 77.033 27.32-26.373 9.18-36.847 14.43 8.332-.066 28.364 36.695 21.186L101.12.812l14.568 8.41-7.711 73.979c48.52 26.356 67.584 40.789 63.317 50.299-6.103 8.451-28.134-.843-75.219-29.684l-60.212 43.667-14.568-8.411 54.852-46.761L39.45 71.124 14.92 85.365.489 77.033Z"
    />
  </Svg>
);

export default Plane;
