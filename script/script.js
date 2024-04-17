let defaultColor = "#242424",
  widthBar = "1232px",
  heightBar = "8px",
  timerStep = 1 * 1000; // milliseconds

function createProgressBar() {
  const progressBar = document.createElement("div");
  //   progressBar.style.position = "fixed";
  progressBar.style.bottom = "0";
  //   progressBar.style.left = "0";
  progressBar.style.width = widthBar;
  progressBar.style.height = heightBar;
  //   progressBar.style.zIndex = "999999";
  progressBar.style.color = defaultColor;

  document.body.appendChild(progressBar);

  return progressBar;
}

const progressBar = createProgressBar();
setInterval(updateProgressBar, 60000);
