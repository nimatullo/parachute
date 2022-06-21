let id = "";
const me = document.getElementsByClassName("me")[0];
const uploadButton = document.getElementById("upload");
const pairStatus = document.getElementById("pair-status");
var ws = null;
let isReady = false;

window.addEventListener("load", () => {
  connectToWebSocket();
  const connectButton = document.getElementById("connect");
  connectButton.addEventListener("click", () => {
    // Change background to red
    connectToWebSocket();
  });

  uploadButton.addEventListener("click", () => {
    uploadFile();
  });
  uploadButton.disabled = true;
});

window.addEventListener("beforeunload", () => {
  ws.send(JSON.stringify({ type: "disconnected", from: id }));
});

// Make a post request to the server to upload a file
// Endpoint is /upload
function uploadFile() {
  const file = document.getElementById("file").files[0];

  const formData = new FormData();
  formData.append("file", file);

  fetch("/upload", {
    method: "POST",
    body: formData,
    // Headers to send the file name
    headers: {
      "X-Origin-Id": id,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function connectToWebSocket() {
  ws = new WebSocket(getWSEndpoint());

  ws.onopen = function () {
    const status = document.getElementById("status");
    status.innerHTML = "Connected";
  };

  ws.onmessage = function (evt) {
    handleIncomingMessage(JSON.parse(evt.data));
  };

  ws.onclose = function () {
    const status = document.getElementById("status");
    status.innerHTML = "Disconnected";
  };
}

function handleIncomingMessage(message) {
  switch (message.type) {
    case "file":
      if (message.from !== me.innerHTML) downloadFile(message.data); // Origin is from other connection in pair
      break;
    case "new-connection":
      if (me.innerHTML === "") {
        me.innerHTML = message.connectionInfo.name;
        id = message.connectionInfo.id;
        console.log(id);
      }
      break;
    case "ready":
      handleReady(message.pairs);
      break;
    case "ping":
      ws.send(JSON.stringify({ type: "pong", from: id }));
      break;
    case "left-connection":
      handleUnready();
      break;
    default:
      console.log("Unknown message type:", message.type);
  }
}

function handleReady(data) {
  isReady = true;
  uploadButton.disabled = false;
  const otherPair = data.find((pair) => pair.id !== id);
  pairStatus.innerHTML = `✅ Ready. Paired with <strong>${otherPair.name}</strong>`;
}

function handleUnready() {
  isReady = false;
  uploadButton.disabled = true;
  pairStatus.innerHTML = "🔴 Waiting for pair connection...";
}

function downloadFile(file) {
  const bytes = new Uint8Array(file.blob.data);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([bytes], { type: file.mime }));
  a.download = `${file.name}`;
  a.click();
}

function getWSEndpoint() {
  return location.origin.replace(/^http/, "ws") + ":3030/";
}
