import { StyleSheet } from "react-native";
/**
 * Common font family setting
 * - This font name will be used for all template
 */

export const FontFamily = {
  default: 'Raleway',
  ralewayB: 'RalewayB',
  ralewayM: 'RalewayM',
  fredoka: 'Fredoka',
  openSansB: 'OpenSansB',
  openSansR: 'OpenSansR'
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
    fontFamily: FontFamily.ralewayB,
  },
  large2: {
    fontSize: 37,
    fontFamily: FontFamily.raleway,
  },
  header: {
    fontSize: 34,
    fontFamily: FontFamily.fredoka,
  },
  title1: {
    fontSize: 28,
    fontFamily: FontFamily.fredoka
  },
  title2: {
    fontSize: 22,
    fontFamily: FontFamily.openSansR
  },
  title3: {
    fontSize: 18,
    fontFamily: FontFamily.fredoka
  },
  title4: {
    fontSize: 18,
    fontFamily: FontFamily.openSansR
  },
  title5: {
    fontSize: 16,
    fontFamily: FontFamily.fredoka
  },
  navbar: {
    fontSize: 18,
    fontFamily: FontFamily.ralewayM
  },
  headline: {
    fontSize: 17,
    fontFamily: FontFamily.fredoka
  },
  body1: {
    fontSize: 18,
    fontFamily: FontFamily.openSansR
  },
  callout: {
    fontSize: 17,
    fontFamily: FontFamily.ralewayM
  },
  subhead: {
    fontSize: 16,
    fontFamily: FontFamily.ralewayM,
    lineHeight: 22
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
  },
  body3: {
    fontSize: 17,
    fontFamily: FontFamily.ralewayM
  },
  titleFooter: {
    fontSize: 28,
    fontFamily: FontFamily.fredoka
  },
  hostsmallFredoka: {
    fontSize: 18,
    fontFamily: FontFamily.fredoka,
    fontWeight: 500
  },
});
