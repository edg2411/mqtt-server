require('dotenv').config();
const aedes = require('aedes')();
const server = require('net').createServer(aedes.handle);
const port = process.env.PORT || 1883;

// Load username and password from environment variables
const validUsername = process.env.MQTT_USERNAME;
const validPassword = process.env.MQTT_PASSWORD;

// Authentication function
aedes.authenticate = function (client, username, password, callback) {
  const authError = new Error('Auth error');
  if (username === validUsername && password.toString() === validPassword) {
    callback(null, true);
  } else {
    callback(authError, false);
  }
};

server.listen(port, function () {
  console.log(`MQTT broker started and listening on port ${port}`);
});

aedes.on('client', function (client) {
  console.log(`Client connected: ${client.id}`);
});

aedes.on('clientDisconnect', function (client) {
  console.log(`Client disconnected: ${client.id}`);
});

aedes.on('publish', function (packet, client) {
  if (client) {
    console.log(`Message from ${client.id}: ${packet.payload.toString()}`);
  }
});
