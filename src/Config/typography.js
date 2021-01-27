import { StyleSheet } from "react-native";

/**
 * Common font family setting
 * - This font name will be used for all template
 */
export const FontFamily = {
  default: "AbrilFatface"
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
    fontFamily: FontFamily.default,
  },
  large2: {
    fontSize: 37,
    fontFamily: FontFamily.default,
  },
  header: {
    fontSize: 34,
    fontFamily: FontFamily.default,
  },
  title1: {
    fontSize: 28,
    fontFamily: FontFamily.default
  },
  title2: {
    fontSize: 22,
    fontFamily: FontFamily.default
  },
  title3: {
    fontSize: 20,
    fontFamily: FontFamily.default
  },
  headline: {
    fontSize: 17,
    fontFamily: FontFamily.default
  },
  body1: {
    fontSize: 17,
    fontFamily: FontFamily.default
  },
  callout: {
    fontSize: 17,
    fontFamily: FontFamily.default
  },
  subhead: {
    fontSize: 15,
    fontFamily: FontFamily.default
  },
  body2: {
    fontSize: 14,
    fontFamily: FontFamily.default
  },
  footnote: {
    fontSize: 13,
    fontFamily: FontFamily.default
  },
  caption1: {
    fontSize: 12,
    fontFamily: FontFamily.default
  },
  caption2: {
    fontSize: 11,
    fontFamily: FontFamily.default
  },
  overline: {
    fontSize: 10,
    fontFamily: FontFamily.default
  }
});
