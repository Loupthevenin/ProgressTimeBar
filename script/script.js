let colorProgress;

window.myData = {
  config: {
    defaultColorProgress: "#97EF00",
    morning: 4,
    afternoon: 3,
    startHour: 8,
    endHour: 17,
    breakHour: 2,
    timerStep: 1000,
  },
};

let config = window.myData.config;

window.addEventListener("message", function (event) {
  if (event.source === window && event.data.config) {
    console.log("donnee recu :", event.data.config);
    handleConfigChange(event.data.config);

    event.source.postMessage(
      { success: true, message: "Donnée mise à jour" },
      event.origin
    );
  }
});

// Pensez a une blacklist de site dont on ne veut pas afficher la progressBar
const element_backgroundID = document.getElementById("background_bar"),
  element_progressID = document.getElementById("progress_bar");

// TODO Desactiver pendant certain jour : weekend etc
function handleConfigChange(newConfig) {
  console.log(newConfig);
  config.startHour = newConfig.startHour;
  config.endHour = newConfig.endHour;
  config.morning = newConfig.morning;
  config.afternoon = newConfig.afternoon;
  config.breakHour = newConfig.breakHour;
  config.timerStep = newConfig.timerStep;
}

function disableProgressBar() {
  element_backgroundID.style.display = "none";
}

function activateProgressBar() {
  element_backgroundID.style.display = "";
}

function timerProgressDict() {
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth();

  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentSecond = now.getSeconds();
  const totalSeconds =
    (currentHour - config.startHour) * 3600 +
    currentMinute * 60 +
    currentSecond;

  let progressTotal =
    (totalSeconds / ((config.endHour - config.startHour) * 3600)) * 100;
  progressTotal = Math.max(0, Math.min(progressTotal, 100));

  let progressBreak =
    (totalSeconds /
      ((config.endHour -
        config.startHour -
        (config.breakHour + config.afternoon)) *
        3600)) *
    100;

  return {
    currentHour: currentHour,
    progressTotal: progressTotal,
    progressBreak: progressBreak,
  };
}

// Print Timer
element_backgroundID.addEventListener("mouseover", function (event) {
  const timer = timerProgressDict();
  const progress = timer.progressTotal;
  const progressBreak = timer.progressBreak;

  let contentBreak =
    progressBreak > 100
      ? ""
      : `* ${progressBreak.toFixed(2)} / 100% avant midi`;

  document.getElementById("timer").textContent = `${progress.toFixed(
    2
  )} / 100% ${contentBreak}`;
  document.getElementById("timer").classList.add("show");
});
element_backgroundID.addEventListener("mouseout", function () {
  document.getElementById("timer").classList.remove("show");
});

function updateProgressBar() {
  const timer = timerProgressDict();
  const currentHour = timer.currentHour;
  const progress = timer.progressTotal;

  // TODO Different popup event
  if (currentHour < 11) {
    colorProgress = config.defaultColorProgress;
  } else if (currentHour < 12) {
    // effet en spiral bande blanche ?
    colorProgress = "";
  } else if (currentHour < 14) {
    colorProgress = config.colorBreak;
  } else if (currentHour < 16) {
    // effet scintillant ?
    colorProgress = config.defaultColorProgress;
  } else if (currentHour < 17) {
    // multi color + scintillant ?
    element_progressID.classList = [];
    element_progressID.classList.add("glowing-multi-colors");
  }

  element_progressID.style.width = progress + "%";
}

function startBar() {
  const now = new Date();

  if (now.getHours() >= config.endHour) {
    console.log("Hors temps");
    disableProgressBar();
    return;
  }

  if (now.getHours() < config.startHour) {
    const millisecondsUntilStart =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        config.startHour
      ) - now;

    setTimeout(startBar, millisecondsUntilStart);
    console.log("Hors temps");
    disableProgressBar();
    return;
  }

  updateProgressBar();
  console.log("Progress en cours");

  const intervalId = setInterval(() => {
    updateProgressBar();

    if (new Date().getHours() >= config.endHour) {
      clearInterval(intervalId);
    }
  }, config.timerStep);
}

startBar();
