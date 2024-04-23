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
