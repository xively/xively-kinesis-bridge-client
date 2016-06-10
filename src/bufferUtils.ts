const bufferProto = Buffer.prototype;
function writeIntLE(data: any, offset: number, size: number): number {
    if (size === 1) {
        return this.writeInt8(data, offset);
    }
    if (size === 2) {
        return this.writeInt16LE(data, offset);
    }
    throw new Error('Size not supported in this polyfill. Buffer.writeIntLE:' + size);
}

function readIntLE(offset: number, size: number): number {
    if (size === 1) {
        return this.readInt8(offset);
    }
    if (size === 2) {
        return this.readInt16LE(offset);
    }
    throw new Error('Size not supported in this polyfill, Buffer.readIntLE:' + size);
}

bufferProto.writeIntLE = bufferProto.writeIntLE || writeIntLE;
bufferProto.readIntLE = bufferProto.readIntLE || readIntLE;

/**
 * Read buffer with auto incremented offset
 * @param buffer
 * @constructor
 */
class BufferReader {
    private offset: number = 0;

    constructor(private buffer: Buffer) {
    }

    /**
     * Read int in Big-endian order from internal buffer
     * @param size
     * @returns {*}
     */
    public readIntLE(size: number): number {
        const data = this.buffer.readIntLE(this.offset, size);
        this.offset += size;
        return data;
    };

    public readMultibyteNumLE(size: number): number {
        let num: number;
        switch (size) {
            case 2:
                num = this.buffer.readUInt16LE(this.offset);
                break;
            case 4:
                num = this.buffer.readUInt32LE(this.offset);
                break;
            default:
                throw new Error(size + " is not supported as multibyte number");
        }
        this.offset += size;
        return num;
    };


    /**
     * Read size of data to a buffer from internal buffer
     * @param size
     * @returns {*}
     */
    public readBuffer(size: number): Buffer {
        const data = this.buffer.slice(this.offset, this.offset + size);
        this.offset += size;
        return data;
    };

    /**
     * Read size of string from buffer
     * @param size
     * @returns {*|string}
     */
    public readString(size: number): string {
        return this.readBuffer(size).toString('utf8');
    };
}

/**
 * Write buffer with auto incremented offset
 * @param buffer
 * @constructor
 */
export class BufferWriter {
    private offset: number = 0;

    constructor(private buffer: Buffer) {
    }

    /**
     * Write  int to buffer in Big-endian order
     * @param data
     * @param size
     */
    public writeIntLE(data: any, size: number) {
        this.buffer.writeIntLE(data, this.offset, size);
        this.offset += size;
    }


    public writeMultibyteNumLE(data: any, size: number) {
        switch (size) {
            case 2:
                this.buffer.writeUInt16LE(data, this.offset);
                break;
            case 4:
                this.buffer.writeUInt32LE(data, this.offset);
                break;
            default:
                throw new Error(size + " is not supported as multibyte number");
        }
        this.offset += size;
    };

    /**
     * Write string in utf8 format to the buffer
     * @param data
     * @param size
     */
    writeString(data: any, size: number) {
        this.buffer.write(data, this.offset, size, 'utf8');
        this.offset += size;
    };

    /**
     * Copy size of data from srcBuffer to the internal buffer
     * @param srcBuffer
     * @param size
     */
    copyFrom(srcBuffer: Buffer, size: number) {
        srcBuffer.copy(this.buffer, this.offset);
        this.offset += size;
    };

    /**
     * Get back internal buffer
     * @returns {*}
     */
    getBuffer(): Buffer {
        return this.buffer;
    };

}

module.exports = {
    BufferReader: BufferReader,
    BufferWriter: BufferWriter
};
