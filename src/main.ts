import "./style.css";
import { connect, erase, flash, handleUpload } from "./connection.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
      <h1>CH32 Flasher</h1>
      <button id="connect" type="button">Connect</button>
      <button id="scan" type="button">Scan</button>
      <label for="myfile">Upload a elf:</label>
      <input type="file" id="myfile" name="myfile"><br><br>
      <button id="erase" type="button">Erase</button>
      <button id="flash" type="button">Flash</button>
  </div>
`;

connect(document.querySelector<HTMLButtonElement>("#connect")!);
erase(document.querySelector<HTMLButtonElement>("#erase")!);
flash(document.querySelector<HTMLButtonElement>("#flash")!);
handleUpload(document.querySelector<HTMLInputElement>("#myfile")!);
