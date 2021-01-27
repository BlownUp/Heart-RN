import React, { Component } from "react";
import { Text, StyleSheet } from "react-native";

import { Typography, FontWeight, BaseColor } from "../Config";

export default class Index extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      //props style
      large1,
      large2,
      header,
      title1,
      title2,
      title3,
      headline,
      body1,
      body2,
      callout,
      subhead,
      footnote,
      caption1,
      caption2,
      overline,
      // props font
      thin,
      ultraLight,
      light,
      regular,
      medium,
      semibold,
      bold,
      heavy,
      black,
      //custom color

      primaryColor,
      whiteColor,
      grayColor,
      dividerColor,
      blackColor,
      fieldColor,
      yellowColor,
      success,
      warning,
      danger,
      redColor,
      transparent,

      numberOfLines,
      //custom
      style
    } = this.props;
    return (
      <Text
        style={StyleSheet.flatten([
          large1 && Typography.large1,
          large2 && Typography.large2,
          header && Typography.header,
          title1 && Typography.title1,
          title2 && Typography.title2,
          title3 && Typography.title3,
          headline && Typography.headline,
          body1 && Typography.body1,
          body2 && Typography.body2,
          callout && Typography.callout,
          subhead && Typography.subhead,
          footnote && Typography.footnote,
          caption1 && Typography.caption1,
          caption2 && Typography.caption2,
          overline && Typography.overline,
          //custom for font
          thin && StyleSheet.flatten({ fontWeight: FontWeight.thin }),
          ultraLight && StyleSheet.flatten({ fontWeight: FontWeight.ultraLight }),
          light && StyleSheet.flatten({ fontWeight: FontWeight.light }),
          regular && StyleSheet.flatten({ fontWeight: FontWeight.regular }),
          medium && StyleSheet.flatten({ fontWeight: FontWeight.medium }),
          semibold && StyleSheet.flatten({ fontWeight: FontWeight.semibold }),
          bold && StyleSheet.flatten({ fontWeight: FontWeight.bold }),
          heavy && StyleSheet.flatten({ fontWeight: FontWeight.heavy }),
          black && StyleSheet.flatten({ fontWeight: FontWeight.black }),
          // default color
          StyleSheet.flatten({ color: BaseColor.blackColor }),
          //custom for color
          primaryColor && StyleSheet.flatten({ color: BaseColor.primaryColor }),
          whiteColor && StyleSheet.flatten({ color: BaseColor.whiteColor }),
          grayColor && StyleSheet.flatten({ color: BaseColor.grayColor }),
          dividerColor && StyleSheet.flatten({ color: BaseColor.dividerColor }),
          blackColor && StyleSheet.flatten({ color: BaseColor.blackColor }),
          fieldColor && StyleSheet.flatten({ color: BaseColor.fieldColor }),
          yellowColor && StyleSheet.flatten({ color: BaseColor.yellowColor }),
          success && StyleSheet.flatten({ color: BaseColor.success }),
          warning && StyleSheet.flatten({ color: BaseColor.warning }),
          danger && StyleSheet.flatten({ color: BaseColor.danger }),
          redColor && StyleSheet.flatten({ color: BaseColor.redColor }),
          transparent && StyleSheet.flatten({ color: BaseColor.transparent }),

          style && style
        ])}
        numberOfLines={numberOfLines}
      >
        {this.props.children}
      </Text>
    );
  }
}