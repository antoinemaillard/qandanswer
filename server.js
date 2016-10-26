'use strict';

const express = require('express');
const SocketServer = require('ws').Server;

const PORT = process.env.PORT || 3000;

const server = express()
  .use(express.static('public'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });

/** broadcast message to all clients **/
wss.broadcast = function (data) {
  var i = 0, n = this.clients ? this.clients.length : 0, client = null;
  for (; i < n; i++) {
    client = this.clients[i];
    if (client.readyState === client.OPEN) {
      client.send(data);
    }
    else console.error('Error: the client state is ' + client.readyState);
  }
};

/** successful connection */
wss.on('connection', function (ws) {
  console.log("New connection");
  /** incomming message */
  ws.on('message', function (message) {
    /** broadcast message to all clients */
    console.log("We received:", message);
    wss.broadcast(message);
  });
});