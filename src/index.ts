import {BufferReader} from  './bufferUtils';
import {FIREHOSE_ENVELOPE} from './envelopeStructure';
import {uuid} from 'uuid';
import {KinesisBridgeEnvelope} from './KinesisBridgeEnvelope';

function parseData(base64Data: string): KinesisBridgeEnvelope {
    const reader = new BufferReader(new Buffer(base64Data, 'base64'));
    const envelope = new KinesisBridgeEnvelope();
    envelope.headerVersion = reader.readIntLE(FIREHOSE_ENVELOPE.HEADER_VERSION);
    envelope.timeUUID = uuid.unparse(reader.readBuffer(FIREHOSE_ENVELOPE.TIME_UUID));
    envelope.sourceNameLength = reader.readMultibyteNumLE(FIREHOSE_ENVELOPE.SOURCE_NAME_LENGTH);
    envelope.sourceName = reader.readString(envelope.sourceNameLength);
    envelope.sourcePropertiesLength = reader.readMultibyteNumLE(FIREHOSE_ENVELOPE.SOURCE_PROPERTIES_LENGTH);
    envelope.sourceProperties = JSON.parse(reader.readString(envelope.sourcePropertiesLength));
    envelope.sourceNameLength = reader.readMultibyteNumLE(FIREHOSE_ENVELOPE.SOURCE_NAME_LENGTH);
    envelope.targetName = reader.readString(envelope.sourceNameLength);
    envelope.targetPropertiesLength = reader.readMultibyteNumLE(FIREHOSE_ENVELOPE.TARGET_PROPERTIES_LENGTH);
    envelope.targetProperties = JSON.parse(reader.readString(envelope.targetPropertiesLength));
    envelope.contentLength = reader.readMultibyteNumLE(FIREHOSE_ENVELOPE.CONTENT_LENGTH);
    envelope.contentBody = reader.readBuffer(envelope.contentLength);
    return envelope;
}

/*
exports.handler = function (event, context, done) {
    let messages = event.Records && event.Records.map((event) => parseData(event.kinesis.data));
    console.log(JSON.stringify(messages, null, '  '));
    done(null, 'KINESIS LOGGED');
};
*
