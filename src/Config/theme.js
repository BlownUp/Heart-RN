import { StyleSheet } from "react-native";
import { BaseColor } from "./color";

/**
 * Common basic style defines
 */
export const BaseStyle = StyleSheet.create({
  toast: {
    backgroundColor: BaseColor.kashmir,
    maxWidth: "80%"
  },
  toast_text: {
    color: BaseColor.whiteColor,
    fontWeight: "bold",
    textAlign: "center"
  }
});
