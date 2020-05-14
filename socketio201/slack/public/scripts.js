
const socket = io("http://localhost:9000"); // the /namespace/endpoint
let nsSocket = "";

// listen for nslistm which is a list of all the namespace
socket.on("nsList", (nsData) => {
  console.log("The list of namespaces has arrived!");
  // console.log(nsData);
  let namespacesDiv = document.querySelector(".namespaces");
  namespacesDiv.innerHTML = "";
  nsData.forEach((ns) => {
    namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src="${ns.img}" /></div>`;
  });

  // Add a clicklistener for each NS
  console.log(document.getElementsByClassName("namespace")); // HTTP 컬렉션이라고 나옴. 유사배열. 그래서 forEach 바로 못하고 바꿔줘야함 어레이로.
  Array.from(document.getElementsByClassName("namespace")).forEach((elem) => {
    // console.log(elem);
    elem.addEventListener("click", (e) => {
      const nsEndpoint = elem.getAttribute("ns");
      console.log(`${nsEndpoint} I should go to now`);
      joinNs(nsEndpoint);
    });
  });
  joinNs('/wiki');

  // Add a clicklistener for each Rooms
  
});
