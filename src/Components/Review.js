import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from 'react-native-elements';
import { BaseColor, Images } from "../Config";
import { Text } from "./index";

export default class Review extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { name, content, size } = this.props;
        let width = 25;
        let height = 25;
        if (size) {
            width = size;
            height = size;
        }
        return (
            <View style={styles.container}>
                <View style={{ flexDirection: "row", marginBottom:10 }}>
                    <Image source={{ uri: Images.star }} style={[{ width, height }, styles.star]} />
                    <Image source={{ uri: Images.star }} style={[{ width, height }, styles.star]} />
                    <Image source={{ uri: Images.star }} style={[{ width, height }, styles.star]} />
                    <Image source={{ uri: Images.star }} style={[{ width, height }, styles.star]} />
                </View>
                <Text title3>{name}</Text>
                <Text headline>{content}</Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    star:{
        marginHorizontal:2,
    }
});
