chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  chrome.storage.local.set({ config: message.config }, function () {
    console.log("Donnee save dans inject");
  });

  window.postMessage({ config: message.config });

  sendResponse({ success: true, message: "Donnees mises à jour avec succès" });
});

// inject_html
fetch(chrome.runtime.getURL("index.html"))
  .then((response) => response.text())
  .then((html) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;

    // Load : index.html
    document.body.appendChild(wrapper);

    // Load : CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = chrome.runtime.getURL("styles.css");
    document.head.appendChild(link);

    // Load script
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("script/script.js");
    document.body.appendChild(script);
  });

window.addEventListener("message", function (event) {
  if (event.data.message === "Envois la config") {
    chrome.storage.local.get("config", function (data) {
      if (data.config) {
        console.log(data.config);
        var config = data.config;
        event.source.postMessage(
          { success: true, message: config },
          event.origin
        );
      }
    });
  }
});
