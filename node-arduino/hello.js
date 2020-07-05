const five = require("johnny-five");

// const board = new five.Board();
const board = new five.Board({port:"COM7"}); // might have to specify a port

// wait until the ready event to start addressing pins
board.on("ready", function() {
	let led = new five.Led(13);
	// led.blink(500);

	// repl is availible, able to access variables from command line
	// board.repl.inject({
	// 	led
	// });

	board.loop(1000, () => {
		// creates a loop that repeats every second
	})

	// setting up a button, comes with events
	// button = new five.Button(2);
	// button.on("up", () => {
	// 	console.log("up");
	// });
});
