const si = require('systeminformation');
const p = require('node:os'); 
const valueObject = {
  memLayout: 'clockSpeed',
  graphics: 'controllers'
}
const dValueObject = {
  cpu: 'speed',
  mem: 'used',
  graphics: 'controllers',
  fsSize: 'used, available, size',
  networkStats: 'rx_bytes, tx_bytes',
  currentLoad: 'currentLoad'
}
let result = {}
//Static data - No need to update
let a, b, c, e, f, g, h
h = p.cpus()
si.get(valueObject)
    .then(newData => {
      a = p.userInfo().username
      b = h[0].speed
      c = h[0].model
      e = p.totalmem()
      f = newData.graphics.controllers[0].name
      g = newData.memLayout[0].clockSpeed
    })

process.on('message',  (pewp) => {
    result = (pewp);
    si.get(dValueObject)
    .then(newData => {
      if (result.firstrun) {
        result.OS.user = a
        result.OS.cpumodel = c
        result.RAM.clk = g
        result.GPU.name = f
        result.RAM.total = e
      }
      result.OS.uptime = p.uptime()
      result.CPU.clk = newData.cpu.speed
      result.CPU.load = newData.currentLoad.currentLoad
      result.RAM.used = newData.mem.used

      result.GPU.clk = newData.graphics.controllers[0].clockCore
      result.GPU.temp = newData.graphics.controllers[0].temperatureGpu
      result.GPU.load = newData.graphics.controllers[0].utilizationGpu
      result.HDD = newData.fsSize
      result.NET.rx_bytes = newData.networkStats[0].rx_bytes
      result.NET.tx_bytes = newData.networkStats[0].tx_bytes
      process.send(result)
    });
});