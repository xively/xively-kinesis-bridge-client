'use strict';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import {KinesisBridgeEnvelopeParser} from '../index';
import {KinesisBridgeEnvelope} from "../KinesisBridgeEnvelope";
const expect = chai.expect;
chai.use(sinonChai);

describe('KinesisEnvelopeParser', () => {
    it('should have a parseData function exported', () => {
        const parser = new KinesisBridgeEnvelopeParser();
        expect(parser.parseData).to.be.a.function;
    });
    
    it('should return a parsed kinesis bridge envelope when called with valid payload', () => {
        const payload = 'AcZHaPAmI+YRgaQOOyQddOkkAGU1ZDQyOGIxLTBlN2YtNGRiYy1hMWRlLTU4YmY2OWNhZWU1NMsAeyJTY2hlbWFWZXJzaW9uIjoxLCJFbnRpdHlUeXBlIjoiZGV2aWNlIiwiT3JnYW5pemF0aW9uSWRzIjpbImE1ZTM5MjJkLTU0ZWItNDlhOC04MmY4LTNlYTVhNTU2ZGVhMyJdLCJUZW1wbGF0ZUlkIjoiNjViM2NlNTQtMTAyMS00NWNhLWJkMDItMDMwODY0ZDVjNjUyIiwiQWNjb3VudElkIjoiYWE4MjVjNGQtZWFiNi00ZjcyLTgxODYtNDZmNGJiZjgxYjVmIn1eAHhpL2JsdWUvdjEvYWE4MjVjNGQtZWFiNi00ZjcyLTgxODYtNDZmNGJiZjgxYjVmL2QvZTVkNDI4YjEtMGU3Zi00ZGJjLWExZGUtNThiZjY5Y2FlZTU0L2dlbmVyaWOAAHsiU2NoZW1hVmVyc2lvbiI6MSwiRW50aXR5VHlwZSI6InRvcGljIiwiVG9waWNPd25lciI6eyJFbnRpdHlUeXBlIjoiZGV2aWNlIiwiQWNjb3VudElkIjoiYWE4MjVjNGQtZWFiNi00ZjcyLTgxODYtNDZmNGJiZjgxYjVmIn19UQEAAHsiYWNjb3VudElkIjoiYWE4MjVjNGQtZWFiNi00ZjcyLTgxODYtNDZmNGJiZjgxYjVmIiwic291cmNlVGltZXN0YW1wIjoxNDY0MjU2MDgyOTE3LCJzb3VyY2VJZCI6ImU1ZDQyOGIxLTBlN2YtNGRiYy1hMWRlLTU4YmY2OWNhZWU1NCIsImNvZGUiOjIwMCwibWVzc2FnZSI6InNmYWZzYWZzYVd1ZiB1YmlqZSBrb2Z1c2luIHNhd25pbCBuaSBlZnUgYnViemVzdG90IHJvem5lIGluaXBvZmhhaiBsYWZpcnV0IGppbHV2ZXZhIHB1dG9ndWRpIGZham9ndW4gb2J1IGVnbG93by4iLCJkZXRhaWxzIjoiVGVzdCIsInNldmVyaXR5IjoiaW5mb3JtYXRpb25hbCIsInRhZ3MiOlsibWFsZnVuY3Rpb24iXX0=';
        const parser = new KinesisBridgeEnvelopeParser();
        const kinesisBridgeEnvelope : KinesisBridgeEnvelope = parser.parseData(payload);

        expect(kinesisBridgeEnvelope).to.be.an.instanceof(KinesisBridgeEnvelope);
        expect(kinesisBridgeEnvelope.headerVersion).to.equal(1);
        expect(kinesisBridgeEnvelope.timeUUID).to.equal('c64768f0-2623-e611-81a4-0e3b241d74e9');
        expect(kinesisBridgeEnvelope.sourceNameLength).to.equal(94);
        expect(kinesisBridgeEnvelope.sourceName).to.equal('e5d428b1-0e7f-4dbc-a1de-58bf69caee54');
        expect(kinesisBridgeEnvelope.sourcePropertiesLength).to.equal(203);
        expect(kinesisBridgeEnvelope.sourceProperties).to.deep.equal({
            SchemaVersion: 1,
            EntityType: 'device',
            OrganizationIds: [ 'a5e3922d-54eb-49a8-82f8-3ea5a556dea3' ],
            TemplateId: '65b3ce54-1021-45ca-bd02-030864d5c652',
            AccountId: 'aa825c4d-eab6-4f72-8186-46f4bbf81b5f'
        });
        expect(kinesisBridgeEnvelope.targetName).to.equal('xi/blue/v1/aa825c4d-eab6-4f72-8186-46f4bbf81b5f/d/e5d428b1-0e7f-4dbc-a1de-58bf69caee54/generic');
        expect(kinesisBridgeEnvelope.targetPropertiesLength).to.equal(128);
        expect(kinesisBridgeEnvelope.targetProperties).to.deep.equal({
            SchemaVersion: 1,
            EntityType: 'topic',
            TopicOwner:
            {
                EntityType: 'device',
                AccountId: 'aa825c4d-eab6-4f72-8186-46f4bbf81b5f'
            }
        });
        expect(kinesisBridgeEnvelope.contentLength).to.equal(337);
        expect(kinesisBridgeEnvelope.contentBody).to.be.an.instanceof(Buffer);
        expect(JSON.parse(kinesisBridgeEnvelope.contentBody.toString('utf-8'))).to.deep.equal({
            accountId: 'aa825c4d-eab6-4f72-8186-46f4bbf81b5f',
            sourceTimestamp: 1464256082917,
            sourceId: 'e5d428b1-0e7f-4dbc-a1de-58bf69caee54',
            code: 200,
            message: 'sfafsafsaWuf ubije kofusin sawnil ni efu bubzestot rozne inipofhaj lafirut jiluveva putogudi fajogun obu eglowo.',
            details: 'Test',
            severity: 'informational',
            tags: [ 'malfunction' ]
        });
        
    });

    it('should throw an exception when called with null payload', () => {
        const parser = new KinesisBridgeEnvelopeParser();
        expect(parser.parseData.bind(parser, null)).to.throw(TypeError);
    });

    it('should throw an exception when called with undefined payload', () => {
        const parser = new KinesisBridgeEnvelopeParser();
        expect(parser.parseData.bind(parser, undefined)).to.throw(TypeError);
    });

    it('should throw an exception when called with not base64 encoded payload', () => {
        const parser = new KinesisBridgeEnvelopeParser();
        expect(parser.parseData.bind(parser, 'Not base64 encoded payload')).to.throw(Error);
    });

    it('should throw an exception when called with invalid base64 encoded payload ', () => {
        const parser = new KinesisBridgeEnvelopeParser();
        expect(parser.parseData.bind(parser, 'UGF5bG9hZA==')).to.throw(Error);
    });
});