let defaultColorBarBackground = "#242424",
  defaultColorProgress = "#97EF00",
  colorProgress,
  colorBreak = "#FF3100",
  widthBar = "99%",
  heightBar = "20px",
  borderRadius = "10px",
  startHour = 8,
  endHour = 17,
  breakHour = 2,
  totalHours = endHour - startHour,
  timerStep = 1 * 1000; // milliseconds

const element_backgroundID = document.getElementById("background_bar"),
  element_progressID = document.getElementById("progress_bar");

// Pensez a une blacklist de site dont on ne veut pas afficher la progressBar

// TODO Desactiver pendant certain jour : weekend etc

function disableProgressBar() {
  element_backgroundID.style.display = "none";
}

function activateProgressBar() {
  element_backgroundID.style.display = "";
}

function updateProgressBar() {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentSecond = now.getSeconds();
  const totalSeconds =
    (currentHour - startHour) * 3600 + currentMinute * 60 + currentSecond;

  let progress = (totalSeconds / (totalHours * 3600)) * 100;
  progress = Math.max(0, Math.min(progress, 100));

  // TODO Different popup event
  if (currentHour < 11) {
    colorProgress = defaultColorProgress;
  } else if (currentHour < 12) {
    // effet en spiral bande blanche ?
    colorProgress = "";
  } else if (currentHour < 14) {
    colorProgress = colorBreak;
  } else if (currentHour < 16) {
    // effet scintillant ?
    colorProgress = defaultColorProgress;
  } else if (currentHour < 17) {
    // multi color + scintillant ?
    colorProgress = defaultColorProgress;
  }

  addSparkleEffect();
  element_progressID.style.width = progress + "%";
  element_progressID.style.backgroundColor = colorProgress;
}

function startBar() {
  const now = new Date();

  if (now.getHours() >= endHour) {
    console.log("Hors temps");
    disableProgressBar();
    return;
  }

  if (now.getHours() < startHour) {
    const millisecondsUntilStart =
      new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour) -
      now;

    setTimeout(startBar, millisecondsUntilStart);
    console.log("Hors temps");
    disableProgressBar();
    return;
  }

  updateProgressBar();
  console.log("Progress en cours");

  const intervalId = setInterval(() => {
    updateProgressBar();

    if (new Date().getHours() >= endHour) {
      clearInterval(intervalId);
    }
  }, timerStep);
}

// startBar();
