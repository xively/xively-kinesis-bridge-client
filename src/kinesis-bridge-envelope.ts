export class KinesisBridgeEnvelope {
    public headerVersion: number;
    public timeUUID: string;
    public sourceNameLength: number;
    public sourceName: string;
    public sourcePropertiesLength: number;
    // tslint:disable-next-line:no-any
    public sourceProperties: any;
    public targetNameLength: number;
    public targetName: string;
    public targetPropertiesLength: number;
    // tslint:disable-next-line:no-any
    public targetProperties: any;
    public contentLength: number;
    public contentBody: Buffer;
}
