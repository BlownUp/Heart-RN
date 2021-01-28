import { StyleSheet } from "react-native";
import Raleway from "../assets/fonts/raleway/Raleway-Bold.ttf";
import Fredoka from "../assets/fonts/FredokaOne-Regular.ttf";
// import Raleway from "../assets/fonts/raleway/Raleway-Bold.ttf";
const RalewayFontBold = 
`@font-face {
  src: url(${Raleway});
  font-family: RalewayB;
}`;
const FredokaOne = 
`@font-face {
  src: url(${Fredoka});
  font-family: Fredoak;
}`;
/**
 * Common font family setting
 * - This font name will be used for all template
 */
export const FontFamily = {
  ralewayFontB: RalewayFontBold,
  fredoka: FredokaOne
};
/**
 * Fontweight setting
 * - This font weight will be used for style of screens where needed
 */
export const FontWeight = {
  thin: "100",
  ultraLight: "200",
  light: "300",
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "bold",
  heavy: "800",
  black: "900"
};
/**
 * Typography setting
 * - This font weight will be used for all template
 */
export const Typography = StyleSheet.create({
  large1: {
    fontSize: 87,
    fontFamily: FontFamily.ralewayFontB,
  },
  large2: {
    fontSize: 37,
    fontFamily: FontFamily.ralewayB,
  },
  header: {
    fontSize: 34,
    fontFamily: FontFamily.ralewayM,
  },
  title1: {
    fontSize: 28,
    fontFamily: FontFamily.ralewayM
  },
  title2: {
    fontSize: 22,
    fontFamily: FontFamily.ralewayM
  },
  title3: {
    fontSize: 20,
    // fontFamily: FontFamily.ralewayM
  },
  title4: {
    fontSize: 18,
    fontFamily: FontFamily.ralewayM
  },
  headline: {
    fontSize: 17,
    fontFamily: FontFamily.ralewayM
  },
  body1: {
    fontSize: 17,
    fontFamily: FontFamily.ralewayM
  },
  callout: {
    fontSize: 17,
    fontFamily: FontFamily.ralewayM
  },
  subhead: {
    fontSize: 15,
    fontFamily: FontFamily.ralewayM
  },
  body2: {
    fontSize: 14,
    fontFamily: FontFamily.ralewayM
  },
  footnote: {
    fontSize: 13,
    fontFamily: FontFamily.ralewayM
  },
  caption1: {
    fontSize: 12,
    fontFamily: FontFamily.ralewayM
  },
  caption2: {
    fontSize: 11,
    fontFamily: FontFamily.ralewayM
  },
  overline: {
    fontSize: 10,
    fontFamily: FontFamily.ralewayM
  }
});
