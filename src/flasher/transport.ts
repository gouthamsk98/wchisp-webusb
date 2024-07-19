const ENDPOINT_OUT = 0x02;
const ENDPOINT_IN = 0x82;
const USB_TIMEOUT_MS = 5000;

export class UsbTransport {
  private device: USBDevice;
  private interfaceNumber: number;

  constructor(device: USBDevice, interfaceNumber: number) {
    this.device = device;
    this.interfaceNumber = interfaceNumber;
  }

  public async scanDevices(): Promise<number> {
    const filters = [
      { vendorId: 0x4348, productId: 0x55e0 },
      { vendorId: 0x1a86, productId: 0x55e0 },
    ];

    const devices = await navigator.usb.getDevices();
    const matchingDevices = devices.filter((device) =>
      filters.some(
        (filter) =>
          device.vendorId === filter.vendorId &&
          device.productId === filter.productId
      )
    );

    console.debug(`Found ${matchingDevices.length} WCH ISP USB devices`);
    return matchingDevices.length;
  }

  static async openNth(nth: number): Promise<UsbTransport> {
    const filters = [
      { vendorId: 0x4348, productId: 0x55e0 },
      { vendorId: 0x1a86, productId: 0x55e0 },
    ];

    const devices = await navigator.usb.getDevices();
    const device = devices[nth];
    if (!device) {
      throw new Error(
        `No WCH ISP USB device found (4348:55e0 or 1a86:55e0 device not found at index #${nth})`
      );
    }

    console.debug(`Found USB Device ${device.productName}`);

    await device.open();

    // Select configuration and claim interface
    if (device.configuration === null) {
      await device.selectConfiguration(1);
    }

    const config = device.configuration;
    let endpointOutFound = false;
    let endpointInFound = false;

    if (config) {
      console.log("config", config);
      for (const intf of config.interfaces) {
        console.log(intf);
        for (const endpoint of intf.alternate.endpoints) {
          if (endpoint.endpointNumber === ENDPOINT_OUT) {
            endpointOutFound = true;
          }
          if (endpoint.endpointNumber === ENDPOINT_IN) {
            endpointInFound = true;
          }
        }
      }
    }

    if (!(endpointOutFound && endpointInFound)) {
      throw new Error("USB Endpoints not found");
    }

    await device.claimInterface(0);
    return new UsbTransport(device, 0);
  }

  static async openAny(): Promise<UsbTransport> {
    return this.openNth(0);
  }

  async sendRaw(raw: Uint8Array): Promise<void> {
    await this.device.transferOut(ENDPOINT_OUT, raw);
  }

  async recvRaw(timeout: number): Promise<Uint8Array> {
    const result = await this.device.transferIn(ENDPOINT_IN, 64);
    if (result.data) {
      return new Uint8Array(result.data.buffer);
    }
    throw new Error("Failed to receive data");
  }
}

// // Example usage
// (async () => {
//   try {
//     const numDevices = await UsbTransport.scanDevices();
//     console.log(`Number of devices found: ${numDevices}`);

//     if (numDevices > 0) {
//       const transport = await UsbTransport.openAny();
//       console.log("Device opened successfully");
//       // Use transport.sendRaw(...) and transport.recvRaw(...) as needed
//     }
//   } catch (error) {
//     console.error("Error:", error);
//   }
// })();
