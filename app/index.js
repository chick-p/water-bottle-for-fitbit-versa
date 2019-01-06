import document from "document";
import * as messaging from "messaging";
import { vibration } from "haptics";
import { display } from "display";

const root = document.getElementById("root");
const btnStart = document.getElementById("btn-start");
const btnReset = document.getElementById("btn-reset");
const btnStop = document.getElementById("btn-stop");
const reclaime = document.getElementById("reclaime");

const versaHeight = root.height;
const tickInterval = 100;

let meditateMinutes;
let timer;

display.autoOff = false;

btnStart.onclick = e => {
  const duration = Number(meditateMinutes) * 60 * 1000;
  reclaime.height = versaHeight;
  vibration.start("confirmation-max");
  begin(duration);
  btnStart.style.display = "none";
  btnReset.style.display = "none";
  btnStop.style.display = "inline";
};

btnStop.onclick = e => {
  finish();
};

btnReset.onclick = e => {
  reclaime.height = versaHeight;
  btnStart.style.display = "inline";
  btnReset.style.display = "none";
  btnStop.style.display = "none";
};

function begin(duration) {
  let count = 0;
  let tick = () => {
    pourWater(duration, count++);
    timer = setTimeout(tick, tickInterval);
    if (count * tickInterval > duration) {
      finish();
      vibration.start("nudge-max");
    }
  };
  tick();
}

function finish() {
  clearTimeout(timer);
  btnStart.style.display = "none";
  btnReset.style.display = "inline";
  btnStop.style.display = "none";
  vibration.start("nudge-max");
}

function pourWater(duration, count) {
  let height = Math.floor(((count * tickInterval) / duration) * versaHeight);
  reclaime.height = versaHeight - height;
}

messaging.peerSocket.onmessage = evt => {
  if (evt.data.key === "meditate" && evt.data.newValue) {
    let meditate = JSON.parse(evt.data.newValue);
    meditateMinutes = meditate["values"][0]["value"];
  }
};

messaging.peerSocket.onopen = () => {};

messaging.peerSocket.onerror = err => {
  console.log("Connection error: " + err.code + " - " + err.message);
};

messaging.peerSocket.onclose = () => {};
