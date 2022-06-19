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

// Make a post request to the server to upload a file
// Endpoint is /upload
function uploadFile() {
  const file = document.getElementById("file").files[0];

  const formData = new FormData();
  formData.append("file", file);

  fetch("http://192.168.1.250:8000/upload", {
    method: "POST",
    body: formData,
    // Headers to send the file name
    headers: {
      "X-Origin-Id": me.innerHTML,
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
  ws = new WebSocket("ws://192.168.1.250:3030/");

  ws.onopen = function () {
    const status = document.getElementById("status");
    status.innerHTML = "Connected";
  };

  ws.onmessage = function (evt) {
    handleIncommingMessage(JSON.parse(evt.data));
  };
}

function handleIncommingMessage(message) {
  switch (message.type) {
    case "file":
      if (message.from !== me.innerHTML) downloadFile(message.data);
      break;
    case "new-connection":
      if (me.innerHTML === "") {
        me.innerHTML = message.id;
      }
      break;
    case "ready":
      isReady = true;
      uploadButton.disabled = false;
      pairStatus.innerHTML = "✅ Ready";
      break;
    default:
      console.log("Unknown message type:", message.type);
  }
}

function downloadFile(file) {
  const bytes = new Uint8Array(file.blob.data);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([bytes], { type: file.mime }));
  a.download = `${file.name}`;
  a.click();
}
