const WebSocket = require("ws");
const getDashboard = require("./dashboardStream");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", function connection(ws) {
    ws.on("message", function incoming(message) {
        console.log("received: %s", message);
    });
    console.log("Websocket connected.");
});

getDashboard(null, null, wss).catch(console.error);
