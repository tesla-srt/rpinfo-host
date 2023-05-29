const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { fork, execSync } = require("child_process")
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

var gui = require('nw.gui');
// Create a tray icon
let tray = new gui.Tray({
  title: 'HWMon',
  tooltip: 'Nick\'s HW Monitoring App!',
  icon: 'img/icon.png'
});
tray.on('click', function() {
  //App.closeAllWindows();
  //App.quit();
  terminate();
});

function terminate() {
  tray.remove();
  tray = null;
  updateWorker.kill()
  execSync(cmd0);
  //gui.App.closeAllWindows();
  //gui.App.quit();
  //gui.process.exit(1);
  //process.exit(1);
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

  socket.emit('ding');

  socket.on('ding', () => {
    socket.emit('dong');
  });
});

server.listen(port, () => {
  console.log('[INFO] Listening on *:' + port);
});



