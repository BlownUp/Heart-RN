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
        const { onLogin, auth, onLogout } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.logoWrap}>
                    {/* <Image
                        source={{ uri: Images.logo }}
                        style={{ width: 60, height: 80 }}
                        resizeMode={'contain'}
                    /> */}
                    {/* <View style={styles.tools}> */}
                    <Text title1>rEVEN AI</Text>
                    {/* </View> */}
                </View>
                <View style={{ flex: 1 }} />
                <View style={styles.navbar}>
                    {/* <TouchableOpacity onPress={this.onGoPage.bind(this, "Radiology")} style={styles.navitem}>
                        <Text navbar>Radiology</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onGoPage.bind(this, "Diagnostics")} style={styles.navitem}>
                        <Text navbar>Diagnostics</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onGoPage.bind(this, "Prescriptions")} style={styles.navitem}>
                        <Text navbar>Prescriptions</Text>
                    </TouchableOpacity> */}
                    {auth?.logged ?
                        <TouchableOpacity onPress={onLogout} style={[styles.navitem, styles.login]}>
                            <Text navbar>Log out</Text>
                        </TouchableOpacity>
                        :
                        <>
                            <TouchableOpacity onPress={onLogin} style={[styles.navitem, styles.login]}>
                                <Text navbar>Log in</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.onGoPage.bind(this, "Pricing")} style={[styles.navitem, styles.pricing]}>
                                <Text navbar>Pricing</Text>
                            </TouchableOpacity>
                        </>
                    }
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
        maxHeight: 80,
        flexDirection: "row"
    },
    navbar: {
        flexDirection: "row"
    },
    navitem: {
        marginHorizontal: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    logoWrap: {
        justifyContent: "flex-end",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        // backgroundImage: `linear-gradient(to bottom, ${BaseColor.logoColorTop}, ${BaseColor.logoColorBottom})`
    },
    login: {
        marginLeft: 80
    },
    tools: {
        width: "100%",
        paddingHorizontal: 60,
        paddingVertical: 10,
        height: 160,
        // alignItems: "flex-start",
    },
    pricing: {
        backgroundColor: BaseColor.primaryColor,
        borderRadius: 8,
        opacity: 0.8,
        border: "1px solid rgba(26,26,26,0.1)"
    }
});
