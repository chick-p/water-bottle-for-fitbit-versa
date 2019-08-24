import document from 'document';
import * as messaging from 'messaging';
import { vibration } from 'haptics';
import { display } from 'display';

const root = document.getElementById('root');
const btnStart = document.getElementById('btn-start');
const btnReset = document.getElementById('btn-reset');
const btnStop = document.getElementById('btn-stop');
const reclaime = document.getElementById('reclaime');

const versaHeight = root.height || 300;
const tickInterval = 100;

let meditateMinutes, timer;

const begin = (duration) => {
  let count = 0;
  const tick = () => {
    pourWater(duration, count++);
    timer = setTimeout(tick, tickInterval);
    if (count * tickInterval > duration) {
      finish();
      vibration.start('nudge-max');
    }
  };
  tick();
}

const finish = () => {
  clearTimeout(timer);
  btnStart.style.display = 'none';
  btnReset.style.display = 'inline';
  btnStop.style.display = 'none';
  vibration.start('nudge-max');
}

const pourWater = (duration, count) => {
  const height = Math.floor(((count * tickInterval) / duration) * versaHeight);
  reclaime.height = versaHeight - height;
}

display.autoOff = false;

btnStart.onclick = () => {
  const duration = meditateMinutes * 60 * 1000;
  reclaime.height = versaHeight;
  vibration.start('confirmation-max');
  begin(duration);
  btnStart.style.display = 'none';
  btnReset.style.display = 'none';
  btnStop.style.display = 'inline';
};

btnStop.onclick = () => {
  finish();
};

btnReset.onclick = () => {
  reclaime.height = versaHeight;
  btnStart.style.display = 'inline';
  btnReset.style.display = 'none';
  btnStop.style.display = 'none';
};

messaging.peerSocket.onmessage = (evt) => {
  if (evt.data.key === 'meditate' && evt.data.newValue) {
    const meditate = JSON.parse(evt.data.newValue);
    meditateMinutes = meditate['values'][0]['value'] || 5;
  }
};

messaging.peerSocket.onopen = () => {};

messaging.peerSocket.onerror = (err) => {
  console.log('Connection error: ' + err.code + ' - ' + err.message);
};

messaging.peerSocket.onclose = () => {};
