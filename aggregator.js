/**
 * 
 * 
 * Service worker used to manipulate SI data into jsonData
 * 
 * 
 */
process.on('message',  (msg) => {
    let result = msg.data
    result.CPU.clk *= 1000
    // -> move to client side 
    // result.CPU.load = Number.parseInt(result.CPU.load)
    if(result.firstrun) {
      result.OS.cpumodel = msg.data.OS.cpumodel // -> Move to client side 
                                                //.split(" ", 4).toString().replaceAll(",", " ")
      result.OS.cpuclk *= 1000
      let n = msg.data.GPU.name 
      // -> To client side | respect O(n)
      // .split(' ')
      //result.GPU.vendor = n[1] //i.e GeForce
      //result.GPU.model = n[2] //i.e. RTX
      //result.GPU.class = n[3] //i.e. 3070, 3080, 3090
      result.RAM.total = msg.data.RAM.totalU

    }


    //Round DOWN to nearest multiple of 4 GB ;)
    result.RAM.used = msg.data.RAM.totalU - msg.data.RAM.free
    /** -> move this to client side
    result.HDD.forEach(element => {
        element.size = roundDown(element.size)
        element.used = roundDown(element.used)
        element.available = roundDown(element.available)
      })*/

      let x = Date.now() - result.date
      result.date = x
      result.NET.rx_sec = (result.NET.rx_bytes - msg.prev.NET.rx_bytes) >=0 ? (result.NET.rx_bytes - msg.prev.NET.rx_bytes) / (x / 1000) : 0
      result.NET.rx_sec /= 125
      //result.NET.rx_sec = Number.parseInt(result.NET.rx_sec);
      result.NET.tx_sec = (result.NET.tx_bytes - msg.prev.NET.tx_bytes) >= 0 ? (result.NET.tx_bytes - msg.prev.NET.tx_bytes) / (x / 1000) : 0
      result.NET.tx_sec /= 125
      //result.NET.tx_sec = Number.parseInt(result.NET.tx_sec)
      result.date = Date.now()

      result.firstrun = false
      process.send(result)
})

function roundDown(x) {
    return Math.floor(Math.floor(x/1000000000)/4.0) * 4
  }