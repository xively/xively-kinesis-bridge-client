import chai from 'chai';
// tslint:disable:import-name
import sinonChai from 'sinon-chai';
// tslint:enable:import-name
import {KinesisBridgeEnvelopeParser} from '../index';
import {KinesisBridgeEnvelope} from '../kinesis-bridge-envelope';
const expect = chai.expect;
chai.use(sinonChai);

const createEnvelope = () : KinesisBridgeEnvelope => {
    const kinesisBridgeEnvelope = new KinesisBridgeEnvelope();
    kinesisBridgeEnvelope.headerVersion = 1;
    kinesisBridgeEnvelope.timeUUID = 'c64768f0-2623-e611-81a4-0e3b241d74e9';
    kinesisBridgeEnvelope.sourceNameLength = 36;
    kinesisBridgeEnvelope.sourceName = 'e5d428b1-0e7f-4dbc-a1de-58bf69caee54';
    kinesisBridgeEnvelope.sourcePropertiesLength = 203;
    kinesisBridgeEnvelope.sourceProperties = {
        SchemaVersion: 1,
        EntityType: 'device',
        OrganizationIds: [ 'a5e3922d-54eb-49a8-82f8-3ea5a556dea3' ],
        TemplateId: '65b3ce54-1021-45ca-bd02-030864d5c652',
        AccountId: 'aa825c4d-eab6-4f72-8186-46f4bbf81b5f'
    };
    kinesisBridgeEnvelope.targetNameLength = 94;
    kinesisBridgeEnvelope.targetName = 'xi/blue/v1/aa825c4d-eab6-4f72-8186-46f4bbf81b5f/d/e5d428b1-0e7f-4dbc-a1de-58bf69caee54/generic';
    kinesisBridgeEnvelope.targetPropertiesLength = 128;
    kinesisBridgeEnvelope.targetProperties = {
        SchemaVersion: 1,
        EntityType: 'topic',
        TopicOwner:
        {
            EntityType: 'device',
            AccountId: 'aa825c4d-eab6-4f72-8186-46f4bbf81b5f'
        }
    };
    kinesisBridgeEnvelope.contentLength = 337;

    const jsonContent = {
        accountId: 'aa825c4d-eab6-4f72-8186-46f4bbf81b5f',
        sourceTimestamp: 1464256082917,
        sourceId: 'e5d428b1-0e7f-4dbc-a1de-58bf69caee54',
        code: 200,
        message: 'sfafsafsaWuf ubije kofusin sawnil ni efu bubzestot rozne inipofhaj lafirut jiluveva putogudi fajogun obu eglowo.',
        details: 'Test',
        severity: 'informational',
        tags: [ 'malfunction' ]
    };

    kinesisBridgeEnvelope.contentBody = new Buffer(JSON.stringify(jsonContent), 'binary');

    return kinesisBridgeEnvelope;

};

