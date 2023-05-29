const si = require('systeminformation');
si.getStaticData().then(data => console.log(data));