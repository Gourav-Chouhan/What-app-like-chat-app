//private message branch

let username = prompt("Enter your username");
username = username || "unknown";
// username = "gourav chouhan";

// while (!username) {
//   username = prompt("You need to enter a username for moving ahead");
// }

let usersMessages = {};
let currentChannel = "general";

const socket = io();

const colors = ["red", "blue", "violet", "orangered", "purple"];

socket.emit("userLogins", username);

socket.on("sandesh", (msg) => {
  putMessage(msg, "left");
});

socket.on("test", (data) => {
  putMessage(data, "left", data.channel);
});

const form = document.getElementById("form");
let container = document.getElementById("container");

document.getElementById("newMessage").style.display = "none";

const putMessage = (data, side, sendTo) => {
  let parent = document.getElementById(sendTo || currentChannel);
  let msg = document.createElement("div");
  let sentBy = document.createElement("div");
  sentBy.classList.add("sentBy");
  if (!data) {
    sentBy.textContent = "You";
  } else {
    sentBy.textContent = data.username;
  }

  msg.classList.add("message");
  msg.classList.add(side);

  msg.innerHTML = data ? data.data : _input.value;

  if (sendTo && sendTo !== currentChannel) {
    let newMessageCounter = document.getElementById(
      `chat${sendTo}`
    ).lastElementChild;
    newMessageCounter.innerText = parseInt(newMessageCounter.innerText) + 1;
    newMessageCounter.style = "block";
  }

  if (!msg.innerHTML) return;

  let time = document.createElement("div");
  let currTime = new Date();
  let timeString = currTime.toLocaleTimeString();
  timeString = timeString.slice(0, 5) + timeString.slice(8);

  time.classList.add("timeString");

  time.textContent = timeString;

  sentBy.style.color = colors[Math.floor(Math.random() * colors.length)];

  msg.appendChild(sentBy);

  msg.appendChild(time);

  parent.appendChild(msg);
  _input.value = "";
  parent.scrollBy(0, parent.scrollHeight);

  usersMessages[currentChannel] = parent.cloneNode(true);
};

const sendMessage = (username, data) => {
  socket.emit("test", { username, data, currentChannel });
};

let _input = document.getElementById("input");

_input.addEventListener("keydown", (e) => {
  // e.preventDefault();
  if (e.key == "Enter") {
    sendMessage(username, _input.value);
    putMessage(null, "right");
  }
});

let chatSection = document.querySelector(".chat-section");

document.getElementById("chatgeneral").addEventListener("click", (e) => {
  let messageBox = document.getElementById(`chatgeneral`).lastElementChild;
  messageBox.innerText = 0;
  messageBox.style.display = "none";
  if (currentChannel == "general") {
    return;
  }
  document.getElementById("general").style.display = "block";
  document.getElementById("chatgeneral").classList.add("selectedChannel");
  document
    .getElementById(`chat${currentChannel}`)
    .classList.remove("selectedChannel");
  document.getElementById(currentChannel).style.display = "none";
  currentChannel = "general";
});

let nextTo = document.querySelectorAll(".header")[1];

const createOnlinePerson = (username, dpSource) => {
  let person = document.createElement("div");
  // while (chatSection.firstChild) {
  //   chatSection.removeChild(chatSection.firstChild);
  // }
  let channel = document.createElement("div");
  channel.classList.add("messages");
  channel.id = username;
  container.prepend(channel);
  // nextTo.insertAdjacentHTML("afterend", channel);
  channel.style.display = "none";

  person.addEventListener("click", (e) => {
    let messageBox = document.getElementById(
      `chat${username}`
    ).lastElementChild;
    messageBox.innerText = 0;
    messageBox.style.display = "none";
    if (currentChannel == username) {
      return;
    }
    document
      .getElementById(`chat${currentChannel}`)
      .classList.remove("selectedChannel");
    document.getElementById(`chat${username}`).classList.add("selectedChannel");

    document.getElementById(username).style.display = "block";
    document.getElementById(currentChannel).style.display = "none";
    currentChannel = username;
  });
  person.classList.add("online");
  person.id = `chat${username}`;
  let img = document.createElement("img");
  img.src = dpSource || "//unsplash.it/100";
  2;
  img.style.height = "80%";
  let nameBox = document.createElement("div");
  let msgCounter = document.createElement("div");
  msgCounter.classList.add("newMessage");
  msgCounter.id = "newMessage-" + username;
  msgCounter.innerText = 0;
  msgCounter.style.display = "none";

  // nameBox.classList.add('online-name')
  nameBox.innerHTML = username;
  person.appendChild(img);
  person.appendChild(nameBox);
  person.appendChild(msgCounter);
  chatSection.appendChild(person);
};

let users = {};
let count = 0;

function getOnlineInfo() {
  socket.emit("giveOnlineStatus", "bhej jhaldi");
}

socket.on("takeOnlineStatus", (data) => {
  updateOnlinePeoples(data);
});

const gifMenu = () => {
  let msgParent = document.querySelector(".messages");
  msgParent.style.height = "45%";
  let gifMenu = document.querySelector(".gifMenu");
  let cancelMenu = document.querySelector("#cancel-gif-menu");
  gifMenu.style.display = "block";
  gifMenu.style.animation = "raise 0.3s forwards";
  cancelMenu.style.display = "block";
  cancelMenu.style.animation = "rotateCrossIn 0.3s forwards";

  msgParent.scrollBy(0, 500);
};

let msgParent = document.querySelector(".messages");

const hatao = () => {
  while (msgParent.childElementCount) {
    msgParent.removeChild(msgParent.firstChild);
  }
};

let oldNode;

const copyNode = () => {
  oldNode = msgParent.cloneNode(true);
};

const cancelGifMenu = () => {
  msgParent.style.height = "86.5%";
  let gifMenu = document.querySelector(".gifMenu");
  let _gifMenu = document.querySelector("#cancel-gif-menu");
  gifMenu.style.animation = "lower 0.1s forwards";
  _gifMenu.style.animation = "rotateCrossOut 0.1s  forwards";
  // gifMenu.style.display = "none";
  // _gifMenu.style.display = "none";
};

async function getGif() {
  let parent = document.getElementById("gifBox");
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
  let keyWord = document.getElementById("inp").value;
  let api = `https://g.tenor.com/v1/search?key=UJEZA27HQ5IF&q=${keyWord}`;
  const res = await fetch(api);
  const json = await res.json();
  for (let i = 0; i < 30; i++) {
    let url = json["results"][i]["media"][0]["nanogif"]["preview"];
    let img = document.createElement("img");
    img.dataset.gifUrl = json["results"][i]["media"][0]["nanogif"]["url"];
    img.addEventListener("click", () => {
      putMessage(
        { username: "You", data: `<img src="${img.dataset.gifUrl}" \>` },
        "right"
      );
      sendMessage(username, `<img src="${img.dataset.gifUrl}" \>`);
    });
    // img.classList.add('message', )
    img.src = url;
    parent.appendChild(img);
  }
}

function donoKoBhejo() {
  sendMessage(username, _input.value);
  putMessage(null, "right");
}

const updateOnlinePeoples = (onlineUsers) => {
  while (chatSection.childElementCount > 2) {
    chatSection.removeChild(chatSection.children[2]);
  }
  for (let user in onlineUsers) {
    createOnlinePerson(user, null);
  }
};
// setInterval(() => {
//   getOnlineInfo();

// }, 4000);
