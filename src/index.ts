/// <reference path="../typings/index.d.ts"/>

import { BufferReader, BufferWriter } from  './buffer-utils';
import { FIREHOSE_ENVELOPE } from './envelope-structure';
import * as uuid from 'node-uuid';
import { KinesisBridgeEnvelope } from './kinesis-bridge-envelope';

export class KinesisBridgeEnvelopeParser {

    /**
     * Parses a base64 encoded Kinesis Bridge envelope string payload
     * @param base64Data
     * @returns {*}
     */
    public parseData(base64Data: string): KinesisBridgeEnvelope {
        const reader = new BufferReader(new Buffer(base64Data, 'base64'));

        // Empty object with public properties
        const envelope = new KinesisBridgeEnvelope();

        envelope.headerVersion = reader.readIntLE(FIREHOSE_ENVELOPE.HEADER_VERSION);
        envelope.timeUUID = uuid.unparse(reader.readBuffer(FIREHOSE_ENVELOPE.TIME_UUID));

        envelope.sourceNameLength = reader.readMultibyteNumLE(FIREHOSE_ENVELOPE.SOURCE_NAME_LENGTH);
        envelope.sourceName = reader.readString(envelope.sourceNameLength);

        envelope.sourcePropertiesLength = reader.readMultibyteNumLE(FIREHOSE_ENVELOPE.SOURCE_PROPERTIES_LENGTH);

        const serializedSourceProperties = reader.readString(envelope.sourcePropertiesLength);
        if (serializedSourceProperties.length > 0) {
            envelope.sourceProperties = JSON.parse(serializedSourceProperties);
        } else {
            envelope.sourceProperties = {};
        }

        envelope.targetNameLength = reader.readMultibyteNumLE(FIREHOSE_ENVELOPE.TARGET_NAME_LENGTH);
        envelope.targetName = reader.readString(envelope.targetNameLength);

        envelope.targetPropertiesLength = reader.readMultibyteNumLE(FIREHOSE_ENVELOPE.TARGET_PROPERTIES_LENGTH);
        envelope.targetProperties = JSON.parse(reader.readString(envelope.targetPropertiesLength));

        envelope.contentLength = reader.readMultibyteNumLE(FIREHOSE_ENVELOPE.CONTENT_LENGTH);
        envelope.contentBody = reader.readBuffer(envelope.contentLength);

        return envelope;
    }

    public encodeData(envelope: KinesisBridgeEnvelope): string {
        const data = {
            sourceName: envelope.sourceName,
            sourceProperties: JSON.stringify(envelope.sourceProperties),
            targetName: envelope.targetName,
            targetProperties: JSON.stringify(envelope.targetProperties),
            contentBody: envelope.contentBody
        };

        // Loops through object and returns int of all values summed
        const lengthSize = Object.keys(FIREHOSE_ENVELOPE).reduce((acc, current) => (acc + FIREHOSE_ENVELOPE[current]), 0);

        // Loops through object and returns int of all value string lengths summed
        const dataValuesSize = Object.keys(data).reduce((acc, current) => (acc + (data[current] === '{}' ? 0 : data[current].length)) , 0);

        // Creates buffer of the correct length
        const nodeBuffer = Buffer.alloc(lengthSize + dataValuesSize);
        const buffer = new BufferWriter(nodeBuffer);

        // Wrapper function to write strings to buffer
        const writeString = (str) => {
            buffer.writeMultibyteNumLE(str.length, 2);
            buffer.writeString(str, str.length);
        };

        const writeJson = (str) => {
            if (str === '{}') {
                buffer.writeMultibyteNumLE(0, 2);
            } else {
                buffer.writeMultibyteNumLE(str.length, 2);
                buffer.writeString(str, str.length);
            }
        };

        buffer.writeIntLE(envelope.headerVersion, FIREHOSE_ENVELOPE.HEADER_VERSION);

        const timeUUID = Buffer.alloc(FIREHOSE_ENVELOPE.TIME_UUID);
        uuid.parse(envelope.timeUUID, timeUUID);

        buffer.copyFrom(timeUUID, FIREHOSE_ENVELOPE.TIME_UUID);

        writeString(data.sourceName);
        writeJson(data.sourceProperties);
        writeString(data.targetName);
        writeJson(data.targetProperties);

        buffer.writeIntLE(envelope.contentBody.length, FIREHOSE_ENVELOPE.CONTENT_LENGTH);
        buffer.copyFrom(envelope.contentBody, envelope.contentBody.length);

        return buffer.getBuffer().toString('base64');
    }

}
