const {argv} = require('yargs') // get arguments
const port = (argv.port) ? argv.port : 8888;

const path = require('path');
const fs = require('fs');

// OSC / UDP
const osc = require("osc");

const udplistenAddr = "0.0.0.0"; // localhost, 127.0.0.1
const udpSendAddr = "0.0.0.0";
const udpListenPort = (argv.udpin) ? argv.udpin : 4000;
const udpSendPort = (argv.udpout) ? argv.udpout : 4001;

let udpPort = new osc.UDPPort({
    localAddress: udplistenAddr,
    localPort: udpListenPort,
    remoteAddress: udpSendAddr,
    remotePort: udpSendPort
});
  
udpPort.on("ready", () => { console.log('UDP ready!') });
udpPort.on("error", (err) => {console.log(err);});
udpPort.open();

// {
//     annotations : {
//         thumb: [[x,y,z],[],[],[]],
//         indexFinger: [[x,y,z],[],[],[]],
//         middleFinger: [[x,y,z],[],[],[]],
//         ringFinger: [[x,y,z],[],[],[]],
//         pinky: [[x,y,z],[],[],[]],
//         palmBase: [[x,y,z]],
//     },
//     landmarks: [[x,y,z],[],[],[], 21 total ],
//     handInViewConfidence: 0.0 - 1.0
// }

let sendLandmarks = (data) => {
    // landmark data
    let landmarks = [];
    let i = 0;
    for (const mark of hand['landmarks']) {
      let points = [];
      for (const p of mark) {
          points.push({type:"f",value:p});
      }

      landmarks.push({
        address: "/landmark/" + i,
        args: points
      });

      i++;
    }

    // send osc landmarks
    udpPort.send({
        timeTag: osc.timeTag(1),
        packets: landmarks
    });
}

let sendOSCMessage = (data) => {
    // extract hand data
    for (const hand of data) {

        // sendLandmarks(data);

        // annotations
        for (const property in hand['annotations']){
            let parts = [];
            let i = 0;
            // iterate through each point
            for (const part of hand['annotations'][property]){
                // console.log(i, property, part);
                let points = [];
                
                for (const p of part) {
                    points.push({type:"f",value:p});
                }

                parts.push({
                    address: "/" + property + "/" + i,
                    args: points
                  });

                i++;
            }

            udpPort.send({
                timeTag: osc.timeTag(1),
                packets: parts
            });
        }
    }
}


// setup the server and websockets

// need keys for SSL (https) -- in order to allow webcam
const options = {
	key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem"),
    requestCert: false, 
    rejectUnauthorized: false
};

const express = require('express')
const app = express()
let server = require('https').Server(options, app);  // build https server on top of the express one, use the options for the key/cert
let io = require('socket.io')(server);  // build a WS server on top of the http one.

// static files
app.use(express.static('hands'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/hands/index.html'));
});

// this runs whenever a client establishes a WS connection with the server
io.on('connection', socket => {
    socket.on('hand', (data) => {
        // console.log('-->', data)
        // send data 
        sendOSCMessage(data);
    })
    socket.on('disconnect', () => {console.log('user disconnected');});
});

// start up the server
server.listen(port, () => {
    console.log(`Listening on ${port}...  `)
})

