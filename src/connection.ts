import { UsbTransport } from "./flasher/transport";
let connection = false;
const filters = [
  { vendorId: 0x4348, productId: 0x55e0 },
  { vendorId: 0x1a86, productId: 0x55e0 },
];
export function connect(element: HTMLButtonElement) {
  element.addEventListener("click", () => {
    navigator.usb
      .requestDevice({ filters: filters })
      .then(async (device) => {
        const transport = new UsbTransport(device, 0);
        UsbTransport.openNth(0);
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
export function scan(element: HTMLButtonElement) {
  element.addEventListener("click", () => {});
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
