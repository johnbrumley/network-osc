# Very basic websocket server

While meant for use with OSC, the server itself echoes any received data and it is up to the clients to properly format the OSC packets.

## Requirements: 
- NodeJS

Server:
- yargs, express, socket.io

Client:
- yargs, osc, socket.io-client

## Installation

```
git clone https://github.com/johnbrumley/network-osc.git
```

The server and client can be installed anywhere. To connect over the internet, the server app needs to be running on a public IP address. Be sure to check if any firewalls are blocking the websocket ports.

For each client and server, navigate to the repsective directory and install dependencies with:

```
npm install

```

## Server 
Starting the server: 

```
cd server
node app.js
```

Default port is 5000, can set with the ```--port``` flag

## Client
With the server is running, you can connect your clients either locally or on different machines:

```
cd client
node .\app.js --udpin=9888 --udpout=9889
```

Use the ```--udpin``` and ```--udpout``` flags to specify the local UDP ports, default ports are 57121 and 57122. The default server address and port is ```http://localhost:5000```. Use ```--addr``` and ```--port``` to specify a different server and port. For example:

```
node .\app.js --addr http://my.website.com --port 5432 --udpin 3000 --udpout 3001
```
