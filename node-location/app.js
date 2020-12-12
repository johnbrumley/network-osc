const port = 8888;

const express = require('express')
const app = express()
var server = require('http').Server(app);  // build https server on top of the express one, use the options for the key/cert
var io = require('socket.io')(server);  // build a WS server on top of the http one.

// static files
app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

// this runs whenever a client establishes a WS connection with the server
io.on('connection', socket => {
    console.log('a user connected')

    // this runs whenever the client sends something on the chat channel
    // uses broadcast so that the socket doesn't get it's own data back
    socket.on('chat', (data) => {
        console.log('chat -->', data)
        // send data to everyone else on the channel
        // socket.broadcast.emit('chat', data);

        io.emit('chat', data);
    })

    socket.on('hello', data => {
        const reply = data + '!!!!!!!!';
        io.emit('chat', reply);
    })
});

// start up the server
server.listen(port, () => {
    console.log(`Listening on ${port}...  `)
})
