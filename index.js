const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const {fork} = require("child_process")
const io = new Server(server, {
  cors: {
    origin: "chrome-extension://ophmdkgfcjapomjdpfobjfbihojchbko",
    methods: ["GET", "POST"]
  }
});
const updateWorker = fork('./update.js');

let port = process.env.PORT || 3000;

io.on('connection', (socket) => {
  console.log("Connection");

  socket.on('update', () => {
    updateWorker.send([]);
  })


  updateWorker.on('message', (data) => {
    //config = message[1]
   /* console.log('CPU Information:');
    console.log('- manufacturer: ' + data.manufacturer);
    console.log('- brand: ' + data.brand);
    console.log('- speed: ' + data.speed);
    console.log('- cores: ' + data.cores);
    console.log('- physical cores: ' + data.physicalCores);
    console.log('...');*/
    //console.log(data.OS[0].cpuvendor)
    socket.emit(JSON.stringify(data.OS[0]))
})


  socket.emit('ding');

  socket.on('ding', () => {
    socket.emit('dong');
  });
});

server.listen(port, () => {
  console.log('[INFO] Listening on *:' + port);
});



