import { Response } from "./types";
export declare class UsbTransport {
    static ENDPOINT_OUT: number;
    static ENDPOINT_IN: number;
    static USB_TIMEOUT_MS: number;
    static MAX_PACKET_SIZE: number;
    static SECTOR_SIZE: number;
    static DEFAULT_TRANSPORT_TIMEOUT_MS: number;
    static consoleTextarea: string;
    private device;
    static enable_DOM_Log: boolean;
    constructor(device: USBDevice);
    sleep(microseconds: number): Promise<unknown>;
    static debugLog(message: string): void;
    static clearLog(): void;
    static scanDevices(): Promise<number>;
    static openNth(nth: number): Promise<UsbTransport>;
    static openAny(): Promise<UsbTransport>;
    sendRaw(raw: Uint8Array): Promise<void>;
    recvRaw(): Promise<Uint8Array>;
    recv(): Promise<Response>;
}
