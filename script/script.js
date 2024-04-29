// let config = {
//   defaultColorProgress: "#97EF00",
//   morning: 4,
//   afternoon: 3,
//   startHour: 8,
//   endHour: 17,
//   breakHour: 2,
//   timerStep: 1000,
//   colorBreak: "#DC143C",
//   is_active: true,
// };

window.postMessage({ message: "Envois la config" }, "*");

window.addEventListener("message", function (event) {
  if (event.data.success) {
    let config = event.data.message;
    console.log("config script :", config);

    window.addEventListener("message", function (event) {
      if (event.source === window && event.data.config) {
        handleConfigChange(event.data.config);

        event.source.postMessage(
          { success: true, message: "Donnée mise à jour" },
          event.origin
        );

        // config.is_active ? activateProgressBar() : disableProgressBar();

        // breakBackgroundStyle();
      }
    });

    // Pensez a une blacklist de site dont on ne veut pas afficher la progressBar
    const element_backgroundID = document.getElementById("background_bar"),
      element_progressID = document.getElementById("progress_bar");

    // TODO Desactiver pendant certain jour : weekend etc

    function handleConfigChange(newConfig) {
      config.defaultColorProgress = newConfig.defaultColorProgress;
      config.morning = newConfig.morning;
      config.afternoon = newConfig.afternoon;
      config.startHour = newConfig.startHour;
      config.endHour = newConfig.endHour;
      config.breakHour = newConfig.breakHour;
      config.timerStep = newConfig.timerStep;
      config.colorBreak = newConfig.colorBreak;
      config.is_active = newConfig.is_active;
    }

    function breakBackgroundStyle() {
      const percentBreak12 =
        (config.morning / (config.endHour - config.startHour)) * 100;
      const percentBreak14 =
        ((config.morning + config.breakHour) /
          (config.endHour - config.startHour)) *
        100;

      element_backgroundID.style.background = `linear-gradient(to right, #242424 0%, #242424 ${percentBreak12.toFixed(
        2
      )}%, ${config.colorBreak} ${percentBreak12.toFixed(2)}%, ${
        config.colorBreak
      } ${percentBreak14.toFixed(2)}%, #242424 ${percentBreak14.toFixed(
        2
      )}%, #242424 100%)`;
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

      let progressBreak = (totalSeconds / (config.morning * 3600)) * 100;

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

      console.log(progressBreak);
      console.log(timer);

      let contentBreak =
        progressBreak > 100 || progress < 0
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
      if (currentHour < config.startHour + config.morning - 1) {
        element_progressID.classList = [];
      } else if (currentHour < config.startHour + config.morning) {
        // element_progressID.classList = [];
        element_progressID.classList.add("stripe");
      } else if (
        currentHour <
        config.startHour + config.morning + config.breakHour
      ) {
        element_progressID.classList = [];
        element_progressID.style.backgroundColor = config.colorBreak;
      } else if (currentHour < config.endHour - 1) {
        // effet scintillant ?
        element_progressID.classList = [];
        element_progressID.style.backgroundColor = config.defaultColorProgress;
      } else if (currentHour < config.endHour) {
        // multi color + scintillant ?
        element_progressID.classList = [];
        element_progressID.classList.add("glowing-multi-colors");
      }

      element_progressID.style.width = progress + "%";
    }

    function startBar() {
      const now = new Date();
      console.log("is_active :", config.is_active);

      if (config.is_active !== undefined && !config.is_active) {
        console.log("inactif");
        // disableProgressBar();
        return;
      }

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
      breakBackgroundStyle();
      console.log("Progress en cours");

      const intervalId = setInterval(() => {
        updateProgressBar();
        breakBackgroundStyle();

        if (new Date().getHours() >= config.endHour) {
          clearInterval(intervalId);
        }
      }, config.timerStep);
    }

    if (config.is_active) {
      breakBackgroundStyle();
      startBar();
    }
  }
});

// function sendMessageforConfig() {
//   return new Promise(function (resolve, reject) {
//     function handleMessage(event) {
//       if (event.data.success) {
//         window.removeEventListener("message", handleMessage);
//         config = event.data.message;
//         resolve();
//       }
//     }

//     window.addEventListener("message", handleMessage);
//     window.postMessage({ message: "Envois la config" }, "*");
//   });
// }

// sendMessageforConfig()
//   .then(function () {
//     console.log("Configuration reçue :", config);
//   })
//   .catch(function (error) {
//     console.log("Une erreur s'est produite :", error);
//   });
