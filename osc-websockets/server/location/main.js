/*

Starting point client side script for sending phone sensor info to the server via websocket

Things to try:
- only send if the data is changed
- try out p5js for location, rotation, and other things

*/

(() => {

    let rotation;
    const slowUpdateTime = 1000;

    const x = document.getElementById('x');
    const y = document.getElementById('y');
    const z = document.getElementById('z');

    // convenience element for quick phone debug
    const display_error = document.getElementById('error');


    // setup websocket
    // connect back to the server (using the default: 'window.location')
    const socket = io();

    socket.on('connect', function(){
        console.log("socket connected as --> ", socket.id)
    });

    // if you want to receive updates from the server,,
    // socket.on('phone', function(data){
    //     console.log('new data --> ', data);

    //     // send to local udp port
    //     udpPort.send(data);
    // });

    socket.on('disconnect', function(){});

    
    // check for location support
    if(!navigator.geolocation) {
        status.textContent = 'Geolocation is not supported by your browser';
    } else {
        status.textContent = 'Locating…';
    }

    // check for orientation
    let deviceOrientation;
    // Create a new FULLTILT Promise for e.g. *compass*-based deviceorientation data
    (new FULLTILT.getDeviceOrientation({ 'type': 'world' }))
    .then(function(controller) {
        // Store the returned FULLTILT.DeviceOrientation object
        deviceOrientation = controller;
    })
    .catch(function(message) {
        console.error(message);
        display_error.textContent = message;
    });


    // slower update to reduce network traffic, draw function might be OK for lower number of users
    function slowUpdate() {
        // grab current location
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                // pack as OSC message object (format that osc.js expects)
                const osc = {
                    address: '/position',
                    args: [position.coords.latitude, position.coords.longitude]
                };
                
                socket.emit('phone', osc);
            }, () => {
                console.log("couldn't get location");
            });
        }


        // if orientation isn't null then also send
        // orientation is already an array so no need to wrap in an array
        if(rotation){
            const osc = {
                address: '/rotation',
                args: rotation
            };
            
            socket.emit('phone', osc);
        }

        // reset the loop after the location update time in milliseconds
        setTimeout(slowUpdate, slowUpdateTime);
    }


    // create and call the draw function
    (function draw() {

    // If we have a valid FULLTILT.DeviceOrientation object then use it
    if (deviceOrientation) {

        var euler = deviceOrientation.getScreenAdjustedEuler();

        // display the current rotation
        x.textContent = "x: " + euler.alpha.toFixed(2);
        y.textContent = "y: " + euler.beta.toFixed(2);
        z.textContent = "z: " + euler.gamma.toFixed(2);

        // update the rotation variable for sending on slow update

        // in unity, rotation is probably
        // alpha == y, beta == z, gamme == x (also try -x if mirrored)

        rotation = [Number(euler.gamma), Number(euler.alpha), Number(euler.beta)]

    }

    // Execute function on each browser animation frame
    requestAnimationFrame(draw);

    })();

    // start slow update
    slowUpdate();

})();

