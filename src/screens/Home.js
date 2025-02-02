import React, { Component } from "react";
import { View, ActivityIndicator, StyleSheet, Dimensions, ImageBackground, TouchableOpacity, ScrollView } from "react-native";
import { Header, Text, Review } from "../Components";
import { BaseColor, Images, BaseConfig } from "../Config";
import { Image, Avatar } from "react-native-elements";
import { textract, s3Bucket, dynamodb } from '../utils/awsUtils';
import Modal from 'modal-react-native-web';
const _HEIGHT = Dimensions.get("window").height;
const _WIDTH = Dimensions.get("window").width;

const TextInput = (props) => (
    <input type={props?.keyboardType == "numeric" ? "number" : props.secureTextEntry ? "password" : "text"} style={StyleSheet.flatten(props.style)} value={props.value} onChange={(e) => props.onChangeText(e.target.value)} />
)

export default class Home extends Component {
    constructor(props) {
        super(props);
        let auth = {
            logged: false,
            user: []
        };
        try {
            let tmp_auth = localStorage.getItem("auth");
            tmp_auth = JSON.parse(tmp_auth);
            if (tmp_auth.logged) {
                auth = tmp_auth;
            }
        } catch (err) { }
        this.state = {
            visible_modals: {
                camera: false,
                select_image: false,
                signin: false,
                signup: false,
            },
            auth,
            signup: {},
            signin: {
                email: "",
                password: "",
            },
            loading: false,
            selected_image: null
        }
        this.imagetype = BaseConfig.buckets.radiology;  //diagnostic, prescription
        this.cameraStream = null;
    }
    initSignup() {
        this.setState({
            signup: {
                avatar: "",
                firstname: "",
                lastname: "",
                email: "",
                age: "",
                phonenumber: "",
                plan: "",
                password: "",
                confirmpwd: "",
                uploading: false,
                upload_pro: 0
            }
        });
    }
    componentDidMount() {
        this.initSignup();
    }
    setModalVisible(item) {
        this.setState({
            visible_modals: {
                ...this.state.visible_modals,
                ...item
            }
        })
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
        this.setModalVisible({ camera: true });
    }
    async textract() {
        const { selected_image } = this.state;
        if (!selected_image) {
            alert("Please take or upload photo");
            return;
        }
        this.setState({ loading: true });
        console.log("results");
        const results = await textract(selected_image);
        console.log(results);
        let text = results.Blocks.map(item => item.Text)
        text = text.join("     ");
        this.setState({ loading: false, textract_res: text });
    }
    async selectedImage(event) {
        var file = event.target.files[0];
        if (this.state.visible_modals.signup) {
            this.setSignUpState({ uploading: true })
            const res = await s3Bucket.uploadFile(BaseConfig.buckets.avatar, `heart_${new Date().getTime()}${file.name}`, file, upload_pro => this.setSignUpState({ upload_pro }))
                .catch(err => {
                    this.setSignUpState({ avatar: null })
                    console.log("err", err);
                });
            console.log(res.Location);
            this.setSignUpState({ avatar: res.Location, uploading: false })
        } else {
            var base64 = await this.filetoBase64(file);
            this.setState({ selected_image: base64 });
        }
    }
    closeCamera() {
        this.setModalVisible({ camera: false });
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
    setSignInState(item) {
        this.setState({
            signin: {
                ...this.state.signin,
                ...item
            }
        })
    }
    setSignUpState(item) {
        this.setState({
            signup: {
                ...this.state.signup,
                ...item
            }
        })
    }
    signin() {
        const { signin: { email, password } } = this.state;
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!reg.test(email)) {
            alert("input the valid email");
            return;
        }
        if (!password) {
            alert("input your password");
            return;
        }
        dynamodb.checkauth(email, password)
            .then(res => {
                if (res.Count > 0) {
                    alert("successfully logged");
                    const auth = {
                        logged: true,
                        user: res.Items[0]
                    }
                    localStorage.setItem("auth", JSON.stringify(auth));
                    this.setState({ auth });
                    this.setModalVisible({ signin: false, signup: false });
                } else {
                    throw new Error("err?");
                }
            })
            .catch(err => alert("Login failed, Wrong email and password!"));
    }
    async signup() {
        const { signup: { firstname, lastname, email, avatar, age, phonenumber, plan, password, confirmpwd } } = this.state;
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!firstname || !lastname || !reg.test(email) || !age || !phonenumber || !password || password != confirmpwd) {
            alert(!reg.test(email) ? "Please input the valid email." : password != confirmpwd ? "Invalid confirm password" : "Please input the valid field.");
            return;
        }
        this.setState({ loading: true });
        const data = {
            firstname: { S: firstname },
            lastname: { S: lastname },
            email: { S: email },
            password: { S: password },
            phonenumber: { S: phonenumber },
            avatar: { S: avatar },
            age: { N: age },
        };
        dynamodb.insert(BaseConfig.TBL_NAME.user, data)
            .then(res => {
                console.log(res);
                alert("Successfully signup");
                this.initSignup();
                this.setModalVisible({ signup: false });
            })
            .catch(err => console.log(err))
            .finally(() => this.setState({ loading: false }));
    }
    render() {
        const { loading, selected_image, visible_modals, signin, signup, auth } = this.state;
        return (
            <ScrollView style={styles.container} ref={(view) => {
                this.scrollView = view;
            }}>
                <Header
                    onLogin={() => this.setModalVisible({ signin: true })} auth={auth}
                    onLogout={() => {
                        this.setState({ auth: {} });
                        localStorage.setItem("auth", "");
                    }}
                />
                <ImageBackground source={{ uri: Images.back }} resizeMode={'cover'} style={styles.topbanner}>
                    <View style={[{ flex: 1 }, styles.center]}>
                        <Text large1 black style={{ textAlign: "center" }}>Ditch the <Text whiteColor>pa</Text>perwork</Text>
                        <Text large2 bold style={{ textAlign: "center" }}>Submit health fo<Text whiteColor>rms in </Text>60 seconds or less</Text>
                    </View>
                    <View style={[styles.tools, { flexDirection: "row" }]}>
                        {/* <View style={[{ flex: 1 }, styles.center]}>
                            <TouchableOpacity style={styles.app_link}>
                                <Text title2 bold>Download app</Text>
                            </TouchableOpacity>
                        </View> */}
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
                        <TouchableOpacity onPress={() => this.setModalVisible({ select_image: true })} style={[styles.center, styles.actions]}>
                            <View style={[styles.tool_image_back, styles.center]}>
                                <Image source={Images.take_picture} style={styles.tool_image} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text title3>Take a photo or upload</Text>
                                <Text body1>some description.</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={[styles.center, styles.actions]}>
                            <View style={[styles.tool_image_back, styles.center]}>
                                <Image source={Images.pick_time} style={styles.tool_image} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text title3>You pick a time</Text>
                                <Text body1>some description</Text>
                            </View>
                        </View>
                        <View style={[styles.center, styles.actions]}>
                            <View style={[styles.tool_image_back, styles.center]}>
                                <Image source={Images.provider} style={styles.tool_image} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text title3>You're connected with a provider</Text>
                                <Text body1>some description</Text>
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
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={visible_modals.signup || visible_modals.signin}
                    ariaHideApp={false}
                >
                    <View style={styles.centeredView}>
                        <View style={[styles.modalView, { backgroundColor: BaseColor.primaryColor }]}>
                            <TouchableOpacity onPress={() => this.setModalVisible({ signup: false, signin: false })} style={[styles.btn_close, { top: 0, right: 30 }]}><Text style={{ fontSize: 60, color: "#000", }}>×</Text></TouchableOpacity>
                            {visible_modals.signup &&
                                <>
                                    <View style={styles.modalTitle}>
                                        <Text title1 style={styles.modalText}>Sign up as a user</Text>
                                    </View>
                                    <TouchableOpacity onPress={this.selectImage.bind(this)} style={{ marginTop: 20, borderColor: BaseColor.grayColor, borderWidth: 2, borderRadius: 9999 }}>
                                        <Avatar
                                            source={{ uri: signup.uploading ? "" : signup.avatar }}
                                            rounded
                                            title={signup.uploading ? `${signup.upload_pro}% ↑↑` : "avatar"}
                                            titleStyle={{ fontSize: 20 }}
                                            size={'large'} />
                                    </TouchableOpacity>
                                    <View style={[styles.modalBody, styles.modalSignBody]}>
                                        <View style={styles.inputWrap}>
                                            <Text title3 style={{ lineHeight: 30 }}>First name</Text>
                                            <TextInput
                                                style={styles.inputElement}
                                                value={signup.firstname}
                                                onChangeText={(firstname) => this.setSignUpState({ firstname })}
                                            />
                                        </View>
                                        <View style={styles.inputWrap}>
                                            <Text title3 style={{ lineHeight: 30 }}>Last name</Text>
                                            <TextInput
                                                style={styles.inputElement}
                                                value={signup.lastname}
                                                onChangeText={(lastname) => this.setSignUpState({ lastname })}
                                            />
                                        </View>
                                        <View style={styles.inputWrap}>
                                            <Text title3 style={{ lineHeight: 30 }}>Email address</Text>
                                            <TextInput
                                                style={styles.inputElement}
                                                value={signup.email}
                                                onChangeText={(email) => this.setSignUpState({ email })}
                                            />
                                        </View>
                                        <View style={styles.inputWrap}>
                                            <Text title3 style={{ lineHeight: 30 }}>Age</Text>
                                            <TextInput
                                                style={styles.inputElement}
                                                value={signup.age}
                                                keyboardType={'numeric'}
                                                onChangeText={(age) => this.setSignUpState({ age })}
                                            />
                                        </View>
                                        <View style={styles.inputWrap}>
                                            <Text title3 style={{ lineHeight: 30 }}>Select plan</Text>
                                            <TextInput
                                                style={styles.inputElement}
                                                value={signup.plan}
                                                onChangeText={(plan) => this.setSignUpState({ plan })}
                                            />
                                        </View>
                                        <View style={styles.inputWrap}>
                                            <Text title3 style={{ lineHeight: 30 }}>Mobile number</Text>
                                            <TextInput
                                                style={styles.inputElement}
                                                value={signup.phonenumber}
                                                onChangeText={(phonenumber) => this.setSignUpState({ phonenumber })}
                                            />
                                        </View>
                                        <View style={styles.inputWrap}>
                                            <Text title3 style={{ lineHeight: 30 }}>Password</Text>
                                            <TextInput
                                                style={styles.inputElement}
                                                secureTextEntry
                                                value={signup.password}
                                                onChangeText={(password) => this.setSignUpState({ password })}
                                            />
                                        </View>
                                        <View style={styles.inputWrap}>
                                            <Text title3 style={{ lineHeight: 30 }}>Confirm password</Text>
                                            <TextInput
                                                style={styles.inputElement}
                                                value={signup.confirmpwd}
                                                secureTextEntry
                                                onChangeText={(confirmpwd) => this.setSignUpState({ confirmpwd })}
                                            />
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={this.signup.bind(this)} style={[styles.btn_modal, styles.btn_sign]}>
                                        <Text title1 style={styles.modalText}>Sign Up</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.setModalVisible({ signup: false, signin: true })} style={{ marginTop: 10 }}>
                                        <Text title3>Sign In</Text>
                                    </TouchableOpacity>
                                </>
                            }
                            {visible_modals.signin &&
                                <>
                                    <View style={styles.modalTitle}>
                                        <Text title1 style={styles.modalText}>Sign In as a user</Text>
                                    </View>
                                    <View style={[styles.modalBody, styles.modalSignBody, { flexDirection: "column" }]}>
                                        <View style={styles.inputWrap}>
                                            <Text title3 style={{ lineHeight: 30 }}>Email</Text>
                                            <TextInput
                                                style={styles.inputElement}
                                                placeholder={"input your email"}
                                                value={signin.email}
                                                onChangeText={(email) => this.setSignInState({ email })}
                                            />
                                        </View>
                                        <View style={styles.inputWrap}>
                                            <Text title3 style={{ lineHeight: 30 }}>Password</Text>
                                            <TextInput
                                                style={styles.inputElement}
                                                secureTextEntry
                                                placeholder={"input your password"}
                                                value={signin.password}
                                                onChangeText={(password) => this.setSignInState({ password })}
                                            />
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={this.signin.bind(this)} style={[styles.btn_modal, styles.btn_sign]}>
                                        <Text title1 style={styles.modalText}>Sign In</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.setModalVisible({ signup: true, signin: false })} style={{ marginTop: 10 }}>
                                        <Text title3>Sign Up</Text>
                                    </TouchableOpacity>
                                </>
                            }
                        </View>
                    </View>
                </Modal>

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={visible_modals.select_image}
                    ariaHideApp={false}
                // style={styles.modalUpload}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TouchableOpacity onPress={() => this.setModalVisible({ select_image: false })} style={styles.btn_close}><Text style={{ fontSize: 60, color: "#000", }}>×</Text></TouchableOpacity>
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
                    visible={visible_modals.camera}
                    ariaHideApp={false}
                >
                    <video id="camera_preview" width="100%" height="100%" style={{ backgroundColor: "black" }} autoPlay></video>
                    <TouchableOpacity onPress={this.closeCamera.bind(this)} style={styles.btn_close}><Text style={{ fontSize: 70, color: BaseColor.whiteColor, }}>×</Text></TouchableOpacity>
                    <TouchableOpacity onPress={this.takepicture.bind(this)} style={styles.btn_record}></TouchableOpacity>
                </Modal>
                <input type="file" accept="image/*" ref={ref => this.fileInput = ref} style={{ display: "none" }} onChange={(e) => this.selectedImage(e)} />
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
        width: 180,
        height: 60,
        marginTop: 20,
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
    },
    modalTitle: {
        width: "80%",
        borderStyle: "dashed",
        borderBottomWidth: 1,
        borderColor: BaseColor.grayColor,
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
        paddingVertical: 40,
        textAlign: "center",
        borderRadius: 20
    },
    inputWrap: {
        paddingVertical: 10
    },
    inputElement: {
        height: 50,
        borderColor: BaseColor.primaryTextColor,
        backgroundColor: BaseColor.whiteColor,
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 18,
        fontFamily: 'OpenSansR'
    },
    modalSignBody: {
        flexWrap: "wrap",
        width: "60%"
    }
});
