import React, { Component } from "react";
import { View, ActivityIndicator, StyleSheet, Dimensions, ImageBackground, TouchableOpacity, ScrollView } from "react-native";
import { Header, Text, Review } from "../Components";
import { BaseColor, Images, BaseConfig } from "../Config";
import { Image } from "react-native-elements";
import image2str from '../utils/textract';
import Modal from 'modal-react-native-web';
// import dynamodb from "../utils/dynamodb";

const _HEIGHT = Dimensions.get("window").height;
const _WIDTH = Dimensions.get("window").width;

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            camera_visible: false,
        }
        this.imagetype = BaseConfig.buckets.radiology;  //diagnostic, prescription
    }
    componentDidMount() {
    }
    openCamera() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
                var video = document.getElementById('camera_preview');
                video.srcObject = stream;
                video.play();
            });
        }
        this.setState({ camera_visible: true });
    }
    async textract(base64) {
        this.setState({ loading: true });
        const results = await image2str(base64);

        let text = results.Blocks.map(item => item.Text)
        text = text.join("     ");
        this.setState({ loading: false, textract_res: text });
    }
    async selectedImage(event) {
        var file = event.target.files[0];
        var base64 = await this.filetoBase64(file)
        this.textract(base64);
    }
    closeCamera() {
        this.setState({ camera_visible: false })
    }
    takepicture() {
        const video = document.getElementById("camera_preview");
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL();
        this.textract(dataURL);
        this.closeCamera();
    }
    filetoBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
    selectImage() {
        this.fileInput.click()
    }

    render() {
        const { loading, camera_visible, textract_res } = this.state;
        return (
            <ScrollView style={styles.container} ref={(view) => {
                this.scrollView = view;
            }}>
                {/* for test */}
                {/*
                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity onPress={this.openCamera.bind(this)} style={{ padding: 20, backgroundColor: BaseColor.success }}>
                        <Text title3 whiteColor>open camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.selectImage.bind(this)} style={{ padding: 20, backgroundColor: BaseColor.success }}>
                        <Text title3 whiteColor>choose file</Text>
                    </TouchableOpacity>
                </View> */}
                {/* <Text title2>{textract_res}</Text> */}
                <Header />
                <ImageBackground source={{ uri: Images.back }} resizeMode={'cover'} style={styles.topbanner}>
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
                            <TouchableOpacity style={styles.app_link} onPress={() => {
                                this.scrollView.scrollTo({ y: _HEIGHT, animated: true });
                            }}>
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
                        <TouchableOpacity style={[styles.center, styles.actions]}>
                            <View style={[styles.tool_image_back, styles.center]}>
                                <Image source={Images.take_picture} style={styles.tool_image} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text title3 black>Take a photo or upload</Text>
                                <Text title4>some description.</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={[styles.center, styles.actions]}>
                            <View style={[styles.tool_image_back, styles.center]}>
                                <Image source={Images.pick_time} style={styles.tool_image} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text title3 black>You  pick a time</Text>
                                <Text title4>some description</Text>
                            </View>
                        </View>
                        <View style={[styles.center, styles.actions]}>
                            <View style={[styles.tool_image_back, styles.center]}>
                                <Image source={Images.provider} style={styles.tool_image} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text title3 black>You're connected with a provider</Text>
                                <Text title4>some description</Text>
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

                <View style={[styles.center, { position: "relative" }]}>
                    <View style={{
                        width: "100%",
                        height: 400,
                        position: "absolute",
                        top: -350,
                        flexDirection: "row",
                        zIndex: 999999999,
                        opacity: 1
                    }}>
                        <View style={{ flex: 3 }} />
                        <View style={{ flex: 2, flexDirection: "row", opacity: 1 }}>
                            <View style={[{ flex: 1, justifyContent: "center" }]}>
                                <Image source={Images.google_play} style={styles.mobile_app} resizeMode={'contain'} />
                                <Image source={Images.apple_store} style={styles.mobile_app} resizeMode={'contain'} />
                            </View>
                            <Image source={Images.phone} style={styles.phoneimage} resizeMode={'contain'} />
                        </View>
                    </View>
                    <View style={{ backgroundColor: BaseColor.whiteColor, opacity: 0.8, padding: 40 }}>
                        <Text header black >What use heart inc instead?</Text>
                        <Text title2 style={styles.insteadText}>
                            What use heart inc instead?What use heart inc instead?What use heart inc instead? What use heart inc instead?   What use heart inc instead? What use heart inc instead?
                        </Text>
                    </View>
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
                            <View style={[styles.social]}>
                                <Image source={Images.linkedin} style={[styles.socialIcon]} />
                            </View>
                            <View style={[styles.social]}>
                                <Image source={Images.youtube} style={[styles.socialIcon]} />
                            </View>
                            <View style={[styles.social]}>
                                <Image source={Images.instagram} style={[styles.socialIcon]} />
                            </View>
                        </View>
                    </View>
                </View>
                <View style={[styles.footer, styles.center]}>
                    <Text headline black>(C) 2021 Heart Inc</Text>
                </View>
                <input type="file" ref={ref => this.fileInput = ref} style={{ display: "none" }} onChange={(e) => this.selectedImage(e)} />
                {loading &&
                    <View style={styles.loading}>
                        <ActivityIndicator
                            size="large"
                            color={"#000"}
                            style={{
                                transform: [{ scale: 1.4 }]
                            }}
                        />
                    </View>
                }

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={camera_visible}
                    ariaHideApp={false}
                >
                    <video id="camera_preview" width="100%" height="100%" style={{ backgroundColor: "black" }} autoPlay></video>
                    <TouchableOpacity onPress={this.closeCamera.bind(this)} style={styles.btn_close}><Text style={{ fontSize: 70, color: "#fff", }}>×</Text></TouchableOpacity>
                    <TouchableOpacity onPress={this.takepicture.bind(this)} style={styles.btn_record}></TouchableOpacity>
                </Modal>
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: BaseColor.homePinkColor,
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
        left: 0,
        right: 0,
    },
    topbanner: {
        height: _HEIGHT - 80,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    app_link: {
        paddingVertical: 20,
        paddingHorizontal: 30,
        backgroundColor: BaseColor.lightButtonColor,
        border: "1px solid rgba(26,26,26,0.1)",
        borderRadius: 12
    },
    intro: {
        flex: 1,
        flexDirection: "row",
        paddingTop: 30,
        paddingBottom: 100,
        backgroundColor: BaseColor.homePinkColor,
    },
    introvideo: {
        width: "100%",
        height: 400,
        width: 400,
        backgroundColor: BaseColor.whiteColor,
        opacity: 0.5,
        borderRadius: 100,
        marginTop: 20,
        border: "1px solid rgba(26,26,26,0.2)"
    },
    tool_image_back: {
        backgroundColor: BaseColor.whiteColor,
        padding: 10,
        borderRadius: 20,
        marginRight: 20,
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
        opacity: 0.8,
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
        // borderBottomWidth: 2,
    },
    mobile_app: {
        height: 50,
        marginVertical: 10,
    },
    footer: {
        paddingVertical: 30,
    },
    insteadText: {
        textAlign: "center",
        lineHeight: 40,
        paddingBottom: 20,
        borderBottomColor: BaseColor.grayColor,
        borderBottomWidth: 2,
    },
    social: {
        width: 30,
        height: 30,
        marginHorizontal: 10
    },
    socialIcon: {
        width: 30,
        height: 30
    },
    btn_record: {
        backgroundColor: "#f00",
        position: "absolute",
        bottom: 100,
        width: 60,
        height: 60,
        borderRadius: "100%",
        left: _WIDTH / 2 - 30
    },
    btn_close: {
        position: "absolute",
        top: 30,
        right: 40,
    }
});
