const { fork } = require("child_process");
//const updateWorker = fork('./update.js');

var si = require('systeminformation');
const valueObject = {
    cpu: 'manufacturer, brand, speedMax',
    users: '*',
    memLayout: 'clockSpeed',
    mem: 'total, used',
    graphics: 'controllers',
    fsSize: 'size, used, available',
    networkStats: 'rx_bytes, tx_bytes, ms',
    time: 'uptime',
    currentLoad: 'currentLoad'
  }
si.get(valueObject).then(data => {
    //updateWorker.send(data)
    let z = Number.parseFloat(data.currentLoad.currentLoad).toFixed(1)
    console.log(z)
})

  var result = {
    "CPU":
      {
        "temp": "00",
        "load": "00",
        "clk": "00"
      },
    "OS":
      {
        "user": "",
        "uptime": "00:00:00",
        "cpumodel": "",
        "cpuclk": "",
        "cpuvendor": ""
      }
    ,
    "GPU": 
      {
        "vendor": "Geforce",
        "model": "RTX",
        "class": "3090",
        "temp": "00",
        "load": "00",
        "clk": "00"
      },
    "RAM":
      {
        "used": "00",
        "total": "32",
        "load": "00",
        "clk": "00"
      },
    "HDD": [
      {
        "fs": "C:",
        "used": "0.00",
        "size": "0.00"
      },
      {
        "fs": "D:",
        "used": "0.00",
        "size": "0.00"
      },
      {
        "fs": "G:",
        "used": "0.00",
        "size": "0.00"
      }
    ],
    "IO": [{
      "read": "",
      "write": ""
    },
    {
      "read": "",
      "write": ""
    }
  ],
    "NET":
      {
        "iface": "name",
        "rx_bytes": 0,
        "tx_bytes": 0,
        "rx_sec": 0,
        "tx_sec": 0,
        "ms": 0
      }
  } 
  /*
      result.OS.user = newData.users[0].user;
      result.OS.cpuclk = newData.speedMax * 1000;
      result.OS.cpumodel = newData.brand.split(" ", 3).toString().replaceAll(",", " ");
      result.OS.cpuvendor = newData.manufacturer;
      result.OS.uptime = newData.time.uptime;
      result.CPU.load = newData.time.uptime;
      result.RAM.total = newData.mem.total;
      result.RAM.used = newData.mem.used;
      result.RAM.clk = newData.memLayout[0].clockSpeed;
      result.GPU = newData.graphics;
      result.HDD = newData.fsSize;
      result.NET.rx_bytes = newData.networkStats.rx_bytes;
      result.NET.tx_bytes = newData.networkStats.tx_bytes;
      result.NET.ms = newData.networkStats.ms;
      result.date = Date.now();
      */