let connection = false;
export function connect(element: HTMLButtonElement) {
  element.addEventListener("click", () => {
    navigator.usb
      .requestDevice({ filters: [{ vendorId: 0x1a86 }] })
      .then((device) => {
        console.log(device);
        connection = !connection;
        element.innerHTML = `Disconnect`;
      })
      .catch((error) => {
        console.error(error);
        element.innerHTML = `Connect`;
      });
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
