const indexPath = chrome.runtime.getURL("index.html");
const cssPath = chrome.runtime.getURL("styles.css");

function loadCSS(cssPath) {
  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = cssPath;
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

function injectHTML(html) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;

  // filter
  const cssLinks = wrapper.querySelectorAll("link[rel=stylesheet]");
  cssLinks.forEach((link) => link.remove());

  document.body.appendChild(wrapper);
}

// Récupération du contenu de index.html
loadCSS(cssPath).then(() => {
  fetch(indexPath)
    .then((response) => response.text())
    .then((htmlContent) => {
      // Injection du contenu HTML dans le DOM
      injectHTML(htmlContent);
    })
    .catch((error) =>
      console.error(
        "Erreur lors de la récupération du contenu de index.html :",
        error
      )
    );
});
