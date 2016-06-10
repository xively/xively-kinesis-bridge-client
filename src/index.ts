import {BufferReader} from  './bufferUtils';
import uuid from 'uuid';

'use strict';
var FIREHOSE_ENVELOPE = {
    HEADER_VERSION: 1,
    TIME_UUID: 16,
    SOURCE_NAME_LENGTH: 2,
    //SOURCE_NAME: String,
    SOURCE_PROPERTIES_LENGTH: 2,
    //SOURCE_PROPERTIES:JSON
    TARGET_NAME_LENGTH: 2,
    //TARGET_NAME: string,
    TARGET_PROPERTIES_LENGTH: 2,
    //TARGET_PROPERTIES: JSON
    CONTENT_LENGTH: 4
    //CONTENT_BODY: MQTT_PAYLOAD
};


console.log('Loading function');


function parseData(base64Data) {
    const reader = new BufferReader(new Buffer(base64Data, 'base64'));
    let envelope = {};
    envelope.headerVersion = reader.readIntBE(FIREHOSE_ENVELOPE.HEADER_VERSION);
    envelope.timeUUID = uuid.unparse(reader.readBuffer(FIREHOSE_ENVELOPE.TIME_UUID));
    envelope.sourceNameLength = reader.readMultibyteNumBE(FIREHOSE_ENVELOPE.SOURCE_NAME_LENGTH);
    envelope.sourceName = reader.readString(envelope.sourceNameLength);
    envelope.sourcePropertiesLength = reader.readMultibyteNumBE(FIREHOSE_ENVELOPE.SOURCE_PROPERTIES_LENGTH);
    envelope.sourceProperties = JSON.parse(reader.readString(envelope.sourcePropertiesLength));
    envelope.sourceNameLength = reader.readMultibyteNumBE(FIREHOSE_ENVELOPE.SOURCE_NAME_LENGTH);
    envelope.sourceName = reader.readString(envelope.sourceNameLength);
    envelope.targetPropertiesLength = reader.readMultibyteNumBE(FIREHOSE_ENVELOPE.TARGET_PROPERTIES_LENGTH);
    envelope.targetProperties = JSON.parse(reader.readString(envelope.targetPropertiesLength));
    envelope.contentLength = reader.readMultibyteNumBE(FIREHOSE_ENVELOPE.CONTENT_LENGTH);
    envelope.contentBody = reader.readString(envelope.contentLength);
    return envelope;
}

exports.handler = function (event, context, done) {
    let messages = event.Records && event.Records.map((event) => parseData(event.kinesis.data));
    console.log(JSON.stringify(messages, null, '  '));
    done(null, 'KINESIS LOGGED');
};
