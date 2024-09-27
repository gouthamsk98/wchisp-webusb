import "./style.css";
import {
  connect,
  erase,
  flash,
  getInfo,
  readFile,
  reset,
} from "./connection.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
      <h1>WCH ISP Web Tool</h1>
      <h3>Suported Series: CH32V00x, CH32X03x, CH59x, CH5643</h3>
      <h4>Supported Browsers: Chrome, Edge</h4>
      <button id="connect" type="button">Connect</button>
      <button id="getInfo" type="button">Get Info</button>
      <label for="myfile">Upload a hex:</label>
      <input type="file" id="myfile" name="myfile" accept=".hex">
      <button id="erase" type="button">Erase</button>
      <button id="flash" type="button">Flash</button>
      <button id="reset" type="button">Reset</button>
      <textarea id="console" rows="15" cols="50" readonly></textarea>
      <p>Note : If you are using Windows, you need to install the WinUSB driver for your device
      <a href="https://zadig.akeo.ie/">see Zadig</a>
      </p>
  </div>
`;

connect(document.querySelector<HTMLButtonElement>("#connect")!);
erase(document.querySelector<HTMLButtonElement>("#erase")!);
flash(document.querySelector<HTMLButtonElement>("#flash")!);
getInfo(document.querySelector<HTMLButtonElement>("#getInfo")!);
readFile(document.querySelector<HTMLInputElement>("#myfile")!);
reset(document.querySelector<HTMLButtonElement>("#reset")!);
