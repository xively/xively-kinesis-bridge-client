import chai from 'chai';
// tslint:disable:import-name
import sinonChai from 'sinon-chai';
// tslint:enable:import-name
import {KinesisBridgeEnvelopeParser} from '../index';
import {KinesisBridgeEnvelope} from '../kinesis-bridge-envelope';
const expect = chai.expect;
chai.use(sinonChai);

describe('KinesisEnvelopeEncoder', () => {

    it('should have an encodeData function exported', () => {
        const parser = new KinesisBridgeEnvelopeParser();
        expect(parser.encodeData).to.be.a.function;
    });

    it('should return an encoded valid payload when called with a valid kinesis bridge envelope', () => {
        const encoder = new KinesisBridgeEnvelopeParser();
        const kinesisBridgeEnvelope : KinesisBridgeEnvelope = new KinesisBridgeEnvelope();
        kinesisBridgeEnvelope.headerVersion = 1;
        kinesisBridgeEnvelope.timeUUID = 'c64768f0-2623-e611-81a4-0e3b241d74e9';
        kinesisBridgeEnvelope.sourceNameLength = 0;
        kinesisBridgeEnvelope.sourceName = '{}';
        kinesisBridgeEnvelope.sourcePropertiesLength = 0;
        kinesisBridgeEnvelope.sourceProperties = '{}';
        kinesisBridgeEnvelope.targetNameLength = 94;
        kinesisBridgeEnvelope.targetName = 'xi/blue/v1/aa825c4d-eab6-4f72-8186-46f4bbf81b5f/d/e5d428b1-0e7f-4dbc-a1de-58bf69caee54/generic';
        kinesisBridgeEnvelope.targetPropertiesLength = 0;
        kinesisBridgeEnvelope.targetProperties = '{}';
        kinesisBridgeEnvelope.contentLength = 7;
        kinesisBridgeEnvelope.contentBody = new Buffer('Testing', 'binary');

        expect('Foo').to.be.eq(encoder.encodeData(kinesisBridgeEnvelope));
    });
});
