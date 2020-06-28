// get arguments
const {argv} = require('yargs');
// define upd ports
const udplistenAddr = "0.0.0.0"; // localhost, 127.0.0.1
const udpSendAddr = "0.0.0.0";
const udpListenPort = (argv.udpin) ? argv.udpin : 57121;
const udpSendPort = (argv.udpout) ? argv.udpout : 57122;
// setup the remote address and ports
const serverPort = (argv.port) ? argv.port : 5000;

// http://localhost:5678 , http://def.space:5000, http://192.168.1.101:5000
const serverAddr = (argv.addr) ? `${argv.addr}:${serverPort}`  : `http://127.0.0.1:${serverPort}`;

// import libraries (osc and socket io)
const osc = require("osc");
const socket = require('socket.io-client')(serverAddr);

// WEBSOCKETs
socket.on('connect', function(){
  console.log("socket connected as --> ", socket.id)
});
socket.on('chat', function(data){
  console.log('new data --> ', data)

  // send to local udp port
  udpPort.send(data)
});

socket.on('disconnect', function(){})


// UDP
console.log('starting udp...');

let udpPort = new osc.UDPPort({
  localAddress: udplistenAddr,
  localPort: udpListenPort,
  remoteAddress: udpSendAddr,
  remotePort: udpSendPort
});

udpPort.on("ready", () => { console.log('UDP ready!') });
udpPort.on("message", (oscMessage) => {
  console.log(oscMessage);
  // pass the osc message to the server
  socket.emit('chat', oscMessage)
});

udpPort.on("error", (err) => {
  console.log(err);
});

udpPort.open();