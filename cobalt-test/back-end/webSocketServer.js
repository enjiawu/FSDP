const WebSocket = require("ws");
const getDashboard = require("./dashboardStream");

// create a new websocket server on localhost:8080
const wss = new WebSocket.Server({ port: 8080 });

// broadcast function to send data
wss.broadcast = function (data) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

// when connected
wss.on("connection", function connection(ws) {
    // when message received
    ws.on("message", function incoming(message) {
        console.log("received: %s", message);
    });
    console.log("Websocket connected.");
});

// link the change stream to the websocket server
getDashboard(null, null, wss).catch(console.error);
module.exports = wss;