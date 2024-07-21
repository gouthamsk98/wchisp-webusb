import { CH_loader } from "./flasher/loader";
let connection = false;
let loader: CH_loader;
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
        loader = new CH_loader(device, 0);
        CH_loader.openNth(0);
        // console.log();
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
      alert("Please Connect First");
      return;
    }
    if (!loader) {
      alert("Something went wrong");
      return;
    }
    await loader.findDevice();
  });
}

export function erase(element: HTMLButtonElement) {
  element.addEventListener("click", () => {
    if (!connection) {
      alert("Please Connect First");
      return;
    }
    element.innerHTML = `Erasing...`;
  });
}
export function flash(element: HTMLButtonElement) {
  element.addEventListener("click", () => {
    if (!connection) {
      alert("Please Connect First");
      return;
    }
    element.innerHTML = `Flashing...`;
  });
}
export function handleUpload(element: HTMLInputElement) {
  element.addEventListener("change", () => {
    const file = element.files![0];
    console.log(file);
  });
}
