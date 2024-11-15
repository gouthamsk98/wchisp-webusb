import { CH_loader } from "./flasher/ch_loader";
let connection = false;
let loader: CH_loader;
let fileContent: string;
const filters = [
  { vendorId: 0x4348, productId: 0x55e0 },
  { vendorId: 0x1a86, productId: 0x55e0 },
];
// (() => {
//   const command: Command = { type: "Identify", deviceId: 0, deviceType: 0 };
//   protocol.ntoRaw(command).then((raw) => {
//     console.log(raw);
//   });
//   const command2: Command = {
//     type: "ReadConfig",
//     bitMask: CH_loader.CFG_MASK_ALL,
//   };
//   protocol.ntoRaw(command2).then((raw) => {
//     console.log(raw);
//   });
// })();
export function connect(element: HTMLButtonElement) {
  element.addEventListener("click", () => {
    navigator.usb
      .requestDevice({ filters: filters })
      .then(async (device) => {
        loader = new CH_loader(device);
        CH_loader.openNth(0);
        CH_loader.debugLog("Connected");
        connection = !connection;
        element.innerHTML = `Disconnect`;
      })
      .catch((error) => {
        console.error(error);
        element.innerHTML = `Connect`;
      });
  });
}
export function getInfo(element: HTMLButtonElement) {
  element.addEventListener("click", async () => {
    if (!connection) {
      CH_loader.debugLog("Please Connect First");
      return;
    }
    if (!loader) {
      CH_loader.debugLog("Something went wrong");
      return;
    }
    try {
      await loader.findDevice();
    } catch (e) {
      CH_loader.debugLog(e as string);
    }
  });
}

export function erase(element: HTMLButtonElement) {
  element.addEventListener("click", async () => {
    if (!connection) {
      CH_loader.debugLog("Please Connect First");
      return;
    }
    element.innerHTML = `Erasing...`;
    await loader.eraseFlash();
    element.innerHTML = `Erase`;
  });
}
export function flash(element: HTMLButtonElement) {
  element.addEventListener("click", async () => {
    if (!connection) {
      CH_loader.debugLog("Please Connect First");
      return;
    }
    element.innerHTML = `Flashing...`;
    await loader.flashFirmware(fileContent);
    element.innerHTML = `Flash`;
  });
}
export function reset(element: HTMLButtonElement) {
  element.addEventListener("click", async () => {
    if (!connection) {
      CH_loader.debugLog("Please Connect First");
      return;
    }
    element.innerHTML = `Resetting...`;
    await loader.reset();
    element.innerHTML = `Reset`;
  });
}
function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file, "utf-8");
  });
}
export function readFile(element: HTMLInputElement) {
  element.addEventListener("change", async (event) => {
    const file = (event.target as HTMLInputElement).files![0];
    if (file && file.name.endsWith(".hex")) {
      fileContent = await readFileAsText(file);
      console.log(fileContent);
    } else {
      alert("Please upload a valid .hex file");
    }
  });
}
