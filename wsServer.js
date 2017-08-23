var ws = require("nodejs-websocket")
var PORT = 3000;
var clientCount = 0;

function broadcast(str) {
	server.connections.forEach(function (connection) {
		connection.sendText(str);
	});
}

var server = ws.createServer(function (conn) {
  
  clientCount ++;
  conn.nickname = "user" + clientCount;

  console.log(conn.nickname + " connection");

  var mes = {
  	type: "enter",
  	data: conn.nickname + " comes in"
  };

  broadcast(JSON.stringify(mes));

  conn.on("text", function (str) {
    console.log("Received "+str)

    mes.type = "message";
    mes.data = conn.nickname + " says: " + str;

    broadcast(JSON.stringify(mes));
  });
  conn.on("close", function (code, reason) {
    console.log("Connection closed");

    mes.type = "leave";
    mes.data = conn.nickname + " leave";

    broadcast(JSON.stringify(mes));
  });
  conn.on("error", function (err) {
  	console.log("Handle error");
  	console.log(err);
  });
}).listen(PORT);

console.log('websocket server listening on port' + PORT)