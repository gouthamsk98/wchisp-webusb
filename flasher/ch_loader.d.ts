import { UsbTransport } from "./transport_handler";
import { Protocol } from "./protocol_handler";
import { ChipData, Response, IHexRecord } from "./types";
export declare class CH_loader extends UsbTransport {
    static CFG_MASK_RDPR_USER_DATA_WPR: number;
    static CFG_MASK_BTVER: number;
    static CFG_MASK_UID: number;
    static CFG_MASK_CODE_FLASH_PROTECT: number;
    static CFG_MASK_ALL: number;
    SECTOR_SIZE: number;
    device_type: number | null;
    chip_id: number | null;
    chip_uid: Uint8Array;
    code_flash_protected: boolean | null;
    btver: Uint8Array;
    flash_size: number | null;
    protocol: Protocol;
    constructor(device: USBDevice);
    supportCodeFlashProtect(): boolean;
    minEraseSectorNumber(): number;
    xorKey(): Uint8Array;
    findDevice(): Promise<void>;
    dumpInfo(res: Response, chipData: ChipData): Promise<void>;
    eraseCode(sectors: number): Promise<void>;
    eraseFlash(flash_size?: number | null): Promise<void>;
    flashChunk(address: number, raw: Uint8Array, key: Uint8Array): Promise<void>;
    extendFirmwareToSectorBoundary(buf: number[]): number[];
    private mergeSections;
    readIHex(data: string): Promise<Uint8Array>;
    parseIHexRecord(line: string): IHexRecord;
    intelHexToUint8Array(hexString: string): Uint8Array<ArrayBuffer>;
    flashFirmware(firmware: string): Promise<void>;
    reset(): Promise<void>;
}
