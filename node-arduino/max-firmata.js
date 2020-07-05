// NOT WORKING!
// Something is causing problems with the serial port, the "new five.Board" line hangs

const Max = require('max-api');

const five = require("johnny-five");
const board = new five.Board({ port:"COM7", repl:false });

// wait until the ready event to start addressing pins
board.on("ready", function() {
    // define pin connections
    let led = new five.Led(13);

    // Use the 'addHandler' function to register a function for a particular message
    Max.addHandler("bang", () => {
        led.toggle();
    });
});