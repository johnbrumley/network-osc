// args
const {argv} = require('yargs');

const comPort = (argv.comPort) ? argv.comPort : "COM7";

// connecting arduino to websocket
const five = require("johnny-five");
const board = new five.Board({port:comPort});

// wait until the ready event to start addressing pins
board.on("ready", function() {
    // define some pin connections
    let led = new five.Led(13);

    // once board is ready, setup the socket connection. reusing the one from location.js in the osc websockets folder
    const options = { secure:true, reconnect: true, rejectUnauthorized : false};
    const socket = require('socket.io-client')("https://def.space:8888", options);

    // WEBSOCKETs
    socket.on('connect', () => { console.log("SOCKET OK --> ", socket.id) });
    socket.on('chat', data => { 
        // console.log("received:", data);

        // just something really simple.
        if(data.address === '/position') {
            led.toggle(); // toggle the led each time something is received
        }
        
    });

});
