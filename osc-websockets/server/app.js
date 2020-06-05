const express = require('express')
const app = express()
var http = require('http').createServer(app);  // build http server on top of the express one
var io = require('socket.io')(http);  // build a WS server on top of the http one.


// this runs whenever a client establishes a WS connection with the server
io.on('connection', (client) => {
    console.log('a user connected')

    // this runs whenever the client sends something on the chat channel
    client.on('chat', (data) => {
        console.log('Message received -->', data)

        // this emits data back to all the users on the chat channel
        client.broadcast.emit('chat', data)
    })
});


// Now make our new WS server listen to port 5000
io.listen(5000, () => {
    console.log('Listening ...  ')
})
