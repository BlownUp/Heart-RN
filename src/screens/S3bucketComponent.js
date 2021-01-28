import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import S3bucket from "../utils/s3bucketUtils";

const S3bucketComponent = () => {
    const [bucketName, setBucketName] = useState("bucket");
    const [message, setMessage] = useState("");

    const createBucket = async () => {
        setMessage("");
        S3bucket.createBucket(bucketName)
            .then(res => {
                console.log(res);
                setMessage(`Bucket "${bucketName}" created.`);
            })
            .catch(console.log)
    };

    const deleteBucket = async () => {
        setMessage("");
        S3bucket.deleteBucket(bucketName)
            .then(res => {
                console.log(res);
                setMessage(`Bucket "${bucketName}" deleted.`);
            })
            .catch(console.log)
    };

    return (
        <View style={styles.container}>
            <Text style={{ color: "green" }}>
                {message || ''}
            </Text>
            <View>
                {/* <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => setBucketName(text)}
                    autoCapitalize={"none"}
                    value={bucketName}
                    placeholder={"Enter Bucket Name"}
                /> */}
                <Button
                    backroundColor="#68a0cf"
                    title="Create Bucket"
                    onPress={createBucket}
                />
                <Button
                    backroundColor="#68a0cf"
                    title="Delete Bucket"
                    onPress={deleteBucket}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});

export default S3bucketComponent;