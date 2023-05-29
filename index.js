const { QSystemTrayIcon, QIcon } = require ('@nodegui/nodegui');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { fork, execSync } = require("child_process");
const { resolve } = require("path");
const io = new Server(server, {
  cors: {
    //origin: "chrome-extension://ophmdkgfcjapomjdpfobjfbihojchbko",
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const updateWorker = fork('./update.js');
const cmd0 = 'taskkill /f /im eggplant.exe';

let port = process.env.PORT || 3000;

const trayIcon = new QIcon("img/icon.png");
const tray = new QSystemTrayIcon();
tray.setIcon(trayIcon);
tray.show();

global.tray = tray; // prevents garbage collection of tray
tray.addEventListener('activated', terminate);


function terminate() {
  tray.delete();
  global.tray = null;
  updateWorker.kill();
  process.exit(1);
}



io.on('connection', (socket) => {
  console.log("Connection");
  updateWorker.send([]);

  socket.on('update', () => {
    updateWorker.send([]);
  })


  updateWorker.on('message', (data) => {
    //let a = JSON.stringify(data.RAM[0].clk);
    socket.emit('sysinfo', data);
  })
});

server.listen(port, () => {
  console.log('[INFO] Listening on *:' + port);
});



