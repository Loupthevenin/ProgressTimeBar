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

// Pensez a une blacklist de site dont on ne veut pas afficher la progressBar

function addSparkleEffect() {
  progressBar.classList.add("sparkle");
  progressBar.style.animation = "sparkle 1s infinite";
}

function removeSparkleEffect() {
  progressBar.classList.remove("sparkle");
  progressBar.style.animation = "none";
}

function addDynamicSpiralEffect() {
  progressBar.classList.add("dynamic-spiral");
  progressBar.style.animation = "dynamic-spiral 2s linear infinite";
}

function removeDynamicSpiralEffect() {
  progressBar.classList.remove("dynamic-spiral");
  progressBar.style.animation = "none";
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
  progressBar.style.width = progress + "%";
  progressBar.style.backgroundColor = colorProgress;
}

function startBar() {
  const now = new Date();

  // TODO desactiver la progressBar
  if (now.getHours() >= endHour) {
    console.log("Hors temps");
    return;
  }

  // TODO desactiver la progressBar
  if (now.getHours() < startHour) {
    const millisecondsUntilStart =
      new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour) -
      now;

    setTimeout(startBar, millisecondsUntilStart);
    console.log("Hors temps");
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

const container = document.createElement("div");
const backgroundbar = document.createElement("div");
const progressBar = document.createElement("div");

// Container CSS
container.style.position = "fixed";
container.style.bottom = "0";
container.style.left = "50%";
container.style.transform = "translate(-50%)";
container.style.width = widthBar;
container.style.height = heightBar;
container.style.backgroundColor = defaultColorBarBackground;
container.style.borderRadius = borderRadius;

// Background CSS
backgroundbar.style.width = "100%";
backgroundbar.style.height = "100%";
backgroundbar.style.backgroundColor = defaultColorBarBackground;
backgroundbar.style.opacity = "0.4";
backgroundbar.style.borderRadius = borderRadius;

// ProgressBar CSS
progressBar.style.width = "10%";
progressBar.style.height = "100%";
progressBar.style.backgroundColor = defaultColorProgress;
progressBar.style.borderRadius = borderRadius;

// ADD ProgressBar FIRST !!!
container.appendChild(progressBar);
container.appendChild(backgroundbar);
document.body.appendChild(container);

startBar();
