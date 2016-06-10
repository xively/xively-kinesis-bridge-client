'use strict';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import * as bufferUtils from '../bufferUtils';
const expect = chai.expect;
chai.use(sinonChai);

describe('bufferUtils', () => {
    describe('BufferReader', () => {
        let BufferReader = bufferUtils.BufferReader;

        describe('readIntLE', () => {

            it('should have a readIntLE function', () => {
                let reader = new BufferReader(new Buffer(10));
                expect(reader.readIntLE).to.be.a.function;
            });

            it('should call buffer a readIntLE with an incremented offset', () => {
                let buffer = {
                    readIntLE: sinon.spy()
                };
                let reader = new BufferReader(buffer);
                let size = 12;
                let offset = 0;
                reader.readIntLE(size);
                expect(buffer.readIntLE).to.be.calledWith(offset, size);
                reader.readIntLE(size);
                expect(buffer.readIntLE).to.be.calledWith(offset, offset + size);
            });

            it('should return result of buffer readIntLE', () => {
                let bufferResult = 'result data';
                let buffer = {
                    readIntLE: sinon.stub().returns(bufferResult)
                };
                let reader = new BufferReader(buffer);
                let result = reader.readIntLE(1);
                expect(result).to.be.equal(bufferResult);
            });

            it('should return number', () => {
                let buffer = new Buffer(1);
                buffer.fill(1);
                let reader = new BufferReader(buffer);
                let result = reader.readIntLE(1);
                expect(result).to.be.a.number;
            });

        });

        describe('readMultibyteNumLE', () => {
            it('should read two byte number #1', () => {
                let buffer = new Buffer(2);
                buffer.fill(49, 0);
                buffer.fill(0, 1);
                let reader = new BufferReader(buffer);
                let result = reader.readMultibyteNumLE(2);
                expect(result).to.be.a.number;
                expect(result).to.be.equal(49);
            });

            it('should read two byte number #2', () => {
                let buffer = new Buffer(2);
                buffer.fill(49, 0);
                buffer.fill(2, 1);
                let reader = new BufferReader(buffer);
                let result = reader.readMultibyteNumLE(2);
                expect(result).to.be.a.number;
                expect(result).to.be.equal(561);
            });
        });

        describe('readBuffer', () => {

            it('should have a readIntLE function', () => {
                let reader = new BufferReader(new Buffer(10));
                expect(reader.readBuffer).to.be.a.function;
            });

            it('should call buffer a slice with an incremented offset', () => {
                let buffer = {
                    slice: sinon.spy()
                };
                let reader = new BufferReader(buffer);
                let size = 12;
                let offset = 0;
                reader.readBuffer(size);
                expect(buffer.slice).to.be.calledWith(offset, offset + size);
                offset += size;
                reader.readBuffer(size);
                expect(buffer.slice).to.be.calledWith(offset, offset + size);
            });

            it('should return result of buffer slice', () => {
                let bufferResult = 'result data';
                let buffer = {
                    slice: sinon.stub().returns(bufferResult)
                };
                let reader = new BufferReader(buffer);
                let result = reader.readBuffer(1);
                expect(result).to.be.equal(bufferResult);
            });

            it('should return buffer', () => {
                let buffer = new Buffer(10);
                buffer.fill(1);
                let reader = new BufferReader(buffer);
                let result = reader.readBuffer(1);
                expect(Buffer.isBuffer(result)).to.be.a.equal(true);
            });

        });


        describe('readString', () => {
            it('should have a readIntLE function', () => {
                let reader = new BufferReader(new Buffer(10));
                expect(reader.readString).to.be.a.function;
            });

            it('should call buffer slice with an incremented offset', () => {
                let buffer = {
                    slice: sinon.stub().returns({
                        toString: sinon.stub().returns('data')
                    })
                };
                let reader = new BufferReader(buffer);
                let size = 12;
                let offset = 0;
                reader.readString(size);
                expect(buffer.slice).to.be.calledWith(offset, offset + size);
                offset += size;
                reader.readString(size);
                expect(buffer.slice).to.be.calledWith(offset, offset + size);
            });

            it('should call toString on the readBuffer result', () => {
                let bufferResult = 'result data';
                let buffer = {
                    toString: sinon.stub().returns(bufferResult)
                };
                let reader = new BufferReader({});
                reader.readBuffer = sinon.stub().returns(buffer);
                let result = reader.readString(1);
                expect(result).to.be.equal(bufferResult);
                expect(reader.readBuffer).to.have.been.calledWith(1);
            });

            it('should return string', () => {
                let buffer = new Buffer(10);
                buffer.fill(1);
                let reader = new BufferReader(buffer);
                let result = reader.readString(1);
                expect(result).to.be.a.string;
            });
        });
    });


    describe('BufferWriter', () => {
        let BufferWriter = bufferUtils.BufferWriter;


        describe('writeIntLE', () => {

            it('should have a writeIntLE function', () => {
                let writer = new BufferWriter(new Buffer(10));
                expect(writer.writeIntLE).to.be.a.function;
            });

            it('should call buffer writeIntLE with an incremented offset', () => {
                let buffer = {
                    writeIntLE: sinon.spy()
                };
                let writer = new BufferWriter(buffer);
                let size = 12;
                let offset = 0;
                let data = 10;
                writer.writeIntLE(data, size);
                expect(buffer.writeIntLE).to.be.calledWith(data, offset, size);
                writer.writeIntLE(data, size);
                expect(buffer.writeIntLE).to.be.calledWith(data, offset + size, size);
            });

        });


        describe('writeMultibyteNumLE', () => {
            it('should call buffer writeInt16LE with an incremented offset', () => {
                let spy = sinon.spy();
                let buffer = {
                    writeUInt16LE: spy
                };
                let writer = new BufferWriter(buffer);
                let size = 2;
                let offset = 0;
                let data = 561;
                writer.writeMultibyteNumLE(data, size);
                expect(spy).to.be.calledWith(data, offset);
                writer.writeMultibyteNumLE(data, size);
                expect(spy).to.be.calledWith(data, offset + size);
            });

            it('should call buffer writeInt32LE with an incremented offset', () => {
                let spy = sinon.spy();
                let buffer = {
                    writeUInt32LE: spy
                };
                let writer = new BufferWriter(buffer);
                let size = 4;
                let offset = 0;
                let data = 123123;
                writer.writeMultibyteNumLE(data, size);
                expect(spy).to.be.calledWith(data, offset);
                writer.writeMultibyteNumLE(data, size);
                expect(spy).to.be.calledWith(data, offset + size);
            });


            it('should write so read can return value (16bit)', () => {
                let buffer = new Buffer(6);
                let writer = new BufferWriter(buffer);
                let data = 561;
                writer.writeString("1234", 4);
                writer.writeMultibyteNumLE(data, 2);
                let buffer2 = new Buffer(buffer);
                let reader = new bufferUtils.BufferReader(buffer2);
                reader.readString(4);
                let res = reader.readMultibyteNumLE(2);
                expect(res).to.be.equal(data);
            });

            it('should write so read can return value (32bit)', () => {
                let buffer = new Buffer(8);
                let writer = new BufferWriter(buffer);
                let data = 1222514;
                writer.writeString("1234", 4);
                writer.writeMultibyteNumLE(data, 4);
                let buffer2 = new Buffer(buffer);
                let reader = new bufferUtils.BufferReader(buffer2);
                reader.readString(4);
                let res = reader.readMultibyteNumLE(4);
                expect(res).to.be.equal(data);
            });
        });

        describe('writeString', () => {

            it('should have a writeString function', () => {
                let writer = new BufferWriter(new Buffer(10));
                expect(writer.writeString).to.be.a.function;
            });

            it('should call buffer writeIntLE with an incremented offset', () => {
                let buffer = {
                    write: sinon.spy()
                };
                let writer = new BufferWriter(buffer);
                let size = 12;
                let offset = 0;
                let data = 'data';
                writer.writeString(data, size);
                expect(buffer.write).to.be.calledWith(data, offset, size, 'utf8');
                writer.writeString(data, size);
                expect(buffer.write).to.be.calledWith(data, offset + size, size, 'utf8');
            });

        });

        describe('copyFrom', () => {

            it('should have a copyFrom function', () => {
                let writer = new BufferWriter(new Buffer(10));
                expect(writer.copyFrom).to.be.a.function;
            });

            it('should call buffer writeIntLE with an incremented offset', () => {
                let buffer = {
                    write: sinon.spy()
                };

                let srcBuffer = {
                    copy: sinon.spy()
                };

                let writer = new BufferWriter(buffer);
                let size = 12;
                let offset = 0;
                writer.copyFrom(srcBuffer, size);
                expect(srcBuffer.copy).to.be.calledWith(buffer, offset);
                writer.copyFrom(srcBuffer, size);
                expect(srcBuffer.copy).to.be.calledWith(buffer, offset + size);
            });

        });

        describe('getBuffer', () => {

            it('should have a getBuffer function', () => {
                let writer = new BufferWriter(new Buffer(10));
                expect(writer.getBuffer).to.be.a.function;
            });

            it('should return a buffer', () => {
                let writer = new BufferWriter(new Buffer(10));
                expect(Buffer.isBuffer(writer.getBuffer())).to.be.equal(true);
            });

        });

    });

});
