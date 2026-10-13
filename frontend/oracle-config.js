/* Deployment configuration. Do not put secrets here. */
window.UROLOGY_ORACLE_AI_BASE_URL = "";

/* Campbell-Walsh-Wein 13e knowledge update. Kept modular so the large clinical
   workstation bundle can remain unchanged while the chapter index evolves. */
(function () {
  var cfgScript = document.currentScript;
  var base = cfgScript && cfgScript.src ? cfgScript.src : window.location.href;
  var script = document.createElement("script");
  script.src = new URL("campbell-13e-content.js", base).href;
  script.async = false;
  script.onerror = function () {
    console.warn("Campbell 13e knowledge layer could not be loaded.");
  };
  document.head.appendChild(script);
})();