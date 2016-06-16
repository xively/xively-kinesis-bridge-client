# xively-kinesis-bridge

[![Build Status](https://travis-ci.org/xively/xively-kinesis-bridge-client.svg?branch=fix/badge)](https://travis-ci.org/xively/xively-kinesis-bridge-client)


## Xively Kinesis Bridge Client Library

This is a NodeJS client library written in TypeScript for the Xively Kinesis Bridge feature. It helps parsing the envelope transported on the Xively-connected Amazon Kinesis stream.

## Quickstart

```
npm install xively-kinesis-bridge-client
```

### Sample

```javascript
import {KinesisBridgeEnvelopeParser} from 'xively-kinesis-bridge-client';

const base64Data = 'some base64 encoded string';
const parser = new KinesisBridgeEnvelopeParser();

const kinesisBridgeEnvelope : KinesisBridgeEnvelope = parser.parseData(base64Data);
```
