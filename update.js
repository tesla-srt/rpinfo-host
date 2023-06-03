const si = require('systeminformation');
const valueObject = {
  cpu: 'manufacturer, brand, speedMax',
  users: '*',
  memLayout: 'clockSpeed',
  mem: 'total',
  graphics: 'controllers'
}

const dValueObject = {
  cpu: 'speed',
  mem: 'used',
  graphics: 'controllers',
  fsSize: 'used, available, size',
  networkStats: 'rx_bytes, tx_bytes',
  time: 'uptime',
  currentLoad: 'currentLoad'
}
//Static data - No need to update
let a, b, c, d, e, f, g
si.get(valueObject)
    .then(newData => {
      a = newData.users[0].user
      b = newData.cpu.speedMax
      c = newData.cpu.brand
      d = newData.cpu.manufacturer
      e = newData.mem.total
      f = newData.graphics.controllers[0].name
      g = newData.memLayout[0].clockSpeed
    })

process.on('message',  (pewp) => {
    let result = (pewp);
    si.get(dValueObject)
    .then(newData => {
      result.OS.user = a
      result.OS.cpuclk = b
      result.OS.cpumodel = c
      result.OS.cpuvendor = d
      result.OS.uptime = newData.time.uptime
      result.CPU.clk = newData.cpu.speed
      result.CPU.load = newData.currentLoad.currentLoad
      result.RAM.total = e
      result.RAM.used = newData.mem.used
      result.RAM.clk = g
      result.GPU.name = f
      result.GPU.clk = newData.graphics.controllers[0].clockCore
      result.GPU.temp = newData.graphics.controllers[0].temperatureGpu
      result.GPU.load = newData.graphics.controllers[0].utilizationGpu
      result.HDD = newData.fsSize
      result.NET.rx_bytes = newData.networkStats[0].rx_bytes
      result.NET.tx_bytes = newData.networkStats[0].tx_bytes
      process.send(result)
  })
});