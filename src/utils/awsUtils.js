const _ = require("lodash");
import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import { BaseConfig } from "../Config";

AWS.config.update({
    accessKeyId: BaseConfig.awsAccesskeyID,
    secretAccessKey: BaseConfig.awsSecretAccessKey,
    region: BaseConfig.awsRegion,
});


const textract = new AWS.Textract();

AWS.events.on('send', function startSend(resp) {
    resp.startTime = new Date().getTime();
}).on('complete', function calculateTime(resp) {
    var time = (new Date().getTime() - resp.startTime) / 1000;
    console.log('Request took ' + time + ' seconds');
});

const getText = (result, blocksMap) => {
    let text = "";

    if (_.has(result, "Relationships")) {
        result.Relationships.forEach(relationship => {
            if (relationship.Type === "CHILD") {
                relationship.Ids.forEach(childId => {
                    const word = blocksMap[childId];
                    if (word.BlockType === "WORD") {
                        text += `${word.Text} `;
                    }
                    if (word.BlockType === "SELECTION_ELEMENT") {
                        if (word.SelectionStatus === "SELECTED") {
                            text += `X `;
                        }
                    }
                });
            }
        });
    }

    return text.trim();
};

const findValueBlock = (keyBlock, valueMap) => {
    let valueBlock;
    keyBlock.Relationships.forEach(relationship => {
        if (relationship.Type === "VALUE") {
            // eslint-disable-next-line array-callback-return
            relationship.Ids.every(valueId => {
                if (_.has(valueMap, valueId)) {
                    valueBlock = valueMap[valueId];
                    return false;
                }
            });
        }
    });

    return valueBlock;
};

const getKeyValueRelationship = (keyMap, valueMap, blockMap) => {
    const keyValues = {};

    const keyMapValues = _.values(keyMap);

    keyMapValues.forEach(keyMapValue => {
        const valueBlock = findValueBlock(keyMapValue, valueMap);
        const key = getText(keyMapValue, blockMap);
        const value = getText(valueBlock, blockMap);
        keyValues[key] = value;
    });

    return keyValues;
};

const getKeyValueMap = blocks => {
    const keyMap = {};
    const valueMap = {};
    const blockMap = {};

    let blockId;
    blocks.forEach(block => {
        blockId = block.Id;
        blockMap[blockId] = block;

        if (block.BlockType === "KEY_VALUE_SET") {
            if (_.includes(block.EntityTypes, "KEY")) {
                keyMap[blockId] = block;
            } else {
                valueMap[blockId] = block;
            }
        }
    });

    return { keyMap, valueMap, blockMap };
};
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

module.exports = async buffer => {//buffer base 64
    const params = {
        Document: {
            /* required */
            Bytes: _base64ToArrayBuffer(buffer)
        },
        FeatureTypes: ["FORMS"]
    };

    const request = textract.analyzeDocument(params);
    const data = await request.promise();
    console.log(data);

    if (data && data.Blocks) {
        const { keyMap, valueMap, blockMap } = getKeyValueMap(data.Blocks);
        const keyValues = getKeyValueRelationship(keyMap, valueMap, blockMap);

        return keyValues;
    }

    // in case no blocks are found return undefined
    return undefined;
};