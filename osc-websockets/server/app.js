

const {argv} = require('yargs') // get arguments
const port = (argv.port) ? argv.port : 5000; 

// let port = 5000;
// if(argv.port) {
//     port = argv.port
// }

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

        // add 4
        // data = data + 4

        // check data
        // if(data = 400){
        //     controlArm(data);
        // } else {
        //     client.emit('chat', 'too high')
        // }

        // retrieve response
        // const responses = []
        // if(data >= 0 && data < responses.length){
        //     const reply = responses[data];
        //     client.emit('chat', reply)
        // }
        
        // send data to everyone else on the channel
        client.broadcast.emit('chat', data)
        
    })
});


// start up the server
server.listen(port, () => {
    console.log(`Listening on ${port}...  `)
})
