function joinNs(endpoint) {
  nsSocket = io(`http://localhost:9000${endpoint}`);
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
    // add room automatically... first time here
    const topRoom = document.querySelector(".room");
    const topRoomName = topRoom.innerText;
    // console.log(topRoomName);
    joinRoom(topRoomName);
  });

  nsSocket.on("messageToClients", (msg) => {
    console.log(msg);
    const newMsg = buildHTML(msg);
    document.querySelector("#messages").innerHTML += newMsg;
  });
  document.querySelector(".message-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const newMessage = document.querySelector("#user-message").value;
    nsSocket.emit("newMessageToServer", { text: newMessage });
  });
}

function buildHTML(msg) {
  const convertedDate = new Date(msg.time).toLocaleTimeString();
  const newHTML = `<li>
  <div class="user-image">
      <img src="${msg.avatar}" />
  </div>
  <div class="user-message">
      <div class="user-name-time">${msg.username} <span>${convertedDate}</span></div>
      <div class="message-text">${msg.text}</div>
  </div>
</li>`;
  return newHTML;
}
