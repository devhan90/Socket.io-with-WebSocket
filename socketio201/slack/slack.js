const express = require("express");
const app = express();
const socketio = require("socket.io");

let namespaces = require("./data/namespaces");
// console.log(namespaces[0]);
app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(9000);
const io = socketio(expressServer);

// io.on = io.of('/').on
io.on("connection", (socket) => {
  // build an array to send back with the img and endpoint for each NS
  let nsData = namespaces.map((ns) => {
    return {
      img: ns.img,
      endpoint: ns.endpoint,
    };
  });
  // console.log('nsData :', nsData);
  // send the nsData back to the client. We need to use socket, NOt io, because we want it to
  // go to just this client.
  socket.emit("nsList", nsData);
});

// loop through each namespace and listen for a connection
namespaces.forEach((namespace) => {
  // console.log(namespace);
  // const thisNs = io.of(namespace.endpoint)
  io.of(namespace.endpoint).on("connection", (nsSocket) => {
    console.log(`${nsSocket.id} has join ${namespace.endpoint}`);
    // a socket has connected to one of our chatgroup namespaces.
    // send that ns group info back
    nsSocket.emit("nsRoomLoad", namespaces[0].rooms);
    nsSocket.on("joinRoom", (roomToJoin, numberOfUsersCallback) => {
      // deal with history... once we have it
      nsSocket.join(roomToJoin);
      io.of("/wiki")
        .in(roomToJoin)
        .clients((error, clients) => {
          console.log(clients.length);
          numberOfUsersCallback(clients.length);
        });
    });
    nsSocket.on("newMessageToServer", (msg) => {
      const fullMsg = {
        text: msg.text,
        time: Date.now(),
        username: "rbunch",
        avatar: 'https://via.placeholder.com/30'
      }
      console.log(fullMsg);
      // Send this message to ALL the sockets that are in the room that THIs socket is in.
      // how can we find out what rooms THIS socket is in?
      console.log(nsSocket.rooms);
      // the user will be in the 2nd room in the object list
      // this is because the socket ALWAYS joins its own room on connection
      // get the keys
      const roomTitle = Object.keys(nsSocket.rooms)[1];
      // console.log(roomTitle);
      io.of('/wiki').to(roomTitle).emit('messageToClients',fullMsg)
    });
  });
});
