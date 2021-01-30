
import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import { BaseConfig } from "../Config";

AWS.config.update({
    accessKeyId: BaseConfig.awsAccesskeyID,
    secretAccessKey: BaseConfig.awsSecretAccessKey,
    region: BaseConfig.awsRegion,
})

AWS.events
    .on('send', function startSend(resp) {
        resp.startTime = new Date().getTime();
    })
    .on('complete', function calculateTime(resp) {
        var time = (new Date().getTime() - resp.startTime) / 1000;
        console.log('Request took ' + time + ' seconds');
    });

const textract = new AWS.Textract();
const s3Bucket = new AWS.S3();
const dynamodb = new AWS.DynamoDB;

const _base64ToArrayBuffer = (base64) => {
    base64 = base64.replace("data:image/png;base64,", "");
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
};
const image2str = (buffer) => {
    const params = {
        Document: {
            /* required */
            Bytes: _base64ToArrayBuffer(buffer)
        },
        FeatureTypes: ["FORMS"]
    };

    const request = textract.analyzeDocument(params);
    return request.promise();
}
const createBucket = (Bucket) => {
    return new Promise((resolve, reject) => {
        s3Bucket.createBucket({ Bucket }, (err, data) => err ? reject(err) : resolve(data))
    })
};

const deleteBucket = (Bucket) => {
    return new Promise((resolve, reject) => {
        s3Bucket.deleteBucket({ Bucket }, (err, data) => err ? reject(err) : resolve(data))
    })
};
const uploadFile = (Bucket, name, fileContent, callback = (prog) => { console.log(`upload progress`, prog) }) => {
    const params = {
        Bucket,
        Key: name,
        Body: fileContent,
        ACL: 'public-read',

    };
    return new Promise((resolve, reject) => {
        s3Bucket.upload(params, (err, data) => err ? reject(err) : resolve(data))
            .on('httpUploadProgress', (progress) => {
                var uploaded = parseInt((progress.loaded * 100) / progress.total);
                callback(uploaded);
            })
    })
}
const deleteFile = (Bucket, name) => {
    const params = {
        Bucket,
        Key: name,
    };
    return new Promise((resolve, reject) => {
        s3Bucket.deleteObject(params, (err, data) => err ? reject(err) : resolve(data))
    })
}
const insert = (TableName, Item) => {
    return new Promise((resolve, reject) => {
        const param = {
            TableName,
            Item: {
                ...Item,
                id: { N: (new Date()).getTime() },
            },
        };
        dynamodb.putItem(param, (err, data) => err ? reject(err) : resolve(data))
    })
}
const checkauth = (email, password) => {
    return new Promise((resolve, reject) => {
        const param = {
            FilterExpression: "email = :email AND password = :password",
            ExpressionAttributeValues: {
                ":email": { S: email },
                ":password": { S: password },
            },
            TableName: BaseConfig.TBL_NAME.user,
        };
        dynamodb.scan(param, (err, data) => err ? reject(err) : resolve(data))
    })
}
const S3 = {
    createBucket,
    deleteBucket,
    uploadFile,
    deleteFile,
}
const DB = {
    insert,
    checkauth,
};
module.exports = {
    textract: image2str,
    s3Bucket: S3,
    dynamodb: DB,
};