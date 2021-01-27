import React, { Component } from "react";
import { View, ActivityIndicator, StyleSheet, Dimensions, ImageBackground, TouchableOpacity } from "react-native";
import { Header, Text, Review } from "../Components";
import { BaseColor, Images } from "../Config";
import { Image } from "react-native-elements";

const _HEIGHT = Dimensions.get("window").height;
export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        }
    }
    componentDidMount() {
    }
    render() {
        const { loading } = this.state;
        return (
            <View style={styles.container}>
                <Header />
                {loading && <ActivityIndicator
                    size="large"
                    color={"#000"}
                    style={styles.loading}
                />}
                <ImageBackground source={{ uri: Images.back }} resizeMode={'cover'} style={styles.topbanner}>
                    <View style={styles.tools}>
                        <Text title1>Heart Inc</Text>
                    </View>
                    <View style={[{ flex: 1 }, styles.center]}>
                        <Text large1 black>Ditch the <Text whiteColor>pa</Text>perwork</Text>
                        <Text large2 black>Submit health fo<Text whiteColor>rms in </Text>60 seconds or less</Text>
                    </View>
                    <View style={[styles.tools, { flexDirection: "row" }]}>
                        <View style={[{ flex: 1 }, styles.center]}>
                            <TouchableOpacity style={styles.app_link}>
                                <Text title2 bold>Download app</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[{ flex: 1 }, styles.center]}>
                            <TouchableOpacity style={styles.app_link}>
                                <Text title2 bold>Continue on web</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
                <View style={styles.intro}>
                    <View style={[{ flex: 1, padding: 40 }, styles.center]}>
                        <Text header bold>How it's work</Text>
                        <View style={styles.introvideo}>
                        </View>
                    </View>
                    <View style={[styles.center, { flex: 1, paddingTop: 50, paddingLeft: "10%", paddingRight: 30 }]}>
                        <View style={[styles.center, styles.actions]}>
                            <View style={[styles.tool_image_back, styles.center]}>
                                <Image source={Images.take_picture} style={styles.tool_image} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text title1 black>Take a photo or upload</Text>
                                <Text title3>some description.</Text>
                            </View>
                        </View>
                        <View style={[styles.center, styles.actions]}>
                            <View style={[styles.tool_image_back, styles.center]}>
                                <Image source={Images.pick_time} style={styles.tool_image} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text title1 black>You  pick a time</Text>
                                <Text title3>Take a photo or uploadTake a photo or uploadTake a photo or upload</Text>
                            </View>
                        </View>
                        <View style={[styles.center, styles.actions]}>
                            <View style={[styles.tool_image_back, styles.center]}>
                                <Image source={Images.provider} style={styles.tool_image} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text title1 black>You're connected with a provider</Text>
                                <Text title3>Take a photo or uploadTake a photo or uploadTake a photo or upload</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.review}>
                    <Review name={"Anna Taylor"} content={"review contet here."} />
                    <Review name={"Anna Taylor"} content={"review contet here."} />
                    <Review name={"Anna Taylor"} content={"review contet here."} />
                    <View style={{ flex: 2 }}>
                        {/* <Image source={Images.phone} style={styles.phoneimage} /> */}
                    </View>
                </View>

            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: BaseColor.primaryColor,
        width: "70%",
        marginHorizontal: "15%"
    },
    center: {
        justifyContent: "center",
        alignItems: "center",
    },
    tools: {
        width: "100%",
        paddingHorizontal: 60,
        paddingVertical: 10,
        height: 160,
        alignItems: "flex-start",
    },
    loading: {
        position: "absolute",
        top: 180,
        bottom: 0,
    },
    topbanner: {
        height: _HEIGHT - 80,
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    app_link: {
        paddingVertical: 20,
        paddingHorizontal: 30,
        backgroundColor: BaseColor.whiteColor,
        borderRadius: 12
    },
    intro: {
        flex: 1,
        flexDirection: "row",
        paddingTop: 30
    },
    introvideo: {
        width: "100%",
        height: 500,
        backgroundColor: BaseColor.whiteColor,
        borderRadius: 100,
        marginTop: 20
    },
    tool_image_back: {
        backgroundColor: BaseColor.whiteColor,
        padding: 10,
        borderRadius: 20,
        marginRight: 60,
        marginVertical: 20
    },
    tool_image: {
        width: 80,
        height: 80
    },
    actions: {
        flexDirection: "row",
        width: "100%",
    },
    review: {
        flexDirection: "row",
        padding: 20,
        backgroundColor: BaseColor.whiteColor,
        borderBottomColor: BaseColor.grayColor,
        borderBottomWidth: 2,
    },
    phoneimage: {
        height: "150%",
        width: 60
    }
});
