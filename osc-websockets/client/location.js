// args
const {argv} = require('yargs');
// define upd ports
const udplistenAddr = "0.0.0.0"; // localhost, 127.0.0.1
const udpSendAddr = "0.0.0.0";
const udpListenPort = (argv.udpin) ? argv.udpin : 4000;
const udpSendPort = (argv.udpout) ? argv.udpout : 4001;


// import libraries (osc and socket io)
const osc = require("osc");
const options = { 
    secure:true, 
    reconnect: true, 
    rejectUnauthorized : false
};
const socket = require('socket.io-client')("https://def.space:8888", options);

// WEBSOCKETs
socket.on('connect', () => { console.log("SOCKET OK --> ", socket.id) });
socket.on('chat', data => { udpPort.send(data); }); // send new 'chat' data over OSC

// UDP
const udpOptions = {localAddress: udplistenAddr, localPort: udpListenPort, remoteAddress: udpSendAddr, remotePort: udpSendPort};
let udpPort = new osc.UDPPort(udpOptions);
  
udpPort.on("ready", () => { console.log('UDP OK') });
udpPort.on("message", oscMessage => { socket.emit('chat', oscMessage) }); // send osc to socket
udpPort.on("error", err => {console.log(err);});

udpPort.open();