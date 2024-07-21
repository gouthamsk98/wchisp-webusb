import { UsbTransport } from "./transport";
import { Protocol } from "./protocol_handler";
import { Command } from "./types";
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
  protocol = new Protocol();
  constructor(device: USBDevice, interfaceNumber: number) {
    super(device, interfaceNumber);
  }
  async findDevice() {
    const command1: Command = { type: "Identify", deviceId: 0, deviceType: 0 };
    const sendData1 = await this.protocol.ntoRaw(command1);
    this.sendRaw(sendData1);
    const res = await this.recv();
    if (res.type == "Err") throw new Error("Error in finding device");
    const command2: Command = {
      type: "ReadConfig",
      bitMask: CH_loader.CFG_MASK_ALL,
    };
    const sendData2 = await this.protocol.ntoRaw(command2);
    this.sendRaw(sendData2);
    const res2 = await this.recv();
    console.log(res2);
  }
  //   async dumpInfo(): Promise<void> {
  //     if (this.chip.eepromSize > 0) {
  //       if (this.chip.eepromSize % 1024 !== 0) {
  //         console.log(
  //           `Chip: ${this.chip.name} (Code Flash: ${
  //             this.chip.flashSize / 1024
  //           }KiB, Data EEPROM: ${this.chip.eepromSize} Bytes)`
  //         );
  //       } else {
  //         console.log(
  //           `Chip: ${this.chip.name} (Code Flash: ${
  //             this.chip.flashSize / 1024
  //           }KiB, Data EEPROM: ${this.chip.eepromSize / 1024}KiB)`
  //         );
  //       }
  //     } else {
  //       console.log(
  //         `Chip: ${this.chip.name} (Code Flash: ${this.chip.flashSize / 1024}KiB)`
  //       );
  //     }

  // console.log(
  //   `Chip UID: ${this.chipUid
  //     .map((x) => x.toString(16).padStart(2, "0"))
  //     .join("-")}`
  // );
  // console.log(
  //   `BTVER(bootloader ver): ${this.bootloaderVersion[0].toString(
  //     16
  //   )}${this.bootloaderVersion[1].toString(
  //     16
  //   )}.${this.bootloaderVersion[2].toString(
  //     16
  //   )}${this.bootloaderVersion[3].toString(16)}`
  // );

  // if (this.chip.supportCodeFlashProtect()) {
  //   console.log(`Code Flash protected: ${this.codeFlashProtected}`);
  // }

  // await this.dumpConfig();
  //   }
}
