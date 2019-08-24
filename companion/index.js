import * as messaging from 'messaging';
import { settingsStorage } from 'settings';

const sendVal = (data) => {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  }
}

const restoreSettings = () => {
  for (let index = 0; index < settingsStorage.length; index++) {
    const key = settingsStorage.key(index);
    if (key) {
      sendVal({ key: key, newValue: settingsStorage.getItem(key) });
    }
  }
}

settingsStorage.setItem(
  'meditate',
  JSON.stringify({ selected: [0], values: [{ name: '5 minites', value: 5 }] })
);

messaging.peerSocket.onmessage = () => {};

messaging.peerSocket.onopen = () => {
  restoreSettings();
};

messaging.peerSocket.onerror = (err) => {
  console.log('Connection error: ' + err.code + ' - ' + err.message);
};

settingsStorage.onchange = (evt) => {
  sendVal({ key: evt.key, newValue: evt.newValue });
};
