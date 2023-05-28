const si = require('systeminformation')
var a = "";
let jsonData = {
    "CPU": [
      {
        "temp": "00",
        "load": "00",
        "clk": "00"
      }
    ],
    "OS": [
      {
        "user": "",
        "uptime": "00:00:00",
        "cpumodel": "",
        "cpuclk": "",
        "cpuvendor": ""
      }
    ],
    "GPU": [
      {
        "temp": "00",
        "load": "00",
        "clk": "00"
      }
    ],
    "RAM": [
      {
        "used": "00",
        "total": "32",
        "load": "00",
        "clk": "00"
      },
      {
        "used": "00",
        "total": "32",
        "load": "00",
        "clk": "00"
      }
    ],
    "HDD": [
      {
        "letter": "C:",
        "used": "0.00",
        "total": "0.00"
      },
      {
        "letter": "D:",
        "used": "0.00",
        "total": "0.00"
      },
      {
        "letter": "G:",
        "used": "0.00",
        "total": "0.00"
      }
    ]
  }
process.on('message',  (message) => {
       let m = (jsonData);
    
    //User   
    si.users(function(data) {
        (m.OS[0].user) = (data[0].user);
    });

    //CPU Temp
    si.cpuTemperature().then(data => m.CPU[0].temp = data.main);

    //CPU Model + MFG + CLK
    si.cpu(function(data) {
        m.OS[0].cpuvendor = data.manufacturer;
        m.OS[0].cpumodel = data.brand.split(" ", 3).toString().replaceAll(",", " ");
        //console.log(data.brand.split(" ", 3).toString().replaceAll(",", " "));
        m.OS[0].cpuclk = data.speedMax * 1000;
    })

    //UPTIME
    si.time(function(data) {
        m.OS[0].uptime = data.uptime;
    })

    //CPU LOAD
    si.currentLoad().then(data => m.CPU[0].load = data.currentLoad);
    
    m.OS[0].uptime = si.time().uptime;

    process.send(m);

});