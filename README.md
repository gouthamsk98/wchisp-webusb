# wchisp - WCH ISP Tool in WebUSB using typescript

This tool is a work in progress and a derivative of the WCH ISP Tool in Rust by wchisp. For more information, visit [wchisp](https://github.com/ch32-rs/wchisp/tree/main).

## Note for Windows

If you are using Windows, you need to install the WinUSB driver for your device. See [Zadig](https://zadig.akeo.ie/)

## Note for Linux

If you are using Linux, you need to set the udev rules for your device.

```bash
# /etc/udev/rules.d/50-wchisp.rules
SUBSYSTEM=="usb", ATTRS{idVendor}=="4348", ATTRS{idProduct}=="55e0", MODE="0666"
# or replace MODE="0666" with GROUP="plugdev" or something else
```

## Support Series

- [x] CH32V00x
- [x] CH32X03x
- [x] CH59x
- [x] CH5643

## Tested On

This tool should work on most WCH MCU chips. But I haven't tested it on any other chips.

- [x] CH32X035
- [x] CH592F-R0-1v0

## Author

[Goutham S Krishna](https://www.linkedin.com/in/goutham-s-krishna-21ab151a0/)
