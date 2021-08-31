let username = prompt("Enter your username");
// let username = "gourav chouhan";

alert(document.body.clientWidth);

while (!username) {
  username = prompt("You need to enter a username for moving ahead");
}

const socket = io();

const colors = ["red", "blue", "violet", "orangered", "purple"];

socket.emit("userLogins", username);

socket.on("sandesh", (msg) => {
  putMessage(msg, "left");
});

socket.on("test", (data) => {
  putMessage(data, "left");
});

const form = document.getElementById("form");

const putMessage = (data, side) => {
  console.log(data);
  let parent = document.getElementById("messages");
  let msg = document.createElement("div");
  let sentBy = document.createElement("div");
  sentBy.classList.add("sentBy");
  if (!data) {
    sentBy.textContent = "You";
    console.log("hh");
  } else {
    sentBy.textContent = data.username;
  }

  msg.classList.add("message");
  msg.classList.add(side);

  msg.innerHTML = data ? data.data : _input.value;

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
};

const sendMessage = (username, data) => {
  socket.emit("test", { username, data });
};

let _input = document.getElementById("input");

_input.addEventListener("keydown", (e) => {
  // e.preventDefault();
  if (e.key == "Enter") {
    sendMessage(username, _input.value);
    putMessage(null, "right");
  }
});

const chatSection = document.querySelector(".chat-section");

const createOnlinePerson = (username, dpSource) => {
  let person = document.createElement("div");
  // while (chatSection.firstChild) {
  //   chatSection.removeChild(chatSection.firstChild);
  // }
  person.classList.add("online");
  let img = document.createElement("img");
  img.src = dpSource || "//unsplash.it/100";
  2;
  img.style.height = "80%";
  let nameBox = document.createElement("div");
  // nameBox.classList.add('online-name')
  nameBox.innerHTML = username;
  person.appendChild(img);
  person.appendChild(nameBox);
  chatSection.appendChild(person);
};

let users = {};

function getOnlineInfo() {
  socket.emit("giveOnlineStatus", "bhej jhaldi");
  socket.on("takeOnlineStatus", (data) => {
    users = data;
    for (let user in data) {
      createOnlinePerson(data[user], null);
    }
  });
}

const gifMenu = () => {
  let msgParent = document.getElementById("messages");
  msgParent.style.height = "45%";
  let gifMenu = document.querySelector(".gifMenu");
  let cancelMenu = document.querySelector("#cancel-gif-menu");
  gifMenu.style.display = "block";
  gifMenu.style.animation = "raise 0.3s forwards";
  cancelMenu.style.display = "block";
  cancelMenu.style.animation = "rotateCrossIn 0.3s forwards";

  msgParent.scrollBy(0, 500);
};

let msgParent = document.getElementById("messages");

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

      setTimeout(() => {
        msgParent.scrollBy(0, 1000);
      }, 190);
    });
    // img.classList.add('message', )
    img.src = url;
    parent.appendChild(img);
  }
}

// setInterval(() => {
//   getOnlineInfo();

// }, 4000);
