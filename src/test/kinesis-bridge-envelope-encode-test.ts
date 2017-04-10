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

        const payload = 'AcZHaPAmI+YRgaQOOyQddOkCAHt9BAAie30iXgB4aS9ibHVlL3Yx' +
                        'L2FhODI1YzRkLWVhYjYtNGY3Mi04MTg2LTQ2ZjRiYmY4MWI1Zi9k' +
                        'L2U1ZDQyOGIxLTBlN2YtNGRiYy1hMWRlLTU4YmY2OWNhZWU1NC9n' +
                        'ZW5lcmljBAAie30iBwAAAFRlc3Rp';

        expect(payload).to.be.eq(encoder.encodeData(kinesisBridgeEnvelope));

        const decodedMessage = encoder.parseData(payload);

        expect(kinesisBridgeEnvelope.headerVersion).to.be.eq(decodedMessage.headerVersion);
        expect(kinesisBridgeEnvelope.timeUUID).to.be.eq(decodedMessage.timeUUID);
        //expect(kinesisBridgeEnvelope.sourceNameLength).to.be.eq(decodedMessage.sourceNameLength);
        expect(kinesisBridgeEnvelope.sourceName).to.be.eq(decodedMessage.sourceName);
        //expect(kinesisBridgeEnvelope.sourcePropertiesLength).to.be.eq(decodedMessage.sourcePropertiesLength);
        expect(kinesisBridgeEnvelope.sourceProperties).to.be.eq(decodedMessage.sourceProperties);
        expect(kinesisBridgeEnvelope.targetNameLength).to.be.eq(decodedMessage.targetNameLength);
        expect(kinesisBridgeEnvelope.targetName).to.be.eq(decodedMessage.targetName);
        //expect(kinesisBridgeEnvelope.targetPropertiesLength).to.be.eq(decodedMessage.targetPropertiesLength);
        expect(kinesisBridgeEnvelope.targetProperties).to.be.eq(decodedMessage.targetProperties);
        expect(kinesisBridgeEnvelope.contentLength).to.be.eq(decodedMessage.contentLength);
    });
});
