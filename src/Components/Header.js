import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from 'react-native-elements';
import { BaseColor, Images } from "../Config";
import { Text } from "./index";

export default class Home extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
    }
    onGoPage(page) {
        alert(`next page: ${page}`);
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={{ justifyContent: "flex-end", height: "100%" }}>
                    <Image
                        source={{ uri: Images.logo }}
                        style={{ width: 60, height: 90 }}
                        resizeMode={'contain'}
                    />
                </View>
                <View style={{ flex: 1 }} />
                <View style={styles.navbar}>
                    <TouchableOpacity onPress={this.onGoPage.bind(this, "Radiology")} style={styles.navitem}>
                        <Text title3>Radiology</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onGoPage.bind(this, "Diagnostics")} style={styles.navitem}>
                        <Text title3>Diagnostics</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onGoPage.bind(this, "Prescriptions")} style={styles.navitem}>
                        <Text title3>Prescriptions</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onGoPage.bind(this, "login")} style={[styles.navitem, styles.login]}>
                        <Text title3>Log in</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onGoPage.bind(this, "Pricing")} style={[styles.navitem, styles.pricing]}>
                        <Text title3>Pricing</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: BaseColor.whiteColor,
        height: 80,
        minHeight: 80,
        maxHeight:80,
        flexDirection: "row"
    },
    navbar: {
        flexDirection: "row"
    },
    navitem: {
        marginHorizontal: 20,
        paddingVertical: 10,
        paddingHorizontal:15
    },
    login: {
        marginLeft: 80
    },
    pricing: {
        backgroundColor: BaseColor.primaryColor,
        borderRadius: 8,
    }
});
