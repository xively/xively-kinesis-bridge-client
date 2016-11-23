/// <reference path="../typings/index.d.ts"/>

import {BufferReader} from  './buffer-utils';
import {FIREHOSE_ENVELOPE} from './envelope-structure';
import * as uuid from 'uuid';
import {KinesisBridgeEnvelope} from './kinesis-bridge-envelope';

export class KinesisBridgeEnvelopeParser {

    /**
     * Parses a base64 encoded Kinesis Bridge envelope string payload
     * @param base64Data
     * @returns {*}
     */
    public parseData(base64Data: string): KinesisBridgeEnvelope {
        const reader = new BufferReader(new Buffer(base64Data, 'base64'));
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
}
