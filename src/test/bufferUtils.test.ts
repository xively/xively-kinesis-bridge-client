'use strict';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import * as bufferUtils from '../bufferUtils';
const expect = chai.expect;
chai.use(sinonChai);

describe('bufferUtils', () => {
    describe('BufferReader', () => {
        var BufferReader = bufferUtils.BufferReader;

        describe('readIntLE', () => {

            it('should have a readIntLE function', () => {
                var reader = new BufferReader(new Buffer(10));
                expect(reader.readIntLE).to.be.a.function;
            });

            it('should call buffer a readIntLE with an incremented offset', () => {
                var buffer = {
                    readIntLE: sinon.spy()
                };
                var reader = new BufferReader(buffer);
                var size = 12;
                var offset = 0;
                reader.readIntLE(size);
                expect(buffer.readIntLE).to.be.calledWith(offset, size);
                reader.readIntLE(size);
                expect(buffer.readIntLE).to.be.calledWith(offset, offset + size);
            });

            it('should return result of buffer readIntLE', () => {
                var bufferResult = 'result data';
                var buffer = {
                    readIntLE: sinon.stub().returns(bufferResult)
                };
                var reader = new BufferReader(buffer);
                var result = reader.readIntLE(1);
                expect(result).to.be.equal(bufferResult);
            });

            it('should return number', () => {
                var buffer = new Buffer(1);
                buffer.fill(1);
                var reader = new BufferReader(buffer);
                var result = reader.readIntLE(1);
                expect(result).to.be.a.number;
            });

        });

        describe('readMultibyteNumLE', () => {
            it('should read two byte number #1', () => {
                var buffer = new Buffer(2);
                buffer.fill(49, 0);
                buffer.fill(0, 1);
                var reader = new BufferReader(buffer);
                var result = reader.readMultibyteNumLE(2);
                expect(result).to.be.a.number;
                expect(result).to.be.equal(49);
            });

            it('should read two byte number #2', () => {
                var buffer = new Buffer(2);
                buffer.fill(49, 0);
                buffer.fill(2, 1);
                var reader = new BufferReader(buffer);
                var result = reader.readMultibyteNumLE(2);
                expect(result).to.be.a.number;
                expect(result).to.be.equal(561);
            });
        });

        describe('readBuffer', () => {

            it('should have a readIntLE function', () => {
                var reader = new BufferReader(new Buffer(10));
                expect(reader.readBuffer).to.be.a.function;
            });

            it('should call buffer a slice with an incremented offset', () => {
                var buffer = {
                    slice: sinon.spy()
                };
                var reader = new BufferReader(buffer);
                var size = 12;
                var offset = 0;
                reader.readBuffer(size);
                expect(buffer.slice).to.be.calledWith(offset, offset + size);
                offset += size;
                reader.readBuffer(size);
                expect(buffer.slice).to.be.calledWith(offset, offset + size);
            });

            it('should return result of buffer slice', () => {
                var bufferResult = 'result data';
                var buffer = {
                    slice: sinon.stub().returns(bufferResult)
                };
                var reader = new BufferReader(buffer);
                var result = reader.readBuffer(1);
                expect(result).to.be.equal(bufferResult);
            });

            it('should return buffer', () => {
                var buffer = new Buffer(10);
                buffer.fill(1);
                var reader = new BufferReader(buffer);
                var result = reader.readBuffer(1);
                expect(Buffer.isBuffer(result)).to.be.a.equal(true);
            });

        });


        describe('readString', () => {
            it('should have a readIntLE function', () => {
                var reader = new BufferReader(new Buffer(10));
                expect(reader.readString).to.be.a.function;
            });

            it('should call buffer slice with an incremented offset', () => {
                var buffer = {
                    slice: sinon.stub().returns({
                        toString: sinon.stub().returns('data')
                    })
                };
                var reader = new BufferReader(buffer);
                var size = 12;
                var offset = 0;
                reader.readString(size);
                expect(buffer.slice).to.be.calledWith(offset, offset + size);
                offset += size;
                reader.readString(size);
                expect(buffer.slice).to.be.calledWith(offset, offset + size);
            });

            it('should call toString on the readBuffer result', () => {
                var bufferResult = 'result data';
                var buffer = {
                    toString: sinon.stub().returns(bufferResult)
                };
                var reader = new BufferReader({});
                reader.readBuffer = sinon.stub().returns(buffer);
                var result = reader.readString(1);
                expect(result).to.be.equal(bufferResult);
                expect(reader.readBuffer).to.have.been.calledWith(1);
            });

            it('should return string', () => {
                var buffer = new Buffer(10);
                buffer.fill(1);
                var reader = new BufferReader(buffer);
                var result = reader.readString(1);
                expect(result).to.be.a.string;
            });
        });
    });


    describe('BufferWriter', () => {
        var BufferWriter = bufferUtils.BufferWriter;


        describe('writeIntLE', () => {

            it('should have a writeIntLE function', () => {
                var writer = new BufferWriter(new Buffer(10));
                expect(writer.writeIntLE).to.be.a.function;
            });

            it('should call buffer writeIntLE with an incremented offset', () => {
                var buffer = {
                    writeIntLE: sinon.spy()
                };
                var writer = new BufferWriter(buffer);
                var size = 12;
                var offset = 0;
                var data = 10;
                writer.writeIntLE(data, size);
                expect(buffer.writeIntLE).to.be.calledWith(data, offset, size);
                writer.writeIntLE(data, size);
                expect(buffer.writeIntLE).to.be.calledWith(data, offset + size, size);
            });

        });


        describe('writeMultibyteNumLE', () => {
            it('should call buffer writeInt16LE with an incremented offset', () => {
                var spy = sinon.spy();
                var buffer = {
                    writeUInt16LE: spy
                };
                var writer = new BufferWriter(buffer);
                var size = 2;
                var offset = 0;
                var data = 561;
                writer.writeMultibyteNumLE(data, size);
                expect(spy).to.be.calledWith(data, offset);
                writer.writeMultibyteNumLE(data, size);
                expect(spy).to.be.calledWith(data, offset + size);
            });

            it('should call buffer writeInt32LE with an incremented offset', () => {
                var spy = sinon.spy();
                var buffer = {
                    writeUInt32LE: spy
                };
                var writer = new BufferWriter(buffer);
                var size = 4;
                var offset = 0;
                var data = 123123;
                writer.writeMultibyteNumLE(data, size);
                expect(spy).to.be.calledWith(data, offset);
                writer.writeMultibyteNumLE(data, size);
                expect(spy).to.be.calledWith(data, offset + size);
            });


            it('should write so read can return value (16bit)', () => {
                var buffer = new Buffer(6);
                var writer = new BufferWriter(buffer);
                var data = 561;
                writer.writeString("1234", 4);
                writer.writeMultibyteNumLE(data, 2);
                var buffer2 = new Buffer(buffer);
                var reader = new bufferUtils.BufferReader(buffer2);
                reader.readString(4);
                var res = reader.readMultibyteNumLE(2);
                expect(res).to.be.equal(data);
            });

            it('should write so read can return value (32bit)', () => {
                var buffer = new Buffer(8);
                var writer = new BufferWriter(buffer);
                var data = 1222514;
                writer.writeString("1234", 4);
                writer.writeMultibyteNumLE(data, 4);
                var buffer2 = new Buffer(buffer);
                var reader = new bufferUtils.BufferReader(buffer2);
                reader.readString(4);
                var res = reader.readMultibyteNumLE(4);
                expect(res).to.be.equal(data);
            });
        });

        describe('writeString', () => {

            it('should have a writeString function', () => {
                var writer = new BufferWriter(new Buffer(10));
                expect(writer.writeString).to.be.a.function;
            });

            it('should call buffer writeIntLE with an incremented offset', () => {
                var buffer = {
                    write: sinon.spy()
                };
                var writer = new BufferWriter(buffer);
                var size = 12;
                var offset = 0;
                var data = 'data';
                writer.writeString(data, size);
                expect(buffer.write).to.be.calledWith(data, offset, size, 'utf8');
                writer.writeString(data, size);
                expect(buffer.write).to.be.calledWith(data, offset + size, size, 'utf8');
            });

        });

        describe('copyFrom', () => {

            it('should have a copyFrom function', () => {
                var writer = new BufferWriter(new Buffer(10));
                expect(writer.copyFrom).to.be.a.function;
            });

            it('should call buffer writeIntLE with an incremented offset', () => {
                var buffer = {
                    write: sinon.spy()
                };

                var srcBuffer = {
                    copy: sinon.spy()
                };

                var writer = new BufferWriter(buffer);
                var size = 12;
                var offset = 0;
                writer.copyFrom(srcBuffer, size);
                expect(srcBuffer.copy).to.be.calledWith(buffer, offset);
                writer.copyFrom(srcBuffer, size);
                expect(srcBuffer.copy).to.be.calledWith(buffer, offset + size);
            });

        });

        describe('getBuffer', () => {

            it('should have a getBuffer function', () => {
                var writer = new BufferWriter(new Buffer(10));
                expect(writer.getBuffer).to.be.a.function;
            });

            it('should return a buffer', () => {
                var writer = new BufferWriter(new Buffer(10));
                expect(Buffer.isBuffer(writer.getBuffer())).to.be.equal(true);
            });

        });

    });

});
