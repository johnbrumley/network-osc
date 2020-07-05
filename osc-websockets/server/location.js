const {argv} = require('yargs') // get arguments
const port = (argv.port) ? argv.port : 8888;

const path = require('path');
const fs = require('fs');



// setup the server and websockets

// need keys for SSL (https)
const options = {
	key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem"),
    requestCert: false, 
    rejectUnauthorized: false
};


const express = require('express')
const app = express()
var server = require('https').Server(options, app);  // build https server on top of the express one, use the options for the key/cert
var io = require('socket.io')(server);  // build a WS server on top of the http one.

// static files
app.use(express.static('location'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/location/index.html'));
});

// this runs whenever a client establishes a WS connection with the server
io.on('connection', socket => {
    console.log('a user connected')

    // this runs whenever the client sends something on the chat channel
    // uses broadcast so that the socket doesn't get it's own data back
    socket.on('chat', (data) => {
        console.log('chat -->', data)
        // send data to everyone else on the channel
        socket.broadcast.emit('chat', data)
    })

    // event for handling location and rotation messsages from the phone
    // just uses emit, broadcasts to everyone connected to the server

    // react to new rotation
    socket.on('phone', (data) => {
        console.log('phone -->', data)
        // instead of sending back to 'phone' we'll send to 'chat instead
        socket.broadcast.emit('chat', data)
    })
});

// start up the server
server.listen(port, () => {
    console.log(`Listening on ${port}...  `)
})
