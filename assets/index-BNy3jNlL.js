var A=Object.defineProperty;var R=(o,n,r)=>n in o?A(o,n,{enumerable:!0,configurable:!0,writable:!0,value:r}):o[n]=r;var a=(o,n,r)=>R(o,typeof n!="symbol"?n+"":n,r);(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))e(t);new MutationObserver(t=>{for(const i of t)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&e(s)}).observe(document,{childList:!0,subtree:!0});function r(t){const i={};return t.integrity&&(i.integrity=t.integrity),t.referrerPolicy&&(i.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?i.credentials="include":t.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function e(t){if(t.ep)return;t.ep=!0;const i=r(t);fetch(t.href,i)}})();class I{static responseToString(n){switch(n.type){case"Ok":return`OK[${Buffer.from(n.data).toString("hex")}]`;case"Err":return`ERROR(${n.code.toString(16)})[${Buffer.from(n.data).toString("hex")}]`}}static isOk(n){return n.type==="Ok"}static payload(n){return n.type==="Ok",n.data}static fromRaw(n){const r=new DataView(n.buffer).getUint16(2,!0),e=n.subarray(4);return e.length===r?{type:"Ok",data:e}:{type:"Err",code:n[1],data:n.subarray(2)}}}const l=class l{constructor(n){a(this,"device");this.device=n}static debugLog(n){const r=document.querySelector("#console");r.value+=n+`
`,r.scrollTop=r.scrollHeight}static clearLog(){const n=document.querySelector("#console");n.value=""}static async scanDevices(){const n=[{vendorId:17224,productId:21984},{vendorId:6790,productId:21984}],e=(await navigator.usb.getDevices()).filter(t=>n.some(i=>t.vendorId===i.vendorId&&t.productId===i.productId));return console.debug(`Found ${e.length} WCH ISP USB devices`),e.length}static async openNth(n){const e=(await navigator.usb.getDevices())[n];if(!e)throw new Error(`No WCH ISP USB device found (4348:55e0 or 1a86:55e0 device not found at index #${n})`);console.debug(`Found USB Device ${e.productName}`),await e.open(),e.configuration===null&&await e.selectConfiguration(1);const t=e.configuration;let i=!1,s=!1;if(t){console.log("config",t);for(const d of t.interfaces){console.log(d);for(const u of d.alternate.endpoints)u.endpointNumber===this.ENDPOINT_OUT&&(i=!0),u.endpointNumber===this.ENDPOINT_IN&&(s=!0)}}if(!(i&&s))throw new Error("USB Endpoints not found");return await e.claimInterface(0),new l(e)}static async openAny(){return this.openNth(0)}async sendRaw(n){await this.device.transferOut(l.ENDPOINT_OUT,n)}async recvRaw(){const n=await this.device.transferIn(l.ENDPOINT_IN,64);if(n.data)return new Uint8Array(n.data.buffer);throw new Error("Failed to receive data")}async recv(){const n=await this.device.transferIn(l.ENDPOINT_IN,64);if(n.data)return I.fromRaw(new Uint8Array(n.data.buffer));throw new Error("Failed to receive data")}};a(l,"ENDPOINT_OUT",2),a(l,"ENDPOINT_IN",2),a(l,"USB_TIMEOUT_MS",5e3),a(l,"MAX_PACKET_SIZE",64),a(l,"SECTOR_SIZE",1024),a(l,"DEFAULT_TRANSPORT_TIMEOUT_MS",1e3);let S=l;class D{constructor(){a(this,"IDENTIFY",161);a(this,"ISP_END",162);a(this,"ISP_KEY",163);a(this,"ERASE",164);a(this,"PROGRAM",165);a(this,"VERIFY",166);a(this,"READ_CONFIG",167);a(this,"WRITE_CONFIG",168);a(this,"DATA_ERASE",169);a(this,"DATA_PROGRAM",170);a(this,"DATA_READ",171);a(this,"WRITE_OTP",195);a(this,"READ_OTP",196);a(this,"SET_BAUD",197)}async pwriteWith(n,r,e,t){if(typeof r=="number")n.setUint32(e,r,t);else for(let i=0;i<r.length;i++)n.setUint8(e+i,r[i]);return n}async ntoRaw(n){switch(n.type){case"Identify":{const{deviceId:r,deviceType:e}=n,t=new Uint8Array(21);return t[0]=this.IDENTIFY,t[1]=18,t[2]=0,t[3]=r,t[4]=e,t.set(new TextEncoder().encode("MCU ISP & WCH.CN"),5),t}case"IspEnd":{const{reason:r}=n;return new Uint8Array([this.ISP_END,1,0,r])}case"IspKey":{const{key:r}=n,e=new Uint8Array(3+r.length);return e[0]=this.ISP_KEY,e[1]=r.length,e[2]=0,e.set(r,3),e}case"Erase":{const{sectors:r}=n,e=new Uint8Array(7);return e[0]=this.ERASE,e[1]=4,e[2]=0,this.pwriteWith(new DataView(e.buffer),r,3,!0),e}case"Program":{const{address:r,padding:e,data:t}=n,i=new Uint8Array(8+t.length),s=new DataView(i.buffer);s.setUint8(0,this.PROGRAM),s.setUint32(3,r,!0),s.setUint8(7,e),i.set(t,8);const d=i.length-3;return s.setUint16(1,d,!0),new Uint8Array(s.buffer)}case"Verify":{const{address:r,padding:e,data:t}=n,i=new Uint8Array(8+t.length);i[0]=this.VERIFY,this.pwriteWith(new DataView(i.buffer),r,3,!0),i[7]=e,i.set(t,8);const s=i.length-3;return this.pwriteWith(new DataView(i.buffer),s,1,!0),i}case"ReadConfig":{const{bitMask:r}=n;return new Uint8Array([this.READ_CONFIG,2,0,r,0])}case"WriteConfig":{const{bitMask:r,data:e}=n,t=new Uint8Array(5+e.length);return t[0]=this.WRITE_CONFIG,this.pwriteWith(new DataView(t.buffer),1+e.length,1,!0),t[3]=r,t.set(e,5),t}case"DataRead":{const{address:r,len:e}=n,t=new Uint8Array(9);return t[0]=this.DATA_READ,t[1]=6,this.pwriteWith(new DataView(t.buffer),r,3,!0),this.pwriteWith(new DataView(t.buffer),e,7,!0),t}case"DataProgram":{const{address:r,padding:e,data:t}=n,i=new Uint8Array(8+t.length);i[0]=this.DATA_PROGRAM,this.pwriteWith(new DataView(i.buffer),r,3,!0),i[7]=e,i.set(t,8);const s=i.length-3;return this.pwriteWith(new DataView(i.buffer),s,1,!0),i}case"DataErase":{const{sectors:r}=n;return new Uint8Array([this.DATA_ERASE,5,0,0,0,0,0,r])}default:throw new Error("Unimplemented command")}}}const v="CH32X03x Series",T="0x13",F="0x23",P=!1,C=!0,L=!0,U="CH32X03x RISC-V4C Series",x=[{offset:"0x00",name:"RDPR_USER",description:"RDPR, nRDPR, USER, nUSER",reset:"0xFFFF5AA5",fields:[{bit_range:[7,0],name:"RDPR",description:"Read Protection. 0xA5 for unprotected, otherwise read-protected(ignoring WRP)",explaination:{"0xa5":"Unprotected",_:"Protected"}},{bit_range:[16,16],name:"IWDG_SW",description:"Independent watchdog (IWDG) hardware enable",explaination:{0:"IWDG enabled by the software (decided along with the LSI clock)",1:"IWDG enabled by the software, and disabled by hardware"}},{bit_range:[17,17],name:"STOP_RST",description:"System reset control under the stop mode",explaination:{0:"Enable",1:"Disable"}},{bit_range:[18,18],name:"STANDBY_RST",description:"System reset control under the standby mode, STANDY_RST",explaination:{0:"Enable",1:"Disable, entering standby-mode without RST"}},{bit_range:[20,19],name:"RST_MOD",description:"Reset mode",explaination:{"0b00":"Enable RST alternative function","0b11":"Disable RST alternative function, use PA21/PC3/PB7 as GPIO",_:"Error"}}]},{offset:"0x04",name:"DATA",description:"Customizable 2 byte data, DATA0, nDATA0, DATA1, nDATA1",reset:"0xFF00FF00",type:"u32",fields:[{bit_range:[7,0],name:"DATA0"},{bit_range:[23,16],name:"DATA1"}]},{offset:"0x08",name:"WRP",description:"Flash memory write protection status",type:"u32",reset:"0xFFFFFFFF",explaination:{"0xFFFFFFFF":"Unprotected",_:"Some 4K sections are protected"}}],O=[{name:"CH32X035R8T6",chip_id:80,flash_size:65536},{name:"CH32X035C8T6",chip_id:81,flash_size:65536},{name:"CH32X035F8U6",chip_id:94,flash_size:65536},{name:"CH32X035G8U6",chip_id:86,flash_size:65536},{name:"CH32X035G8R6",chip_id:91,flash_size:65536},{name:"CH32X035F7P6",chip_id:87,flash_size:49152}],_={name:v,mcu_type:T,device_type:F,support_net:P,support_usb:C,support_serial:L,description:U,config_registers:x,variants:O},c=class c extends S{constructor(r){super(r);a(this,"SECTOR_SIZE",1024);a(this,"device_type",null);a(this,"chip_id",null);a(this,"chip_uid",new Uint8Array(8));a(this,"code_flash_protected",null);a(this,"btver",new Uint8Array(4));a(this,"flash_size",null);a(this,"protocol",new D)}supportCodeFlashProtect(){return this.device_type?[20,21,23,24,25,32].includes(this.device_type):!1}minEraseSectorNumber(){return this.device_type===16?4:8}xorKey(){if(this.chip_id==null)throw new Error("Chip ID not found");const r=this.chip_uid.reduce((t,i)=>t+i,0)&255,e=new Uint8Array(8).fill(r);return e[7]=e[7]+this.chip_id&255,e}async findDevice(){c.clearLog();const r={type:"Identify",deviceId:0,deviceType:0},e=await this.protocol.ntoRaw(r);this.sendRaw(e);const t=await this.recv();if(t.type=="Err")throw new Error("Error in finding device");this.device_type=t.data[1],this.chip_id=t.data[0],_.device_type=="0x"+this.device_type.toString(16)&&c.debugLog("Device Series : "+_.name),_.variants.forEach(u=>{u.chip_id==this.chip_id&&(this.flash_size=u.flash_size,c.debugLog("Chip : "+u.name),c.debugLog("Flash Size : "+u.flash_size/1024+" KiB"))});const i={type:"ReadConfig",bitMask:c.CFG_MASK_ALL},s=await this.protocol.ntoRaw(i);this.sendRaw(s);const d=await this.recv();if(d.type=="Err")throw new Error("Error in finding config");this.code_flash_protected=this.supportCodeFlashProtect()&&d.data[2]!=165,c.debugLog("Code Flash Protected : "+this.code_flash_protected),this.btver.set(d.data.slice(14,18)),c.debugLog("Bootloader Version (BTVER) : "+this.btver[0]+this.btver[1]+"."+this.btver[2]+this.btver[3]),this.chip_uid.set(d.data.slice(18)),c.debugLog("Chip UID : "+Array.from(this.chip_uid).map(u=>u.toString(16).padStart(2,"0").toUpperCase()).join("-")),this.dumpInfo(d)}async dumpInfo(r){const e=r.data.slice(2);_.config_registers.forEach(t=>{let i=new DataView(e.buffer,e.byteOffset+Number(t.offset),4).getUint32(0,!0);c.debugLog(t.name+" : 0x"+i.toString(16)),t.fields&&t.fields.forEach(s=>{let d=s.bit_range[0]-s.bit_range[1]+1,u=i>>>s.bit_range[1]&(1<<d)-1;if(c.debugLog(`[${s.bit_range[0]}, ${s.bit_range[1]}] ${s.name}  0x${u.toString(16)} (0b${u.toString(2)})`),"explaination"in s&&s.explaination)for(const[f,p]of Object.entries(s.explaination))u==Number(f)&&c.debugLog(` - ${p}`)})})}async eraseFlash(r=this.flash_size){if(this.flash_size||(await this.findDevice(),r=this.flash_size),!r)throw new Error("Flash size not found");let e=r/1024;const t=this.minEraseSectorNumber();e<t&&(e=t,c.debugLog(`erase_code: set min number of erased sectors to ${e}`));const i={type:"Erase",sectors:e},s=await this.protocol.ntoRaw(i);this.sendRaw(s),console.log(s);const d=await this.recv();if(console.log(d),d.type=="Err")throw new Error("Error in erasing flash");c.debugLog(`Erased ${e} code flash sectors`)}async flashChunk(r,e,t){const i=e.map((p,b)=>p^t[b%8]),s=Math.floor(Math.random()*256),d={type:"Program",address:r,padding:s,data:i},u=await this.protocol.ntoRaw(d);if(this.sendRaw(u),(await this.recv()).type=="Err")throw new Error(`Program 0x${r.toString(16).padStart(8,"0")} failed`);c.debugLog("Programmed 0x"+r.toString(16).padStart(8,"0"))}intelHexToUint8Array(r){const e=r.trim().split(`
`),t=[];return e.forEach(i=>{if(i.startsWith(":")){const s=parseInt(i.substr(1,2),16),d=9,u=d+s*2;for(let f=d;f<u;f+=2)t.push(parseInt(i.substr(f,2),16))}}),new Uint8Array(t)}async flashFirmware(r){const e=this.intelHexToUint8Array(r),t=e.length/this.SECTOR_SIZE+1;!this.chip_id&&!this.chip_uid&&await this.findDevice(),await this.eraseFlash(t);const i=this.xorKey(),s=i.reduce((g,E)=>g+E&255,0);console.log("key ",i,s);const d={type:"IspKey",key:new Uint8Array(30)},u=await this.protocol.ntoRaw(d);this.sendRaw(u);const f=await this.recv();if(f.type=="Err")throw new Error("isp_key failede");if(f.data[0]!=s)throw new Error("isp_key checksum failed");console.log("res data",f.data);const p=56;let b=0;for(let g=0;g<e.length;g+=p){const E=e.subarray(g,g+p);await this.flashChunk(b,E,i),b+=E.length}await this.flashChunk(b,new Uint8Array,i),c.debugLog("firmware flashed")}async reset(){const r={type:"IspEnd",reason:1},e=await this.protocol.ntoRaw(r);if(this.sendRaw(e),(await this.recv()).type=="Err")throw new Error("Error in reset");c.debugLog("Device Reset")}};a(c,"CFG_MASK_RDPR_USER_DATA_WPR",7),a(c,"CFG_MASK_BTVER",8),a(c,"CFG_MASK_UID",16),a(c,"CFG_MASK_CODE_FLASH_PROTECT",32),a(c,"CFG_MASK_ALL",31);let h=c,w=!1,y,m;const N=[{vendorId:17224,productId:21984},{vendorId:6790,productId:21984}];function M(o){o.addEventListener("click",()=>{navigator.usb.requestDevice({filters:N}).then(async n=>{y=new h(n),h.openNth(0),h.debugLog("Connected"),w=!w,o.innerHTML="Disconnect"}).catch(n=>{console.error(n),o.innerHTML="Connect"})})}function W(o){o.addEventListener("click",async()=>{if(!w){h.debugLog("Please Connect First");return}if(!y){h.debugLog("Something went wrong");return}try{await y.findDevice()}catch(n){h.debugLog(n)}})}function k(o){o.addEventListener("click",async()=>{if(!w){h.debugLog("Please Connect First");return}o.innerHTML="Erasing...",await y.eraseFlash(),o.innerHTML="Erase"})}function G(o){o.addEventListener("click",async()=>{if(!w){h.debugLog("Please Connect First");return}o.innerHTML="Flashing...",await y.flashFirmware(m),o.innerHTML="Flash"})}function H(o){o.addEventListener("click",async()=>{if(!w){h.debugLog("Please Connect First");return}o.innerHTML="Resetting...",await y.reset(),o.innerHTML="Reset"})}function V(o){return new Promise((n,r)=>{const e=new FileReader;e.onload=()=>n(e.result),e.onerror=r,e.readAsText(o)})}function K(o){o.addEventListener("change",async n=>{const r=n.target.files[0];r&&r.name.endsWith(".hex")?(m=await V(r),console.log(m)):alert("Please upload a valid .hex file")})}document.querySelector("#app").innerHTML=`
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
`;M(document.querySelector("#connect"));k(document.querySelector("#erase"));G(document.querySelector("#flash"));W(document.querySelector("#getInfo"));K(document.querySelector("#myfile"));H(document.querySelector("#reset"));
