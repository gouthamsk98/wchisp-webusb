export type Chip = {
  name: string; // Chip's name, without variants suffix
  chipId: number;
  altChipIds: number[];
  mcuType: number;
  deviceType: number;
  flashSize: number;
  eepromSize: number;
  eepromStartAddr: number;
  supportNet?: boolean;
  supportUsb?: boolean;
  supportSerial?: boolean;
  //   configRegisters: ConfigRegister[];
};

export type Command =
  | { type: "Identify"; deviceId: number; deviceType: number }
  | { type: "IspEnd"; reason: number }
  | { type: "IspKey"; key: Uint8Array }
  | { type: "Erase"; sectors: number }
  | { type: "Program"; address: number; padding: number; data: Uint8Array }
  | { type: "Verify"; address: number; padding: number; data: Uint8Array }
  | { type: "ReadConfig"; bitMask: number }
  | { type: "WriteConfig"; bitMask: number; data: Uint8Array }
  | { type: "DataRead"; address: number; len: number }
  | { type: "DataProgram"; address: number; padding: number; data: Uint8Array }
  | { type: "DataErase"; sectors: number };
