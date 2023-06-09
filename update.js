const si = require('systeminformation')
const p = require('node:os')
const valueObject = {
  memLayout: 'clockSpeed',
}
const dValueObject = {
  cpu: 'speed',
  graphics: 'controllers',
  fsSize: 'used, available, size',
  networkStats: 'rx_bytes, tx_bytes',
  currentLoad: 'currentLoad'
}
let result = {}
//Static data - No need to update
let a, b, c, e, f, g, h
h = p.cpus()
e = p.totalmem()
a = p.userInfo().username
b = h[0].speed
c = h[0].model

si.get(valueObject)
    .then(newData => {
      g = newData.memLayout[0].clockSpeed
    })

process.on('message',  (pewp) => {
    result = (pewp)
    si.get(dValueObject)
    .then(newData => {
      if (result.firstrun) {
        result.OS.user = a
        result.OS.cpumodel = c
        result.RAM.clk = g
        f = newData.graphics.controllers[0].name
        result.GPU.name = f
        result.RAM.totalU = e
      }
      result.OS.uptime = p.uptime()
      result.CPU.clk = newData.cpu.speed
      result.CPU.load = newData.currentLoad.currentLoad
      result.RAM.free = p.freemem()
      result.GPU.clk = newData.graphics.controllers[0].clockCore
      result.GPU.temp = newData.graphics.controllers[0].temperatureGpu
      result.GPU.load = newData.graphics.controllers[0].utilizationGpu
      result.HDD = newData.fsSize
      result.NET.rx_bytes = newData.networkStats[0].rx_bytes
      result.NET.tx_bytes = newData.networkStats[0].tx_bytes
      process.send(result)
    })
})