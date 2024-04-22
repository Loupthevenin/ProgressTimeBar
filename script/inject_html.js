const indexPath = chrome.runtime.getURL("index.html");

function injectHTML(html) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);
}

// Récupération du contenu de index.html
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
