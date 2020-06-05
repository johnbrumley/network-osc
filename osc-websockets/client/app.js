// get arguments
const {argv} = require('yargs')

// define upd ports
const udplistenAddr = "0.0.0.0";
const udpSendAddr = "0.0.0.0";
const udpListenPort = (argv.udpin) ? argv.udpin : 57121;
const udpSendPort = (argv.udpout) ? argv.udpout : 57122;

// import libraries (osc and socket io)
const osc = require("osc")
const socket = require('socket.io-client')('http://def.space:5000')

// WEBSOCKET
console.log('connecting socket...')

socket.on('connect', function(){
  console.log("connected as --> ", socket.id)

  // socket.emit('chat', 'hello from' + socket.id)
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

udpPort.on("ready", function () {
  console.log('UDP ready!');
  // let ipAddresses = getIPAddresses()

  // console.log("Listening for OSC over UDP.")
  // ipAddresses.forEach(function (address) {
  //     console.log(" Host:", address + ", Port:", udpPort.options.localPort);
  // });
});

udpPort.on("message", (oscMessage) => {
  //console.log(oscMessage)

  // pass the osc message to the server
  socket.emit('chat', oscMessage);
});

udpPort.on("error", (err) => {
  console.log(err)
});

udpPort.open()



// function to print out the listen ports and addresses
// let getIPAddresses = function () {
//   let os = require("os"),
//       interfaces = os.networkInterfaces(),
//       ipAddresses = []

//   for (let deviceName in interfaces) {
//       let addresses = interfaces[deviceName];
//       for (let i = 0; i < addresses.length; i++) {
//           let addressInfo = addresses[i];
//           if (addressInfo.family === "IPv4" && !addressInfo.internal) {
//               ipAddresses.push(addressInfo.address)
//           }
//       }
//   }

//   return ipAddresses;
// };

