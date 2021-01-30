import React, { Component } from "react";
import { View, ActivityIndicator, StyleSheet, Dimensions, ImageBackground, TouchableOpacity, ScrollView, TextInput } from "react-native";
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
            choose_video_modal: false,
            selected_image: null,
            visible_signup:false
        }
        this.imagetype = BaseConfig.buckets.radiology;  //diagnostic, prescription
        this.cameraStream = null;

    }
    componentDidMount() {
    }
    openCamera() {
        navigator?.mediaDevices?.getUserMedia({ video: true })
            .then(stream => {
                var video = document.getElementById('camera_preview');
                video.srcObject = stream;
                this.cameraStream = stream;
                video.play();
            })
            .catch(err => {
                console.log(err);
                alert(err)
            });
        this.setState({ camera_visible: true });
    }
    async textract() {
        const { selected_image } = this.state;
        if (!selected_image) {
            alert("Please take or upload photo");
            return;
        }
        this.setState({ loading: true });
        console.log("results");
        const results = await image2str(selected_image);
        console.log(results);
        let text = results.Blocks.map(item => item.Text)
        text = text.join("     ");
        this.setState({ loading: false, textract_res: text });
    }
    async selectedImage(event) {
        var file = event.target.files[0];
        var base64 = await this.filetoBase64(file);
        this.setState({ selected_image: base64 });
        // this.textract(base64);
    }
    closeCamera() {
        this.setState({ camera_visible: false });
        try {
            this.cameraStream.getTracks().forEach(function (track) { track.stop(); })
        } catch (error) {
            console.log("camera close error", error);
        }
    }
    takepicture() {
        const video = document.getElementById("camera_preview");
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL();
        this.setState({ selected_image: dataURL });
        // this.textract(dataURL);
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
        const { loading, camera_visible, choose_video_modal, selected_image, visible_signup } = this.state;
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
                <View style={styles.mainbody}>
                    <View style={styles.bannerButton}>
                        <TouchableOpacity style={styles.btn_white}>
                            <Text title2 bold>Your dashboard</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btn_white, {lineHeight: 14}]}>
                            <Text body2 bold>_ _<br/>_ _</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.bannerImages}>
                        <Image
                            source={{ uri: Images.heat }}
                            style={{ width: 90, height: 120 }}
                            resizeMode={'contain'}
                        />
                        <Image
                            source={{ uri: Images.heat }}
                            style={{ width: 90, height: 120 }}
                            resizeMode={'contain'}
                        />
                        <Image
                            source={{ uri: Images.heat }}
                            style={{ width: 90, height: 120 }}
                            resizeMode={'contain'}
                        />
                    </View>
                    <View style={styles.bannerTable}>
                        <View style={styles.sortwrap}>
                            <View style={styles.sorttitlewrap}>
                                <TouchableOpacity style={styles.btn_grey}>
                                    <Text title1>All slients</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.dashwrap}>
                                <Text title3 bold>Sort by</Text>
                            </View>
                            <View style={styles.contendwrap}>
                                <TouchableOpacity style={[styles.btn_grey, styles.btn_content]}>
                                    <Text title3>Date</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btn_grey, styles.btn_content]}>
                                    <Text title3>Patient ID</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btn_grey, styles.btn_content]}>
                                    <Text title3>Requested time</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btn_grey, styles.btn_content]}>
                                    <Text title3>Prescriptions</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btn_grey, styles.btn_content]}>
                                    <Text title3>Diagnostics</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btn_grey, styles.btn_content]}>
                                    <Text title3>Radiology</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btn_grey, styles.btn_content]}>
                                    <Text title3>Status</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{width: 10, height: "100%", backgroundColor: BaseColor.blackColor}}></View>
                        <View style={styles.contentBody}>
                            <View style={styles.searchWrap}>
                                <TextInput
                                    style={[styles.inputElement, styles.inputSearch]}
                                    value={"value"}
                                />
                                <Image source={Images.search_icon} style={{width: 40, height: 40}} />
                            </View>
                            <View style={{padding: 10,textAlign: "center"}}>
                                <TouchableOpacity style={[styles.btn_grey, styles.btn_title]}>
                                    <Text title3>Current location & address</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.tablecontent}>
                                <View style={styles.tableHeader}>
                                    <View style={styles.mainStateHeader}>
                                        <Text title3 style={styles.tableFirst}>Patient ID</Text>
                                        <Text title3 style={styles.tableSecond}>Report type</Text>
                                        <Text title3 style={styles.tableThree}>Patient info</Text>
                                        <Text title3 style={styles.tableFour}>Scheduled time</Text>
                                    </View>
                                    <View style={[styles.states, styles.statesHeader]}>
                                        <Text title3>States</Text>
                                    </View>
                                </View>
                                <View style={styles.tableBody}>
                                    <View style={styles.tableRow}>
                                        <View style={styles.mainStateBody}>
                                            <View style={styles.tableFirst}>
                                                <Text title3>ABC123XX</Text>
                                            </View>
                                            <View style={styles.tableSecond}>
                                                <Text title3>Diagnostics</Text>
                                            </View>
                                            <View style={[styles.tableThree, styles.flexRow]}>
                                                <View>
                                                    <Image source={Images.smile_icon} style={{width: 40, height: 40}} />
                                                </View>
                                                <View>
                                                    <Text title3>Ana Louise Frank</Text>
                                                    <Text body2>Click to expand ></Text>
                                                </View>
                                            </View>
                                            <View style={styles.tableFour}>
                                                <Text title3>DD:MM:YY | HH:MM</Text>
                                            </View>
                                        </View>
                                        <View style={[styles.states, styles.statesBody, styles.flexRow]}>
                                            <Image source={Images.unread_icon} style={{width: 40, height: 40}} />
                                            <Image source={Images.pending_icon} style={{width: 40, height: 40}} />
                                            <Image source={Images.complete_icon} style={{width: 35, height: 35}} />
                                        </View>
                                    </View>
                                    <View style={styles.tableRow}>
                                        <View style={styles.mainStateBody}>
                                            <View style={styles.tableFirst}>
                                                <Text title3>ABC123XX</Text>
                                            </View>
                                            <View style={styles.tableSecond}>
                                                <Text title3>Diagnostics</Text>
                                            </View>
                                            <View style={[styles.tableThree, styles.flexRow]}>
                                                <View>
                                                    <Image source={Images.smile_icon} style={{width: 40, height: 40}} />
                                                </View>
                                                <View>
                                                    <Text title3>Ana Louise Frank</Text>
                                                    <Text body2>Click to expand ></Text>
                                                </View>
                                            </View>
                                            <View style={styles.tableFour}>
                                                <Text title3>DD:MM:YY | HH:MM</Text>
                                            </View>
                                        </View>
                                        <View style={[styles.states, styles.statesBody, styles.flexRow]}>
                                            <Image source={Images.unread_icon} style={{width: 40, height: 40}} />
                                            <Image source={Images.pending_icon} style={{width: 40, height: 40}} />
                                            <Image source={Images.complete_icon} style={{width: 35, height: 35}} />
                                        </View>
                                    </View>
                                    <View style={styles.tableRow}>
                                        <View style={styles.mainStateBody}>
                                            <View style={styles.tableFirst}>
                                                <Text title3>ABC123XX</Text>
                                            </View>
                                            <View style={styles.tableSecond}>
                                                <Text title3>Diagnostics</Text>
                                            </View>
                                            <View style={[styles.tableThree, styles.flexRow]}>
                                                <View>
                                                    <Image source={Images.smile_icon} style={{width: 40, height: 40}} />
                                                </View>
                                                <View>
                                                    <Text title3>Ana Louise Frank</Text>
                                                    <Text body2>Click to expand ></Text>
                                                </View>
                                            </View>
                                            <View style={styles.tableFour}>
                                                <Text title3>DD:MM:YY | HH:MM</Text>
                                            </View>
                                        </View>
                                        <View style={[styles.states, styles.statesBody, styles.flexRow]}>
                                            <Image source={Images.unread_icon} style={{width: 40, height: 40}} />
                                            <Image source={Images.pending_icon} style={{width: 40, height: 40}} />
                                            <Image source={Images.complete_icon} style={{width: 35, height: 35}} />
                                        </View>
                                    </View>
                                    <View style={styles.tableRow}>
                                        <View style={styles.mainStateBody}>
                                            <View style={styles.tableFirst}>
                                                <Text title3>ABC123XX</Text>
                                            </View>
                                            <View style={styles.tableSecond}>
                                                <Text title3>Diagnostics</Text>
                                            </View>
                                            <View style={[styles.tableThree, styles.flexRow]}>
                                                <View>
                                                    <Image source={Images.smile_icon} style={{width: 40, height: 40}} />
                                                </View>
                                                <View>
                                                    <Text title3>Ana Louise Frank</Text>
                                                    <Text body2>Click to expand ></Text>
                                                </View>
                                            </View>
                                            <View style={styles.tableFour}>
                                                <Text title3>DD:MM:YY | HH:MM</Text>
                                            </View>
                                        </View>
                                        <View style={[styles.states, styles.statesBody, styles.flexRow]}>
                                            <Image source={Images.unread_icon} style={{width: 40, height: 40}} />
                                            <Image source={Images.pending_icon} style={{width: 40, height: 40}} />
                                            <Image source={Images.complete_icon} style={{width: 35, height: 35}} />
                                        </View>
                                    </View>
                                    
                                </View>
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
                    <View style={{ backgroundColor: BaseColor.whiteColor, opacity: 0.8, padding: 50 }}>
                        <Text header style={{ textAlign: "center" }}>What use heart inc instead?</Text>
                        <Text title2 style={styles.insteadText}>
                            What use heart inc instead?What use heart inc instead?What use heart inc instead? What use heart inc instead?   What use heart inc instead? What use heart inc instead?
                        </Text>
                    </View>
                </View>
                <View style={styles.bottom}>
                    <View style={{ flex: 1 }}>
                        <Text title3 style={{ lineHeight: 60 }}>Sign up for our newsletter</Text>
                        <View style={{ flex: 1, flexDirection: "row" }}>
                            <View style={{ backgroundColor: BaseColor.whiteColor, borderRadius: 10, height: 60, flex: 1 }} />
                            <View style={{ backgroundColor: BaseColor.whiteColor, borderRadius: 10, width: 50, height: 60, marginLeft: 20 }} />
                        </View>
                    </View>
                    <View style={{ flex: 2, flexDirection: "row", paddingLeft: 80 }}>
                        <View style={{ flex: 1 }}>
                            <Text title3 style={{ lineHeight: 60 }}>{"Company"}</Text>
                            <Text subhead>{"About us"}</Text>
                            <Text subhead>{"Terms"}</Text>
                            <Text subhead>{"Policy"}</Text>
                            <Text subhead>{"Pricing"}</Text>
                            <Text subhead>{"Contact us"}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text title3 style={{ lineHeight: 60 }}>{"Company"}</Text>
                            <Text subhead>{"About us"}</Text>
                            <Text subhead>{"Terms"}</Text>
                            <Text subhead>{"Policy"}</Text>
                            <Text subhead>{"Pricing"}</Text>
                            <Text subhead>{"Contact us"}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text title3 style={{ lineHeight: 60 }}>{"Company"}</Text>
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
                    <Text headline>(C) 2021 Heart Inc</Text>
                </View>
                <input type="file" ref={ref => this.fileInput = ref} style={{ display: "none" }} onChange={(e) => this.selectedImage(e)} />
                {loading &&
                    <View style={styles.loading}>
                        <ActivityIndicator
                            size="large"
                            color={BaseColor.blackColor}
                            style={{
                                transform: [{ scale: 1.4 }]
                            }}
                        />
                    </View>
                }
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={choose_video_modal}
                    ariaHideApp={false}
                // style={styles.modalUpload}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TouchableOpacity onPress={() => this.setState({ choose_video_modal: false })} style={styles.btn_close}><Text style={{ fontSize: 60, color: "#000", }}>×</Text></TouchableOpacity>
                            <View style={styles.modalTitle}>
                                <Text title1 style={styles.modalText}>Take a photo or upload a document</Text>
                            </View>
                            <View>
                                {selected_image &&
                                    <Image source={{ uri: selected_image }} resizeMode={'contain'} style={{ width: 800, height: 500 }} />
                                }
                            </View>
                            <View style={styles.modalBody}>
                                <TouchableOpacity onPress={this.selectImage.bind(this)} style={[styles.app_link, styles.modalButton]}>
                                    <Text title2 bold>Upload document</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.openCamera.bind(this)} style={[styles.app_link, styles.modalButton]}>
                                    <Text title2 bold>Take photo</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity onPress={this.textract.bind(this)} style={[styles.btn_modal, styles.btn_next]}>
                            <Text title1 style={styles.modalText}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={camera_visible}
                    ariaHideApp={false}
                >
                    <video id="camera_preview" width="100%" height="100%" style={{ backgroundColor: "black" }} autoPlay></video>
                    <TouchableOpacity onPress={this.closeCamera.bind(this)} style={styles.btn_close}><Text style={{ fontSize: 70, color: BaseColor.whiteColor, }}>×</Text></TouchableOpacity>
                    <TouchableOpacity onPress={this.takepicture.bind(this)} style={styles.btn_record}></TouchableOpacity>
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={visible_signup}
                    ariaHideApp={false}
                // style={styles.modalUpload}
                >
                    <View style={styles.centeredView}>
                        <View style={[styles.modalView, { backgroundColor: BaseColor.primaryColor }]}>
                            <View style={styles.modalTitle}>
                                <Text title1 style={styles.modalText}>Sign up as a user</Text>
                            </View>
                            <View style={[styles.modalBody, styles.modalSignBody]}>
                                <View style={styles.inputWrap}>
                                    <Text title3 style={{ lineHeight: 30 }}>First name</Text>
                                    <TextInput
                                        style={styles.inputElement}
                                        value={"value"}
                                    />
                                </View>
                                <View style={styles.inputWrap}>
                                    <Text title3 style={{ lineHeight: 30 }}>Last name</Text>
                                    <TextInput
                                        style={styles.inputElement}
                                        value={"value"}
                                    />
                                </View>
                                <View style={styles.inputWrap}>
                                    <Text title3 style={{ lineHeight: 30 }}>Email address</Text>
                                    <TextInput
                                        style={styles.inputElement}
                                        value={"value"}
                                    />
                                </View>
                                <View style={styles.inputWrap}>
                                    <Text title3 style={{ lineHeight: 30 }}>Age</Text>
                                    <TextInput
                                        style={styles.inputElement}
                                        value={"value"}
                                    />
                                </View>
                                <View style={styles.inputWrap}>
                                    <Text title3 style={{ lineHeight: 30 }}>Select plan</Text>
                                    <TextInput
                                        style={styles.inputElement}
                                        value={"value"}
                                    />
                                </View>
                                <View style={styles.inputWrap}>
                                    <Text title3 style={{ lineHeight: 30 }}>Mobile number</Text>
                                    <TextInput
                                        style={styles.inputElement}
                                        value={"value"}
                                    />
                                </View>
                                <View style={styles.inputWrap}>
                                    <Text title3 style={{ lineHeight: 30 }}>Password</Text>
                                    <TextInput
                                        style={styles.inputElement}
                                        value={"value"}
                                    />
                                </View>
                                <View style={styles.inputWrap}>
                                    <Text title3 style={{ lineHeight: 30 }}>Confirm password</Text>
                                    <TextInput
                                        style={styles.inputElement}
                                        value={"value"}
                                    />
                                </View>
                            </View>
                            <TouchableOpacity onPress={this.takepicture.bind(this)} style={[styles.btn_modal, styles.btn_sign]}>
                                <Text title1 style={styles.modalText}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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
        color: BaseColor.primaryTextColor
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
        borderRadius: 12,
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
        paddingVertical: 40,
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
        height: 30,
        borderRadius: 5
    },
    btn_modal: {
        backgroundColor: BaseColor.greenButtonColor,
        width: 200,
        height: 80,
        borderRadius: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    btn_next: {
        position: "absolute",
        bottom: 100,
        width: 200,
        height: 80,
        left: _WIDTH / 2 - 100,
    },
    btn_sigh: {
        border: `1px solid ${BaseColor.primaryTextColor}`
    },
    btn_close: {
        position: "absolute",
        top: 30,
        right: 40,
    },
    btn_record: {
        backgroundColor: BaseColor.redColor,
        position: "absolute",
        bottom: 100,
        width: 60,
        height: 60,
        borderRadius: "100%",
        left: _WIDTH / 2 - 30
    },
    modalBody: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        paddingVertical: 30
    },
    modalTitle: {
        width: "80%",
        borderStyle: "dashed",
        borderBottomWidth: 1,
        borderColor: BaseColor.grayColor,
        paddingVertical: 20
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        position: "relative"
    },
    modalView: {
        width: "50%",
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        border: "1px solid rgba(26,26,26,0.1)",
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 2
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        elevation: 5
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        textAlign: "center"
    },
    modalButton: {
        width: "20%",
        paddingVertical: 70,
        textAlign: "center",
        borderRadius: 20
    },
    inputWrap: {
        paddingVertical: 20
    },
    inputElement: {
        height: 60,
        borderColor: BaseColor.primaryTextColor,
        backgroundColor: BaseColor.whiteColor,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 20,
        fontSize: 18,
        fontFamily: 'OpenSansR'
    },
    modalSignBody: {
        flexWrap: "wrap",
        width: "60%"
    },
    mainbody: {
        backgroundColor: BaseColor.homePinkColor,
        padding: 20
    },
    btn_white: {
        paddingVertical: 20,
        paddingHorizontal: 30,
        backgroundColor: BaseColor.whiteColor,
        // border: "1px solid rgba(26,26,26,0.1)",
        borderRadius: 12,
    },
    btn_grey: {
        paddingVertical: 20,
        paddingHorizontal: 30,
        backgroundColor: BaseColor.lightButtonColor,
        // border: "1px solid rgba(26,26,26,0.1)",
        borderRadius: 12,
    },
    btn_content: {
        marginBottom: 5,
        paddingVertical: 15,
        paddingHorizontal: 30,
    },
    btn_title: {
        paddingVertical: 10,
        paddingHorizontal: 30,
    },
    bannerButton: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 50,
        zIndex: 10
    },
    bannerImages: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: -10,
    },
    bannerTable: {
        backgroundColor: BaseColor.whiteColor,
        display: "flex",
        flexDirection: "row",
        borderRadius: 50,
        padding: 30
    },
    dashwrap: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderStyle: "dashed",
        borderTopWidth: 2,
        borderBottomWidth: 2
    },
    contendwrap : {
        paddingHorizontal: 20,
        paddingVertical: 10,
        
    },
    sorttitlewrap: {
        padding: 20
    },
    sortwrap: {
        padding: 30,
        
    },
    searchWrap: {
        backgroundColor: BaseColor.lightButtonColor,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 10,
        paddingVertical: 5,
        paddingLeft: 50,
        paddingRight: 30,
        width: "100%"
    },
    contentBody: {
        paddingHorizontal: 40,
        flexGrow: 1,
    },
    inputSearch: {
        backgroundColor: BaseColor.transparent,
        borderColor: BaseColor.transparent
    },
    tablecontent: {
        flexGrow: 1,
    },
    tableHeader: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 30,
        textAlign: "center"
    },
    states: {
        width: "15%",
        marginLeft: 10
        
    },
    statesHeader: {
        paddingHorizontal: 5,
        paddingVertical: 10,
        backgroundColor: BaseColor.lightButtonColor,
        borderRadius: 10,
        
    },
    statesBody: {
        alignItems: "center"
    },
    tableBody: {
        
    },
    tableRow: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 40
    },
    mainStateHeader: {
        display: "flex",
        flexDirection: "row",
        flexGrow: 1,
        paddingHorizontal: 5,
        paddingVertical: 10,
        backgroundColor: BaseColor.lightButtonColor,
        borderRadius: 10,
    },
    mainStateBody: {
        flexGrow: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 5,
        paddingVertical: 30,
        backgroundColor: BaseColor.lightButtonColor,
        borderRadius: 10,
    },
    tableFirst: {
        width: "18%",
        fontSize: 18,
    },
    tableSecond: {
        width: "18%",
    },
    tableThree: {
        width: "35%",
    },
    tableFour: {
        width: "29%",
    },
    flexRow: {
        display: "flex",
        flexDirection: "row",
    }
});
