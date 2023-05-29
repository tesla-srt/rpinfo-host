const { QSystemTrayIcon, QIcon } = require ('@nodegui/nodegui');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { fork } = require("child_process");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const updateWorker = fork('./update.js');
let port = process.env.PORT || 3000;
const trayIcon = new QIcon("img/icon.png");
const tray = new QSystemTrayIcon();
var jsonData = {
  "CPU": [
    {
      "temp": "00",
      "load": "00",
      "clk": "00"
    }
  ],
  "OS": [
    {
      "user": "",
      "uptime": "00:00:00",
      "cpumodel": "",
      "cpuclk": "",
      "cpuvendor": ""
    }
  ],
  "GPU": [
    {
      "vendor": "Geforce",
      "model": "RTX",
      "class": "3090",
      "temp": "00",
      "load": "00",
      "clk": "00"
    }
  ],
  "RAM": [
    {
      "used": "00",
      "total": "",
      "load": "00",
      "clk": "00"
    },
    {
      "used": "00",
      "total": "32",
      "load": "00",
      "clk": "00"
    }
  ],
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
}]
}
tray.setIcon(trayIcon);
tray.show();
global.tray = tray;
tray.addEventListener('activated', terminate);

io.on('connection', (socket) => {
  //console.log("Connection");
  updateWorker.send(jsonData);

  socket.on('update', () => {
    updateWorker.send(jsonData);
  })


  updateWorker.on('message', (data) => {
    //aggregator.send(data, jsonData)
    socket.emit('sysinfo', data);
  })
  //aggrigtor.on('message') => socket.emit(msg)

});

server.listen(port, () => {
  console.log('[INFO] Listening on *:' + port);
});

//Terminate
function terminate() {
  tray.delete();
  global.tray = null;
  updateWorker.kill();
  process.exit(1);
}
