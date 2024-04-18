let defaultColorBar = "#242424",
  colorProgress = "#97EF00",
  colorBreak = "#7107B9",
  widthBar = "99.899%",
  heightBar = "8px",
  borderRadius = "10px",
  startHour = 8,
  endHour = 17,
  breakHour = 2,
  totalHours = endHour - startHour,
  timerStep = 1 * 1000; // milliseconds

function updateProgressBar() {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentSecond = now.getSeconds();
  const totalSeconds =
    (currentHour - startHour) * 3600 + currentMinute * 60 + currentSecond;
  let progress = (totalSeconds / (totalHours * 3600)) * 100;
  progress = Math.max(0, Math.min(progress, 100));

  console.log(progress);
  progressBar.style.width = progress + "%";
  progressBar.style.backgroundColor = colorProgress;
}

// La bar apparait que a partir de 08:00 et part a 17:00
function startBar() {
  const now = new Date();

  if (now.getHours() >= endHour) {
    console.log("Hors temps");
    return;
  }

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
container.style.backgroundColor = defaultColorBar;
container.style.borderRadius = borderRadius;

// Background CSS
backgroundbar.style.width = "100%";
backgroundbar.style.height = "100%";
backgroundbar.style.backgroundColor = defaultColorBar;
backgroundbar.style.opacity = "0.4";
backgroundbar.style.borderRadius = borderRadius;

// ProgressBar CSS
progressBar.style.width = "10%";
progressBar.style.height = "100%";
progressBar.style.backgroundColor = colorProgress;
progressBar.style.borderRadius = borderRadius;

container.appendChild(progressBar);
container.appendChild(backgroundbar);
document.body.appendChild(container);

startBar();
