const {argv} = require('yargs') // get arguments
const port = (argv.port) ? argv.port : 5000; 

const express = require('express')
const app = express()
var server = require('http').Server(app);  // build http server on top of the express one
var io = require('socket.io')(server);  // build a WS server on top of the http one.


// this runs whenever a client establishes a WS connection with the server
io.on('connection', (client) => {
    console.log('a user connected')

    // this runs whenever the client sends something on the chat channel
    client.on('chat', (data) => {
        console.log('Message received -->', data)

        // send data to everyone else on the channel
        client.broadcast.emit('chat', data)
    })
});


// start up the server
server.listen(port, () => {
    console.log(`Listening on ${port}...  `)
})
