import * as messaging from "messaging";
import { settingsStorage } from "settings";

settingsStorage.setItem(
  "meditate",
  JSON.stringify({ selected: [0], values: [{ name: "5 minites", value: 5 }] })
);

messaging.peerSocket.onmessage = evt => {};

messaging.peerSocket.onopen = () => {
  restoreSettings();
};

messaging.peerSocket.onerror = err => {
  console.log("Connection error: " + err.code + " - " + err.message);
};

settingsStorage.onchange = evt => {
  sendVal({ key: evt.key, newValue: evt.newValue });
};

function restoreSettings() {
  for (let index = 0; index < settingsStorage.length; index++) {
    let key = settingsStorage.key(index);
    if (key) {
      sendVal({ key: key, newValue: settingsStorage.getItem(key) });
    }
  }
}

function sendVal(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  }
}
