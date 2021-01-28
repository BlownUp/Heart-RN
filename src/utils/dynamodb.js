import dynamodb from 'aws-sdk/clients/dynamodb';
import { BaseConfig } from "../Config";
// Heart
const db = new dynamodb();
db.config.update({
    accessKeyId: BaseConfig.awsAccesskeyID,
    secretAccessKey: BaseConfig.awsSecretAccessKey,
    region: BaseConfig.awsRegion,
});
// db.createTable({TableName:""}, res => console.log(res));
const param = {
    TableName: "Heart",
    Item: { name: { S: "test name" } }
};
db.putItem(param, res => {
    console.log("put res", res);
});
console.log(db);