"use strict";
var bufferProto = Buffer.prototype;
/* tslint:disable:no-invalid-this */
function writeIntLE(data, offset, size) {
    if (size === 1) {
        return this.writeInt8(data, offset);
    }
    if (size === 2) {
        return this.writeInt16LE(data, offset);
    }
    throw new Error('Size not supported in this polyfill. Buffer.writeIntLE:' + size);
}
function readIntLE(offset, size) {
    if (size === 1) {
        return this.readInt8(offset);
    }
    if (size === 2) {
        return this.readInt16LE(offset);
    }
    throw new Error('Size not supported in this polyfill, Buffer.readIntLE:' + size);
}
/* tslint:enable:no-invalid-this */
bufferProto.writeIntLE = bufferProto.writeIntLE || writeIntLE;
bufferProto.readIntLE = bufferProto.readIntLE || readIntLE;
/**
 * Read buffer with auto incremented offset
 * @param buffer
 * @constructor
 */
var BufferReader = (function () {
    function BufferReader(buffer) {
        this.offset = 0;
        this.buffer = buffer;
    }
    /**
     * Read int in Big-endian order from internal buffer
     * @param size
     * @returns {*}
     */
    BufferReader.prototype.readIntLE = function (size) {
        var data = this.buffer.readIntLE(this.offset, size);
        this.offset += size;
        return data;
    };
    ;
    BufferReader.prototype.readMultibyteNumLE = function (size) {
        var num;
        switch (size) {
            case 2:
                num = this.buffer.readUInt16LE(this.offset);
                break;
            case 4:
                num = this.buffer.readUInt32LE(this.offset);
                break;
            default:
                throw new Error(size + ' is not supported as multibyte number');
        }
        this.offset += size;
        return num;
    };
    ;
    /**
     * Read size of data to a buffer from internal buffer
     * @param size
     * @returns {*}
     */
    BufferReader.prototype.readBuffer = function (size) {
        var data = this.buffer.slice(this.offset, this.offset + size);
        this.offset += size;
        return data;
    };
    ;
    /**
     * Read size of string from buffer
     * @param size
     * @returns {*|string}
     */
    BufferReader.prototype.readString = function (size) {
        return this.readBuffer(size).toString('utf8');
    };
    ;
    return BufferReader;
}());
exports.BufferReader = BufferReader;
/**
 * Write buffer with auto incremented offset
 * @param buffer
 * @constructor
 */
var BufferWriter = (function () {
    function BufferWriter(buffer) {
        this.offset = 0;
        this.buffer = buffer;
    }
    ;
    /**
     * Write  int to buffer in Big-endian order
     * @param data
     * @param size
     */
    BufferWriter.prototype.writeIntLE = function (data, size) {
        this.buffer.writeIntLE(data, this.offset, size);
        this.offset += size;
    };
    ;
    BufferWriter.prototype.writeMultibyteNumLE = function (data, size) {
        switch (size) {
            case 2:
                this.buffer.writeUInt16LE(data, this.offset);
                break;
            case 4:
                this.buffer.writeUInt32LE(data, this.offset);
                break;
            default:
                throw new Error(size + ' is not supported as multibyte number');
        }
        this.offset += size;
    };
    ;
    /**
     * Write string in utf8 format to the buffer
     * @param data
     * @param size
     */
    BufferWriter.prototype.writeString = function (data, size) {
        this.buffer.write(data, this.offset, size, 'utf8');
        this.offset += size;
    };
    ;
    /**
     * Copy size of data from srcBuffer to the internal buffer
     * @param srcBuffer
     * @param size
     */
    BufferWriter.prototype.copyFrom = function (srcBuffer, size) {
        srcBuffer.copy(this.buffer, this.offset);
        this.offset += size;
    };
    ;
    /**
     * Get back internal buffer
     * @returns {*}
     */
    BufferWriter.prototype.getBuffer = function () {
        return this.buffer;
    };
    ;
    return BufferWriter;
}());
exports.BufferWriter = BufferWriter;
