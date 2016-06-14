export class KinesisBridgeEnvelope {
    public headerVersion: number;
    public timeUUID: string;
    public sourceNameLength: number;
    public sourceName: string;
    public sourcePropertiesLength: number;
    public sourceProperties: any;
    public targetNameLength: number;
    public targetName: string;
    public targetPropertiesLength: number;
    public targetProperties: any;
    public contentLength: number;
    public contentBody: Buffer;
}
