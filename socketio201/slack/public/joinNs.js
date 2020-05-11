function joinNs(endpoint) {
  const nsSocket = io(`http://localhost:9000${endpoint}`);
  nsSocket.on("nsRoomLoad", (nsRooms) => {
    // console.log(nsRooms);
    let roomList = document.querySelector(".room-list");
    // <li onclick="joinRoom(1,2)"><span class="glyphicon glyphicon-lock"></span>Main Room</li>
    roomList.innerHTML = "";
    nsRooms.forEach((room) => {
      let glpyh;
      if (room.privateRoom) {
        glpyh = "lock";
      } else {
        glpyh = "globe";
      }
      roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glpyh}"></span>${room.roomTitle}</li>`;
    });
    // add click listener to each room
    let roomNodes = document.getElementsByClassName("room");
    Array.from(roomNodes).forEach((elem) => {
      elem.addEventListener("click", (e) => {
        console.log("Someone clicked on", e.target.innerText);
      });
    });
  });

  nsSocket.on("messageToClients", (msg) => {
    console.log(msg);
    document.querySelector("#messages").innerHTML += `<li>${msg.text}</li>`;
  });
  document.querySelector(".message-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const newMessage = document.querySelector("#user-message").value;
    socket.emit("newMessageToServer", { text: newMessage });
  });
}
