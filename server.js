const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const { instrument } = require('@socket.io/admin-ui');
const app = express();
//---- ENV GETCONFIG ----\\
require('dotenv').config();
//--- START SOCKET.IO ---\\
app.get("/*", (req, res) => {
	if (req.headers['sec-fetch-dest'] == "document") {
		res.sendFile(__dirname +'/views/home.html')
	}else{
		app.use("/public", express.static(__dirname + "/public"));
	}
});
const httpServer = http.createServer(app);
console.log("SERVER IS START....");
const wsServer = new Server(httpServer, {
	allowEIO4: true,
    transports: ["polling", "websocket"],
	cors: {
		origin: ["https://admin.socket.io/"]
	}
})
instrument(wsServer, {
	auth: false
});
console.log("SERVER START=>CHECK=>SOCKET..");
wsServer.on("connection", (socket) => {
	console.log(socket.id);
	socket.onAny((event) => {
		console.log(`Socket Event: ${event}`);
	});
})

const handleListen = () => console.log("Listening on http://"+process.env.BASEURL+":"+process.env.PORT);
httpServer.listen(process.env.PORT, handleListen);