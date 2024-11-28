import { Response } from "./types.ts";
export declare class ResponseHandler {
    static responseToString(response: Response): string;
    static isOk(response: Response): boolean;
    static payload(response: Response): Uint8Array;
    static fromRaw(raw: Uint8Array): Response;
}
