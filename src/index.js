/// <reference path="../typings/index.d.ts"/>
"use strict";
var buffer_utils_1 = require('./buffer-utils');
var envelope_structure_1 = require('./envelope-structure');
var uuid = require('node-uuid');
var kinesis_bridge_envelope_1 = require('./kinesis-bridge-envelope');
var KinesisBridgeEnvelopeParser = (function () {
    function KinesisBridgeEnvelopeParser() {
    }
    /**
     * Parses a base64 encoded Kinesis Bridge envelope string payload
     * @param base64Data
     * @returns {*}
     */
    KinesisBridgeEnvelopeParser.prototype.parseData = function (base64Data) {
        var reader = new buffer_utils_1.BufferReader(new Buffer(base64Data, 'base64'));
        // Empty object with public properties
        var envelope = new kinesis_bridge_envelope_1.KinesisBridgeEnvelope();
        envelope.headerVersion = reader.readIntLE(envelope_structure_1.FIREHOSE_ENVELOPE.HEADER_VERSION);
        envelope.timeUUID = uuid.unparse(reader.readBuffer(envelope_structure_1.FIREHOSE_ENVELOPE.TIME_UUID));
        envelope.sourceNameLength = reader.readMultibyteNumLE(envelope_structure_1.FIREHOSE_ENVELOPE.SOURCE_NAME_LENGTH);
        envelope.sourceName = reader.readString(envelope.sourceNameLength);
        envelope.sourcePropertiesLength = reader.readMultibyteNumLE(envelope_structure_1.FIREHOSE_ENVELOPE.SOURCE_PROPERTIES_LENGTH);
        var serializedSourceProperties = reader.readString(envelope.sourcePropertiesLength);
        if (serializedSourceProperties.length > 0) {
            envelope.sourceProperties = JSON.parse(serializedSourceProperties);
        }
        else {
            envelope.sourceProperties = {};
        }
        envelope.targetNameLength = reader.readMultibyteNumLE(envelope_structure_1.FIREHOSE_ENVELOPE.TARGET_NAME_LENGTH);
        envelope.targetName = reader.readString(envelope.targetNameLength);
        envelope.targetPropertiesLength = reader.readMultibyteNumLE(envelope_structure_1.FIREHOSE_ENVELOPE.TARGET_PROPERTIES_LENGTH);
        envelope.targetProperties = JSON.parse(reader.readString(envelope.targetPropertiesLength));
        envelope.contentLength = reader.readMultibyteNumLE(envelope_structure_1.FIREHOSE_ENVELOPE.CONTENT_LENGTH);
        envelope.contentBody = reader.readBuffer(envelope.contentLength);
        return envelope;
    };
    KinesisBridgeEnvelopeParser.prototype.encodeData = function (envelope) {
        var data = {
            sourceName: envelope.sourceName,
            sourceProperties: JSON.stringify(envelope.sourceProperties),
            targetName: envelope.targetName,
            targetProperties: JSON.stringify(envelope.targetProperties),
            contentBody: envelope.contentBody
        };
        // Loops through object and returns int of all values summed
        var lengthSize = Object.keys(envelope_structure_1.FIREHOSE_ENVELOPE).reduce(function (acc, current) { return (acc + envelope_structure_1.FIREHOSE_ENVELOPE[current]); }, 0);
        // Loops through object and returns int of all value string lengths summed
        var dataValuesSize = Object.keys(data).reduce(function (acc, current) { return (acc + (data[current] === '{}' ? 0 : data[current].length)); }, 0);
        // Creates buffer of the correct length
        var nodeBuffer = Buffer.alloc(lengthSize + dataValuesSize);
        var buffer = new buffer_utils_1.BufferWriter(nodeBuffer);
        // Wrapper function to write strings to buffer
        var writeString = function (str) {
            buffer.writeMultibyteNumLE(str.length, 2);
            buffer.writeString(str, str.length);
        };
        var writeJson = function (str) {
            if (str === '{}') {
                buffer.writeMultibyteNumLE(0, 2);
            }
            else {
                buffer.writeMultibyteNumLE(str.length, 2);
                buffer.writeString(str, str.length);
            }
        };
        buffer.writeIntLE(envelope.headerVersion, envelope_structure_1.FIREHOSE_ENVELOPE.HEADER_VERSION);
        var timeUUID = Buffer.alloc(envelope_structure_1.FIREHOSE_ENVELOPE.TIME_UUID);
        uuid.parse(envelope.timeUUID, timeUUID);
        buffer.copyFrom(timeUUID, envelope_structure_1.FIREHOSE_ENVELOPE.TIME_UUID);
        writeString(data.sourceName);
        writeJson(data.sourceProperties);
        writeString(data.targetName);
        writeJson(data.targetProperties);
        buffer.writeIntLE(envelope.contentBody.length, envelope_structure_1.FIREHOSE_ENVELOPE.CONTENT_LENGTH);
        buffer.copyFrom(envelope.contentBody, envelope.contentBody.length);
        return buffer.getBuffer().toString('base64');
    };
    return KinesisBridgeEnvelopeParser;
}());
exports.KinesisBridgeEnvelopeParser = KinesisBridgeEnvelopeParser;
