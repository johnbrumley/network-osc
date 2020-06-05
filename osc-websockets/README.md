## This is a VERY simple NodeJS websocket chatroom! 

## Still under construction and things may shift!

How to use:

Requirements: NodeJS

The server and client can be installed anywhere, but works best if the server app is running at an address which is publicly accessible.

For both client and server, navigate to the directory and run

```
npm install

```

This will install any dependencies


Start the server (will update soon with options): 

```
cd server
node app.js
```

Once the server is running, connect your clients:

```
cd client
node .\app.js --udpin=9888 --udpout=9889
```

use the udpin and udpout flags to specify the ports to communicate with
