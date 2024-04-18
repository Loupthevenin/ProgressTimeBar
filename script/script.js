let defaultColorBar = "#242424",
  colorProgress = "#97EF00";
(widthBar = "1232px"), (heightBar = "8px"), (startHour = 8);
(endHour = 17), (breakHour = 2), (totalHours = endHour - startHour - breakHour);
timerStep = 1 * 1000; // milliseconds

function createProgressBar() {
  const progressBar = document.createElement("div");

  progressBar.style.position = "fixed";
  progressBar.style.bottom = "0";
  progressBar.style.left = "0";
  progressBar.style.width = widthBar;
  progressBar.style.height = heightBar;
  progressBar.style.backgroundColor = defaultColorBar;

  document.body.appendChild(progressBar);

  return progressBar;
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

  progressBar.style.width = progress + "%";
  progressBar.style.backgroundColor = colorProgress;
}

const progressBar = createProgressBar();
setInterval(updateProgressBar, timerStep);
