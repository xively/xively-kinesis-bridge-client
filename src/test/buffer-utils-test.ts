import chai from 'chai';
import sinon from 'sinon';
// tslint:disable:import-name
import sinonChai from 'sinon-chai';
// tslint:enable:import-name
import * as bufferUtils from '../buffer-utils';
const expect = chai.expect;
chai.use(sinonChai);

describe('bufferUtils', () => {
    describe('BufferReader', () => {

        describe('readIntLE', () => {

            it('should have a readIntLE function', () => {
                const reader = new bufferUtils.BufferReader(new Buffer(10));
                expect(reader.readIntLE).to.be.a.function;
            });

            it('should call buffer a readIntLE with an incremented offset', () => {
                const buffer = {
                    readIntLE: sinon.spy()
                };
                const reader = new bufferUtils.BufferReader(buffer);
                const size = 12;
                const offset = 0;
                reader.readIntLE(size);
                expect(buffer.readIntLE).to.be.calledWith(offset, size);
                reader.readIntLE(size);
                expect(buffer.readIntLE).to.be.calledWith(offset, offset + size);
            });

            it('should return result of buffer readIntLE', () => {
                const bufferResult = 'result data';
                const buffer = {
                    readIntLE: sinon.stub().returns(bufferResult)
                };
                const reader = new bufferUtils.BufferReader(buffer);
                const result = reader.readIntLE(1);
                expect(result).to.be.equal(bufferResult);
            });

            it('should return number', () => {
                const buffer = new Buffer(1);
                buffer.fill(1);
                const reader = new bufferUtils.BufferReader(buffer);
                const result = reader.readIntLE(1);
                expect(result).to.be.a.number;
            });

        });

        describe('readMultibyteNumLE', () => {
            it('should read two byte number #1', () => {
                const buffer = new Buffer(2);
                buffer.fill(49, 0);
                buffer.fill(0, 1);
                const reader = new bufferUtils.BufferReader(buffer);
                const result = reader.readMultibyteNumLE(2);
                expect(result).to.be.a.number;
                expect(result).to.be.equal(49);
            });

            it('should read two byte number #2', () => {
                const buffer = new Buffer(2);
                buffer.fill(49, 0);
                buffer.fill(2, 1);
                const reader = new bufferUtils.BufferReader(buffer);
                const result = reader.readMultibyteNumLE(2);
                expect(result).to.be.a.number;
                expect(result).to.be.equal(561);
            });
        });

        describe('readBuffer', () => {

            it('should have a readIntLE function', () => {
                const reader = new bufferUtils.BufferReader(new Buffer(10));
                expect(reader.readBuffer).to.be.a.function;
            });

            it('should call buffer a slice with an incremented offset', () => {
                const buffer = {
                    slice: sinon.spy()
                };
                const reader = new bufferUtils.BufferReader(buffer);
                const size = 12;
                let offset = 0;
                reader.readBuffer(size);
                expect(buffer.slice).to.be.calledWith(offset, offset + size);
                offset += size;
                reader.readBuffer(size);
                expect(buffer.slice).to.be.calledWith(offset, offset + size);
            });

            it('should return result of buffer slice', () => {
                const bufferResult = 'result data';
                const buffer = {
                    slice: sinon.stub().returns(bufferResult)
                };
                const reader = new bufferUtils.BufferReader(buffer);
                const result = reader.readBuffer(1);
                expect(result).to.be.equal(bufferResult);
            });

            it('should return buffer', () => {
                const buffer = new Buffer(10);
                buffer.fill(1);
                const reader = new bufferUtils.BufferReader(buffer);
                const result = reader.readBuffer(1);
                expect(Buffer.isBuffer(result)).to.be.a.equal(true, 'Buffer instalce is expected.');
            });

        });

        describe('readString', () => {
            it('should have a readIntLE function', () => {
                const reader = new bufferUtils.BufferReader(new Buffer(10));
                expect(reader.readString).to.be.a.function;
            });

            it('should call buffer slice with an incremented offset', () => {
                const buffer = {
                    slice: sinon.stub().returns({
                        toString: sinon.stub().returns('data')
                    })
                };
                const reader = new bufferUtils.BufferReader(buffer);
                const size = 12;
                let offset = 0;
                reader.readString(size);
                expect(buffer.slice).to.be.calledWith(offset, offset + size);
                offset += size;
                reader.readString(size);
                expect(buffer.slice).to.be.calledWith(offset, offset + size);
            });

            it('should call toString on the readBuffer result', () => {
                const bufferResult = 'result data';
                const buffer = {
                    toString: sinon.stub().returns(bufferResult)
                };
                const reader = new bufferUtils.BufferReader({});
                reader.readBuffer = sinon.stub().returns(buffer);
                const result = reader.readString(1);
                expect(result).to.be.equal(bufferResult);
                expect(reader.readBuffer).to.have.been.calledWith(1);
            });

            it('should return string', () => {
                const buffer = new Buffer(10);
                buffer.fill(1);
                const reader = new bufferUtils.BufferReader(buffer);
                const result = reader.readString(1);
                expect(result).to.be.a.string;
            });
        });
    });

    describe('BufferWriter', () => {

        describe('writeIntLE', () => {

            it('should have a writeIntLE function', () => {
                const writer = new bufferUtils.BufferWriter(new Buffer(10));
                expect(writer.writeIntLE).to.be.a.function;
            });

            it('should call buffer writeIntLE with an incremented offset', () => {
                const buffer = {
                    writeIntLE: sinon.spy()
                };
                const writer = new bufferUtils.BufferWriter(buffer);
                const size = 12;
                const offset = 0;
                const data = 10;
                writer.writeIntLE(data, size);
                expect(buffer.writeIntLE).to.be.calledWith(data, offset, size);
                writer.writeIntLE(data, size);
                expect(buffer.writeIntLE).to.be.calledWith(data, offset + size, size);
            });

        });

        describe('writeMultibyteNumLE', () => {
            it('should call buffer writeInt16LE with an incremented offset', () => {
                const spy = sinon.spy();
                const buffer = {
                    writeUInt16LE: spy
                };
                const writer = new bufferUtils.BufferWriter(buffer);
                const size = 2;
                const offset = 0;
                const data = 561;
                writer.writeMultibyteNumLE(data, size);
                expect(spy).to.be.calledWith(data, offset);
                writer.writeMultibyteNumLE(data, size);
                expect(spy).to.be.calledWith(data, offset + size);
            });

            it('should call buffer writeInt32LE with an incremented offset', () => {
                const spy = sinon.spy();
                const buffer = {
                    writeUInt32LE: spy
                };
                const writer = new bufferUtils.BufferWriter(buffer);
                const size = 4;
                const offset = 0;
                const data = 123123;
                writer.writeMultibyteNumLE(data, size);
                expect(spy).to.be.calledWith(data, offset);
                writer.writeMultibyteNumLE(data, size);
                expect(spy).to.be.calledWith(data, offset + size);
            });

            it('should write so read can return value (16bit)', () => {
                const buffer = new Buffer(6);
                const writer = new bufferUtils.BufferWriter(buffer);
                const data = 561;
                writer.writeString('1234', 4);
                writer.writeMultibyteNumLE(data, 2);
                const buffer2 = new Buffer(buffer);
                const reader = new bufferUtils.BufferReader(buffer2);
                reader.readString(4);
                const res = reader.readMultibyteNumLE(2);
                expect(res).to.be.equal(data);
            });

            it('should write so read can return value (32bit)', () => {
                const buffer = new Buffer(8);
                const writer = new bufferUtils.BufferWriter(buffer);
                const data = 1222514;
                writer.writeString('1234', 4);
                writer.writeMultibyteNumLE(data, 4);
                const buffer2 = new Buffer(buffer);
                const reader = new bufferUtils.BufferReader(buffer2);
                reader.readString(4);
                const res = reader.readMultibyteNumLE(4);
                expect(res).to.be.equal(data);
            });
        });

        describe('writeString', () => {

            it('should have a writeString function', () => {
                const writer = new bufferUtils.BufferWriter(new Buffer(10));
                expect(writer.writeString).to.be.a.function;
            });

            it('should call buffer writeIntLE with an incremented offset', () => {
                const buffer = {
                    write: sinon.spy()
                };
                const writer = new bufferUtils.BufferWriter(buffer);
                const size = 12;
                const offset = 0;
                const data = 'data';
                writer.writeString(data, size);
                expect(buffer.write).to.be.calledWith(data, offset, size, 'utf8');
                writer.writeString(data, size);
                expect(buffer.write).to.be.calledWith(data, offset + size, size, 'utf8');
            });

        });

        describe('copyFrom', () => {

            it('should have a copyFrom function', () => {
                const writer = new bufferUtils.BufferWriter(new Buffer(10));
                expect(writer.copyFrom).to.be.a.function;
            });

            it('should call buffer writeIntLE with an incremented offset', () => {
                const buffer = {
                    write: sinon.spy()
                };

                const srcBuffer = {
                    copy: sinon.spy()
                };

                const writer = new bufferUtils.BufferWriter(buffer);
                const size = 12;
                const offset = 0;
                writer.copyFrom(srcBuffer, size);
                expect(srcBuffer.copy).to.be.calledWith(buffer, offset);
                writer.copyFrom(srcBuffer, size);
                expect(srcBuffer.copy).to.be.calledWith(buffer, offset + size);
            });

        });

        describe('getBuffer', () => {

            it('should have a getBuffer function', () => {
                const writer = new bufferUtils.BufferWriter(new Buffer(10));
                expect(writer.getBuffer).to.be.a.function;
            });

            it('should return a buffer', () => {
                const writer = new bufferUtils.BufferWriter(new Buffer(10));
                expect(Buffer.isBuffer(writer.getBuffer())).to.be.equal(true, 'Buffer instance is expected.');
            });

        });

    });

});
