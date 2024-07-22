import { UsbTransport } from "./transport_handler";
import { Protocol } from "./protocol_handler";
import { Command } from "./types";
import chipData from "./target/0x23-CH32X03x.json";
import { Response } from "./types";
import { ResponseHandler } from "./response_handler";
export class CH_loader extends UsbTransport {
  /// All readable and writable registers.
  /// - `RDPR`: Read Protection
  /// - `USER`: User Config Byte (normally in Register Map datasheet)
  /// - `WPR`:  Write Protection Mask, 1=unprotected, 0=protected
  ///
  /// | BYTE0  | BYTE1  | BYTE2  | BYTE3  |
  /// |--------|--------|--------|--------|
  /// | RDPR   | nRDPR  | USER   | nUSER  |
  /// | DATA0  | nDATA0 | DATA1  | nDATA1 |
  /// | WPR0   | WPR1   | WPR2   | WPR3   |
  static CFG_MASK_RDPR_USER_DATA_WPR = 0x07;
  static CFG_MASK_BTVER = 0x08;
  static CFG_MASK_UID = 0x10;
  static CFG_MASK_CODE_FLASH_PROTECT = 0x20;
  static CFG_MASK_ALL = 0x1f;

  device_type: number | null = null;
  chip_id: number | null = null;
  chip_uid: Uint8Array = new Uint8Array(8);
  code_flash_protected: boolean | null = null;
  btver: Uint8Array = new Uint8Array(4);
  flash_size: number | null = null;

  protocol = new Protocol();
  constructor(device: USBDevice, interfaceNumber: number) {
    super(device, interfaceNumber);
  }
  supportCodeFlashProtect(): boolean {
    if (!this.device_type) return false;
    return [0x14, 0x15, 0x17, 0x18, 0x19, 0x20].includes(this.device_type);
  }
  minEraseSectorNumber(): number {
    if (this.device_type === 0x10) {
      return 4;
    } else {
      return 8;
    }
  }
  async findDevice() {
    CH_loader.clearLog();
    //Identify Device
    const command1: Command = { type: "Identify", deviceId: 0, deviceType: 0 };
    const sendData1 = await this.protocol.ntoRaw(command1);
    this.sendRaw(sendData1);
    const res = await this.recv();
    if (res.type == "Err") throw new Error("Error in finding device");
    this.device_type = res.data[1];
    this.chip_id = res.data[0];
    //Display Device Series and Chip
    if (chipData.device_type == "0x" + this.device_type.toString(16))
      CH_loader.debugLog("Device Series : " + chipData.name);
    chipData.variants.forEach((variant) => {
      if (variant.chip_id == this.chip_id) {
        this.flash_size = variant.flash_size;
        CH_loader.debugLog("Chip : " + variant.name);
        CH_loader.debugLog(
          "Flash Size : " + variant.flash_size / 1024 + " KiB"
        );
      }
    });
    //Read Config
    const command2: Command = {
      type: "ReadConfig",
      bitMask: CH_loader.CFG_MASK_ALL,
    };
    const sendData2 = await this.protocol.ntoRaw(command2);
    this.sendRaw(sendData2);
    const res2 = await this.recv();
    if (res2.type == "Err") throw new Error("Error in finding config");
    //check if code flash is protected
    this.code_flash_protected =
      this.supportCodeFlashProtect() && res2.data[2] != 0xa5;
    CH_loader.debugLog("Code Flash Protected : " + this.code_flash_protected);
    //get the bootloader version
    this.btver.set(res2.data.slice(14, 18));
    CH_loader.debugLog(
      "Bootloader Version (BTVER) : " +
        this.btver[0] +
        "" +
        this.btver[1] +
        "." +
        this.btver[2] +
        "" +
        this.btver[3]
    );
    //get the chip UID
    this.chip_uid.set(res2.data.slice(18));
    CH_loader.debugLog(
      "Chip UID : " +
        Array.from(this.chip_uid)
          .map((x) => x.toString(16).padStart(2, "0").toUpperCase())
          .join("-")
    );
    //get the user config byte
    this.dumpInfo(res2);
  }
  async dumpInfo(res: Response) {
    const raw = res.data.slice(2);
    chipData.config_registers.forEach((config) => {
      let n: number = new DataView(
        raw.buffer,
        raw.byteOffset + Number(config.offset), //reg_def.offset,
        4
      ).getUint32(0, true);
      CH_loader.debugLog(config.name + " : 0x" + n.toString(16));
      if (config.fields) {
        config.fields.forEach((fieldDef) => {
          let bitWidth: number =
            fieldDef.bit_range[0] - fieldDef.bit_range[1] + 1;
          let b: number = (n >>> fieldDef.bit_range[1]) & ((1 << bitWidth) - 1);
          CH_loader.debugLog(
            `[${fieldDef.bit_range[0]}, ${fieldDef.bit_range[1]}] ${
              fieldDef.name
            }  0x${b.toString(16)} (0b${b.toString(2)})`
          );
          if ("explaination" in fieldDef && fieldDef.explaination) {
            for (const [key, value] of Object.entries(fieldDef.explaination)) {
              if (b == Number(key)) {
                CH_loader.debugLog(` - ${value}`);
              }
            }
          }
        });
      }
    });
  }
  async eraseFlash() {
    await this.findDevice();
    if (!this.flash_size) throw new Error("Flash size not found");
    let sectors = this.flash_size / 1024;
    const minSectors = this.minEraseSectorNumber();
    if (sectors < minSectors) {
      sectors = minSectors;
      CH_loader.debugLog(
        `erase_code: set min number of erased sectors to ${sectors}`
      );
    }
    const command: Command = { type: "Erase", sectors: sectors };
    const sendData = await this.protocol.ntoRaw(command);
    this.sendRaw(sendData);
    console.log(sendData);
    const res = await this.recv();
    console.log(res);
    if (res.type == "Err") throw new Error("Error in erasing flash");
    else CH_loader.debugLog(`Erased ${sectors} code flash sectors`);
  }
}
