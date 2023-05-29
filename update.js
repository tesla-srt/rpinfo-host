var a = "";
process.on('message',  (msg, si) => {
       let m = (msg);
    
    //User   
    si.users(function(data) {
        (m.OS[0].user) = (data[0].user);
    });

    //CPU Temp | Not working 
    //si.cpuTemperature().then(data => console.log(data));
    si.cpuTemperature().then(data => m.CPU[0].temp = data.main);

    //CPU Model + MFG + CLK
    si.cpu(function(data) {
        m.OS[0].cpuvendor = data.manufacturer;
        m.OS[0].cpumodel = data.brand.split(" ", 3).toString().replaceAll(",", " ");
        m.OS[0].cpuclk = data.speedMax * 1000;
    })

    //UPTIME
    si.time(function(data) {
        m.OS[0].uptime = data.uptime;
    })
    m.OS[0].uptime = si.time().uptime;

    //CPU LOAD
    si.currentLoad().then(data => m.CPU[0].load = data.currentLoad);

    //RAM
    si.mem().then(data => {
      let a = 0.0;
      let b = 0.0;
      //Round DOWN to nearest multiple of 4 GB ;)
      a = roundDown(data.total);
      b = roundDown(data.used);
      m.RAM[0].total = a;
      m.RAM[0].used = b;
      //RAM Percent used/total
      m.RAM[0].load = (b/a)*100;
    });

    //RAM Clk
    si.memLayout().then(data => {
      m.RAM[0].clk = data[0].clockSpeed;
    });

    //GPU
    si.graphics().then(data => {
      let a = data.controllers[0]
      //Temp
      let t = a.temperatureGpu
      //Load
      let u = a.utilizationGpu
      //Clk
      let c = a.clockCore
      //Model
      let n = a.name.split(' ');
      //n = n[1] + " " + n[2] + " " + n[3]

      m.GPU[0].clk = c
      m.GPU[0].temp = t
      m.GPU[0].load = u
      m.GPU[0].vendor = n[1] //i.e GeForce
      m.GPU[0].model = n[2] //i.e. RTX
      m.GPU[0].class = n[3] //i.e. 3070, 3080, 3090

      
    });


    //Filesystem Info
    si.fsSize().then(data => {
      m.HDD = (data)
      m.HDD.forEach(element => {
        element.size = roundDown(element.size)
        element.used = roundDown(element.used)
        element.available = roundDown(element.available)
      });
    });

    //IO
    
    //NET
    //setInterval(function() {
      si.networkStats().then(data => {
        console.log(data);
      })
    //}, 1000)

    //console.log(m.IO);
    process.send(m);


});

//Round bytes DOWN to nearest multiple of 4GB
function roundDown(x) {
  return Math.floor(Math.floor(x/1000000000)/4.0) * 4;
}