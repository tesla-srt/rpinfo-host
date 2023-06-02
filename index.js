const { QSystemTrayIcon, QIcon } = require ('@nodegui/nodegui');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { fork } = require("child_process");
const cp = require('node:child_process');
const updateWorker = cp.fork(`${__dirname}/update.js`);
const aggregateWorker = cp.fork(`${__dirname}/aggregator.js`);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
let port = process.env.PORT || 3000;
const trayIcon = new QIcon("img/icon.png");
const tray = new QSystemTrayIcon();
tray.setIcon(trayIcon);
tray.show();
global.tray = tray;
tray.addEventListener('activated', terminate);

var jsonData = {
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
    },
  "GPU": 
    {
      "vendor": "",
      "model": "",
      "class": "",
      "temp": "00",
      "load": "00",
      "clk": "00"
    }
  ,
  "RAM": 
    {
      "used": "00",
      "total": "",
      "load": "00",
      "clk": "00"
    },
  "HDD": [],
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
jsonData.date = 0

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

let r = {}
io.on('connection', (socket) => {
  socket.on('update', () => {
    updateWorker.send(jsonData);
    socket.emit('sysinfo', jsonData)
  })
  aggregateWorker.on('message', data => {
    jsonData = data;
  })
});
updateWorker.on('message', data => {
  r = {'prev': jsonData, 'data': data}
  aggregateWorker.send(r)
})
server.listen(port);

//Terminate
function terminate() {
  tray.delete();
  global.tray = null;
  updateWorker.kill();
  process.exit(1);
}