describe('KinesisEnvelopeEncoder', () => {

    it('should have an encodeData function exported', () => {
        const parser = new KinesisBridgeEnvelopeParser();
        expect(parser.encodeData).to.be.a.function;
    });

    it('should return an encoded valid payload when called with a valid kinesis bridge envelope', () => {
        const encoder = new KinesisBridgeEnvelopeParser();

        const kinesisBridgeEnvelope = createEnvelope();

        const payload = 'AcZHaPAmI+YRgaQOOyQddOkkAGU1ZDQyOGIxLTBlN2YtNGRiYy1hMWRlLTU4YmY2OWNhZWU1NM' +
            'sAeyJTY2hlbWFWZXJzaW9uIjoxLCJFbnRpdHlUeXBlIjoiZGV2aWNlIiwiT3JnYW5pemF0aW9uSWRzIjpbImE1' +
            'ZTM5MjJkLTU0ZWItNDlhOC04MmY4LTNlYTVhNTU2ZGVhMyJdLCJUZW1wbGF0ZUlkIjoiNjViM2NlNTQtMTAyMS' +
            '00NWNhLWJkMDItMDMwODY0ZDVjNjUyIiwiQWNjb3VudElkIjoiYWE4MjVjNGQtZWFiNi00ZjcyLTgxODYtNDZm' +
            'NGJiZjgxYjVmIn1eAHhpL2JsdWUvdjEvYWE4MjVjNGQtZWFiNi00ZjcyLTgxODYtNDZmNGJiZjgxYjVmL2QvZT' +
            'VkNDI4YjEtMGU3Zi00ZGJjLWExZGUtNThiZjY5Y2FlZTU0L2dlbmVyaWOAAHsiU2NoZW1hVmVyc2lvbiI6MSwi' +
            'RW50aXR5VHlwZSI6InRvcGljIiwiVG9waWNPd25lciI6eyJFbnRpdHlUeXBlIjoiZGV2aWNlIiwiQWNjb3VudE' +
            'lkIjoiYWE4MjVjNGQtZWFiNi00ZjcyLTgxODYtNDZmNGJiZjgxYjVmIn19UQEAAHsiYWNjb3VudElkIjoiYWE4' +
            'MjVjNGQtZWFiNi00ZjcyLTgxODYtNDZmNGJiZjgxYjVmIiwic291cmNlVGltZXN0YW1wIjoxNDY0MjU2MDgyOT' +
            'E3LCJzb3VyY2VJZCI6ImU1ZDQyOGIxLTBlN2YtNGRiYy1hMWRlLTU4YmY2OWNhZWU1NCIsImNvZGUiOjIwMCwi' +
            'bWVzc2FnZSI6InNmYWZzYWZzYVd1ZiB1YmlqZSBrb2Z1c2luIHNhd25pbCBuaSBlZnUgYnViemVzdG90IHJvem' +
            '5lIGluaXBvZmhhaiBsYWZpcnV0IGppbHV2ZXZhIHB1dG9ndWRpIGZham9ndW4gb2J1IGVnbG93by4iLCJkZXRh' +
            'aWxzIjoiVGVzdCIsInNldmVyaXR5IjoiaW5mb3JtYXRpb25hbCIsInRhZ3MiOlsibWFsZnVuY3Rpb24iXX0=';

        expect(payload).to.be.eq(encoder.encodeData(kinesisBridgeEnvelope));

    });

    it('the reencoded object should match the original object', () => {
        const encoder = new KinesisBridgeEnvelopeParser();

        const kinesisBridgeEnvelope = createEnvelope();

        const payload = encoder.encodeData(kinesisBridgeEnvelope);
        const decodedEnvelope = encoder.parseData(payload);

        expect(kinesisBridgeEnvelope.headerVersion).to.be.eq(decodedEnvelope.headerVersion);
        expect(kinesisBridgeEnvelope.timeUUID).to.be.eq(decodedEnvelope.timeUUID);
        expect(kinesisBridgeEnvelope.sourceNameLength).to.be.eq(decodedEnvelope.sourceNameLength);
        expect(kinesisBridgeEnvelope.sourceName).to.be.eq(decodedEnvelope.sourceName);
        expect(kinesisBridgeEnvelope.sourcePropertiesLength).to.be.eq(decodedEnvelope.sourcePropertiesLength);
        expect(kinesisBridgeEnvelope.sourceProperties).to.deep.equal(decodedEnvelope.sourceProperties);
        expect(kinesisBridgeEnvelope.targetNameLength).to.be.eq(decodedEnvelope.targetNameLength);
        expect(kinesisBridgeEnvelope.targetName).to.be.eq(decodedEnvelope.targetName);
        expect(kinesisBridgeEnvelope.targetPropertiesLength).to.deep.equal(decodedEnvelope.targetPropertiesLength);
        expect(kinesisBridgeEnvelope.targetProperties).to.deep.equal(decodedEnvelope.targetProperties);
        expect(kinesisBridgeEnvelope.contentLength).to.be.eq(decodedEnvelope.contentLength);
    });
});
