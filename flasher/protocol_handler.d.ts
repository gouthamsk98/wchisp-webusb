import { Command } from "./types";
export declare class Protocol {
    IDENTIFY: number;
    ISP_END: number;
    ISP_KEY: number;
    ERASE: number;
    PROGRAM: number;
    VERIFY: number;
    READ_CONFIG: number;
    WRITE_CONFIG: number;
    DATA_ERASE: number;
    DATA_PROGRAM: number;
    DATA_READ: number;
    WRITE_OTP: number;
    READ_OTP: number;
    SET_BAUD: number;
    pwriteWith(buffer: DataView, value: number | Uint8Array, offset: number, littleEndian: boolean): Promise<DataView<ArrayBufferLike>>;
    ntoRaw(command: Command): Promise<Uint8Array>;
}
