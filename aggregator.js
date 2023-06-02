/**
 * 
 * 
 * Service worker used to manipulate SI data into jsonData
 * 
 * 
 */
process.on('message',  (msg) => {
    let result = msg.data
    result.OS.cpumodel = msg.data.OS.cpumodel.split(" ", 3).toString().replaceAll(",", " ")
    result.CPU.clk *= 1000;
    result.OS.cpuclk *= 1000;
    result.CPU.load = Number.parseInt(result.CPU.load)
    console.log(result.CPU.load)
    let n = msg.data.GPU.name.split(' ')
    result.GPU.vendor = n[1] //i.e GeForce
    result.GPU.model = n[2] //i.e. RTX
    result.GPU.class = n[3] //i.e. 3070, 3080, 3090


    //Round DOWN to nearest multiple of 4 GB ;)
    result.RAM.total = roundDown(msg.data.RAM.total);
    result.RAM.used = roundDown(msg.data.RAM.used);

    //may move this to client side
    result.HDD.forEach(element => {
        element.size = roundDown(element.size)
        element.used = roundDown(element.used)
        element.available = roundDown(element.available)
      });

      let x = Date.now() - result.date
      result.date = x
      //result.NET.rx_sec = (result.NET.rx_bytes - msg.prev.NET.rx_bytes) / (x / 1000)
      //result.date = Date.now();
      //result.NET.tx_sec = (result.NET.tx_bytes - msg.prev.NET.tx_bytes) >= 0 ? (result.NET.tx_bytes - msg.prev.NET.tx_bytes) / (x / 1000) : 0
      
      process.send(result)
});

function roundDown(x) {
    return Math.floor(Math.floor(x/1000000000)/4.0) * 4
  }