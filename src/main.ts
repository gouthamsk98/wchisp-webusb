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
      <h1>WCH ISP Tool (only supported in chrome & edge )</h1>
      <button id="connect" type="button">Connect</button>
      <button id="getInfo" type="button">Get Info</button>
      <label for="myfile">Upload a hex:</label>
      <input type="file" id="myfile" name="myfile" accept=".hex">
      <button id="erase" type="button">Erase</button>
      <button id="flash" type="button">Flash</button>
      <button id="reset" type="button">Reset</button>
      <textarea id="console" rows="15" cols="50" readonly></textarea>
  </div>
`;

connect(document.querySelector<HTMLButtonElement>("#connect")!);
erase(document.querySelector<HTMLButtonElement>("#erase")!);
flash(document.querySelector<HTMLButtonElement>("#flash")!);
getInfo(document.querySelector<HTMLButtonElement>("#getInfo")!);
readFile(document.querySelector<HTMLInputElement>("#myfile")!);
reset(document.querySelector<HTMLButtonElement>("#reset")!);
