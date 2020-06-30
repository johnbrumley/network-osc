const socket = io('http://localhost:5000');

socket.on('connect', function(){
    console.log("socket connected as --> ", socket.id)
});

// if you want to receive updates from the server,,
// socket.on('chat', function(data){
//     console.log('new data --> ', data);

//     // send to local udp port
//     udpPort.send(data);
// });

socket.on('disconnect', function(){});


// User Location
function success(position) {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;

    // emit as osc msg
    const osc = {
        address: '/position',
        args: [position.coords.latitude, position.coords.longitude]
    };
    
    socket.emit('chat', osc);

    console.log(latitude, longitude);
}

function error() {
    console.log("couldn't get location");
}

const locationUpdateTime = 1000;

function locationLoop() {
    navigator.geolocation.getCurrentPosition(success, error);
    setTimeout(locationLoop, locationUpdateTime);
}

// try setting up location
if(!navigator.geolocation) {
    status.textContent = 'Geolocation is not supported by your browser';
} else {
    status.textContent = 'Locating…';
    // start  the location loop
    locationLoop();
}



// FULLTILT.DeviceOrientation instance placeholder
let deviceOrientation;
// Create a new FULLTILT Promise for e.g. *compass*-based deviceorientation data
(new FULLTILT.getDeviceOrientation({ 'type': 'world' }))
    .then(function(controller) {
        // Store the returned FULLTILT.DeviceOrientation object
        deviceOrientation = controller;
    })
    .catch(function(message) {
        console.error(message);

        // Optionally set up fallback controls...
        // initManualControls();
    });

const x = document.getElementById('x');
const y = document.getElementById('y');
const z = document.getElementById('z');

(function draw() {

  // If we have a valid FULLTILT.DeviceOrientation object then use it
  if (deviceOrientation) {

    // Obtain the *screen-adjusted* normalized device rotation
    // as Quaternion, Rotation Matrix and Euler Angles objects
    // from our FULLTILT.DeviceOrientation object
    var quaternion = deviceOrientation.getScreenAdjustedQuaternion();
    var matrix = deviceOrientation.getScreenAdjustedMatrix();
    var euler = deviceOrientation.getScreenAdjustedEuler();

    // Do something with our quaternion, matrix, euler objects...
    // console.log(quaternion);
    // console.log(matrix);
    // console.log(euler);

    /*
    Euler Object

    alpha: 0
    beta: 0
    copy: ƒ ( inEuler )
    gamma: 0
    rotateX: ƒ ( angle )
    rotateY: ƒ ( angle )
    rotateZ: ƒ ( angle )
    set: ƒ ( alpha, beta, gamma )
    setFromQuaternion: ƒ ( q )
    setFromRotationMatrix: ƒ ( matrix )
    */

    x.textContent = "x: " + euler.alpha;
    y.textContent = "y: " + euler.beta;
    z.textContent = "z: " + euler.gamma;

  }

  // Execute function on each browser animation frame
  requestAnimationFrame(draw);

})();