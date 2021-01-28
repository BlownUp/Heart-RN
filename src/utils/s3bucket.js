import S3Client from 'aws-sdk/clients/s3';

import CognitoIdentityClient from "aws-sdk/clients/cognitoidentity";
import fromCognitoIdentityPool from "aws-sdk/clients/cognitoidentityserviceprovider";
import { BaseConfig } from "../Config";

const client = new S3Client({
    region: BaseConfig.awsRegion,
    credentials: new fromCognitoIdentityPool({
        client: new CognitoIdentityClient({ region: BaseConfig.awsRegion }),
        identityPoolId: "us-east-2:1a3cbc1a-9866-4440-ab3e-e13bea4d7a44",
    }),
});

client.config.update({
    accessKeyId: BaseConfig.awsAccesskeyID,
    secretAccessKey: BaseConfig.awsSecretAccessKey,
    region: BaseConfig.awsRegion,
});

// console.log("list");
// client.listBuckets(res => console.log("buckets", res));
// client.listObjects({ Bucket: BaseConfig.buckets.diagnostic }, (res) => console.log(res));

const createBucket = (Bucket) => {
    return new Promise((resolve, reject) => {
        client.createBucket({ Bucket }, (err, data) => err ? reject(err) : resolve(data))
    })
};

const deleteBucket = (Bucket) => {
    return new Promise((resolve, reject) => {
        client.deleteBucket({ Bucket }, (err, data) => err ? reject(err) : resolve(data))
    })
};
const uploadFile = (Bucket, name, fileContent, progress = (prog) => { console.log(`upload progress ${prog}`) }) => {
    const params = {
        Bucket,
        Key: name,
        Body: fileContent
    };
    return new Promise((resolve, reject) => {
        client.upload(params, (err, data) => err ? reject(err) : resolve(data)).on('httpUploadProgress', progress)
    })
}
const deleteFile = (Bucket, name) => {
    const params = {
        Bucket,
        Key: name,
    };
    return new Promise((resolve, reject) => {
        client.deleteObject(params, (err, data) => err ? reject(err) : resolve(data))
    })
}

module.exports = {
    createBucket,
    deleteBucket,
    uploadFile,
    deleteFile,
};