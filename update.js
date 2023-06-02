const si = require('systeminformation');
const valueObject = {
  cpu: 'manufacturer, brand, speedMax, speed',
  users: '*',
  memLayout: 'clockSpeed',
  mem: 'total, used',
  graphics: 'controllers',
  fsSize: 'size, used, available',
  networkStats: 'rx_bytes, tx_bytes, ms',
  time: 'uptime',
  currentLoad: 'currentLoad'
}
process.on('message',  (a) => {
     let result = (a);
    si.get(valueObject).then(newData => {
    result.OS.user = newData.users[0].user;
    result.OS.cpuclk = newData.cpu.speedMax;
    result.OS.cpumodel = newData.cpu.brand;
    result.OS.cpuvendor = newData.cpu.manufacturer;
    result.OS.uptime = newData.time.uptime;
    result.CPU.clk = newData.cpu.speed;  
    result.CPU.load = newData.currentLoad.currentLoad;
    result.RAM.total = newData.mem.total;
    result.RAM.used = newData.mem.used;
    result.RAM.clk = newData.memLayout[0].clockSpeed;
    result.GPU.name = newData.graphics.controllers[0].name
    result.GPU.clk = newData.graphics.controllers[0].clockCore
    result.GPU.temp = newData.graphics.controllers[0].temperatureGpu
    result.GPU.load = newData.graphics.controllers[0].utilizationGpu
    result.HDD = newData.fsSize;
    result.NET.rx_bytes = newData.networkStats[0].rx_bytes;
    result.NET.tx_bytes = newData.networkStats[0].tx_bytes;
    result.NET.ms = newData.networkStats.ms;
    process.send(result);
  })
});