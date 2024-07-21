import "./style.css";
import { connect, erase, flash, handleUpload, getInfo } from "./connection.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
      <h1>WCH ISP Tool </h1>
      <button id="connect" type="button">Connect</button>
      <button id="getInfo" type="button">Get Info</button>
      <label for="myfile">Upload a elf:</label>
      <input type="file" id="myfile" name="myfile"><br><br>
      <button id="erase" type="button">Erase</button>
      <button id="flash" type="button">Flash</button>
      <textarea id="console" rows="15" cols="50" readonly></textarea>
  </div>
`;

connect(document.querySelector<HTMLButtonElement>("#connect")!);
erase(document.querySelector<HTMLButtonElement>("#erase")!);
flash(document.querySelector<HTMLButtonElement>("#flash")!);
handleUpload(document.querySelector<HTMLInputElement>("#myfile")!);
getInfo(document.querySelector<HTMLButtonElement>("#getInfo")!);
