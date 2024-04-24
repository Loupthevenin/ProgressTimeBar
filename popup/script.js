chrome.action.onClicked.addListener(() => {
  chrome.action.openOptionsPage();
});

let config = {
  startHour: 8,
  endHour: 17,
  morning: 4,
  afternoon: 3,
  breakHour: 2,
  timerStep: 1 * 1000,
};

function sendMessage_toInject(config) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { config: config },
      function (response) {
        console.log("Message envoyé à inject.js", config);
      }
    );
  });
}

function loadValues() {
  document.getElementById("startHour").value = config.startHour;
  document.getElementById("endHour").value = config.endHour;
  document.getElementById("morning").value = config.morning;
  document.getElementById("afternoon").value = config.afternoon;
  document.getElementById("breakHour").value = config.breakHour;
  document.getElementById("timerStep").value = config.timerStep;
}

function saveValues() {
  config.startHour = document.getElementById("startHour").value;
  config.endHour = document.getElementById("endHour").value;
  config.morning = document.getElementById("morning").value;
  config.afternoon = document.getElementById("afternoon").value;
  config.breakHour = document.getElementById("breakHour").value;
  config.timerStep = document.getElementById("timerStep").value;

  chrome.storage.local.set({ config: config }, function () {
    console.log("Les valeurs ont été enregistrées avec succès !");
  });

  sendMessage_toInject(config);
}

document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.local.get("config", function (data) {
    if (data.config) {
      config = data.config;
      sendMessage_toInject(config);
    }
    loadValues();
  });
});

document.getElementById("saveButton").addEventListener("click", function () {
  saveValues();
});
