chrome.action.onClicked.addListener(() => {
  chrome.action.openOptionsPage();
});

let config = {
  defaultColorProgress: "#97EF00",
  morning: 4,
  afternoon: 3,
  startHour: 8,
  endHour: 17,
  breakHour: 2,
  timerStep: 1 * 1000,
  colorBreak: "#DC143C",
  is_active: true,
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
  document.getElementById("morning").value = config.morning;
  document.getElementById("afternoon").value = config.afternoon;
  document.getElementById("startHour").value = config.startHour;
  document.getElementById("endHour").value = config.endHour;
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

  console.log(config);

  sendMessage_toInject(config);
}

function updateButtonState() {
  var active_button = document.getElementById("activeButton");
  if (config.is_active) {
    active_button.classList.add("actif");
    active_button.innerText = "Actif";
  } else {
    active_button.classList.remove("actif");
    active_button.innerText = "Inactif";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.local.get("config", function (data) {
    if (data.config) {
      config = data.config;
      sendMessage_toInject(config);
      updateButtonState();
    }
    loadValues();
  });
});

document.getElementById("saveButton").addEventListener("click", function () {
  saveValues();
});

document.getElementById("activeButton").addEventListener("click", function () {
  config.is_active = !config.is_active;
  saveValues();
  updateButtonState();
});
