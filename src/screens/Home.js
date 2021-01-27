import React, { Component } from "react";
import { View, ActivityIndicator, StyleSheet, Dimensions, ImageBackground, TouchableOpacity, ScrollView } from "react-native";
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
            <ScrollView style={styles.container}>
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
                        <Text large1 black style={{ textAlign: "center" }}>Ditch the <Text whiteColor>pa</Text>perwork</Text>
                        <Text large2 black style={{ textAlign: "center" }}>Submit health fo<Text whiteColor>rms in </Text>60 seconds or less</Text>
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
                    <View style={{ flex: 2, flexDirection: "row" }}>

                    </View>
                </View>

                <View style={[styles.center, { backgroundColor: BaseColor.whiteColor, padding: 40, position: "relative" }]}>
                    <View style={{
                        width: "100%",
                        height: 400,
                        position: "absolute",
                        top: -350,
                        flexDirection: "row",
                        zIndex: 999999999
                    }}>
                        <View style={{ flex: 3 }} />
                        <View style={{ flex: 2, flexDirection: "row" }}>
                            <View style={[{ flex: 1, justifyContent: "center" }]}>
                                <Image source={Images.google_play} style={styles.mobile_app} resizeMode={'contain'} />
                                <Image source={Images.apple_store} style={styles.mobile_app} resizeMode={'contain'} />
                            </View>
                            <Image source={Images.phone} style={styles.phoneimage} resizeMode={'contain'} />
                        </View>
                    </View>
                    <Text header black>What use heart inc instead?</Text>
                    <Text title2 style={{ textAlign: "center", lineHeight: 50 }}>
                        What use heart inc instead?What use heart inc instead?What use heart inc instead? What use heart inc instead?   What use heart inc instead? What use heart inc instead?
                    </Text>
                </View>
                <View style={styles.bottom}>
                    <View style={{ flex: 1 }}>
                        <Text title2 black style={{ lineHeight: 60 }}>Sign up for our newsletter</Text>
                        <View style={{ flex: 1, flexDirection: "row" }}>
                            <View style={{ backgroundColor: BaseColor.whiteColor, borderRadius: 10, height: 60, flex: 1 }} />
                            <View style={{ backgroundColor: BaseColor.whiteColor, borderRadius: 10, width: 50, height: 60, marginLeft: 20 }} />
                        </View>
                    </View>
                    <View style={{ flex: 2, flexDirection: "row", paddingLeft: 80 }}>
                        <View style={{ flex: 1 }}>
                            <Text title2 style={{ lineHeight: 60 }}>{"Company"}</Text>
                            <Text subhead>{"About us"}</Text>
                            <Text subhead>{"Terms"}</Text>
                            <Text subhead>{"Policy"}</Text>
                            <Text subhead>{"Pricing"}</Text>
                            <Text subhead>{"Contact us"}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text title2 style={{ lineHeight: 60 }}>{"Company"}</Text>
                            <Text subhead>{"About us"}</Text>
                            <Text subhead>{"Terms"}</Text>
                            <Text subhead>{"Policy"}</Text>
                            <Text subhead>{"Pricing"}</Text>
                            <Text subhead>{"Contact us"}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text title2 style={{ lineHeight: 60 }}>{"Company"}</Text>
                            <Text subhead>{"About us"}</Text>
                            <Text subhead>{"Terms"}</Text>
                            <Text subhead>{"Policy"}</Text>
                            <Text subhead>{"Pricing"}</Text>
                            <Text subhead>{"Contact us"}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: "row" }}>
                            <View style={{ width: 30, height: 30, backgroundColor: "blue", marginHorizontal: 10 }} />
                            <View style={{ width: 30, height: 30, backgroundColor: "blue", marginHorizontal: 10 }} />
                            <View style={{ width: 30, height: 30, backgroundColor: "blue", marginHorizontal: 10 }} />
                            <View style={{ width: 30, height: 30, backgroundColor: "blue", marginHorizontal: 10 }} />
                        </View>
                    </View>
                </View>
                <View style={[styles.footer, styles.center]}>
                    <Text headline black>(C) 2021 Heart Inc</Text>
                </View>
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: BaseColor.primaryColor,
        width: "70%",
        marginHorizontal: "15%",
        maxHeight: _HEIGHT,
        minHeight: _HEIGHT,
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
        height: 300,
        alignItems: "flex-end",
        paddingBottom: 40
    },
    phoneimage: {
        width: 350,
        zIndex: 9999,
    },
    bottom: {
        flexDirection: "row",
        paddingVertical: 60,
        marginHorizontal: 100,
        borderBottomColor: BaseColor.grayColor,
        borderBottomWidth: 2,
    },
    mobile_app: {
        height: 50,
        marginVertical: 10,
    },
    footer: {
        paddingVertical: 30,
    }
});
