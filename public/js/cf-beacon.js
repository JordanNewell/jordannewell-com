// cf-beacon.js - Cloudflare Web Analytics loader.
// External file on purpose: prod CSP forbids inline JS. The beacon config
// (token) is NOT in this file - it is read at runtime from the
// <meta name="cf-beacon"> tag in BaseLayout, which keeps the token in the
// repo exactly where it lived before (rendered page head markup).
// The beacon is skipped on dev mirrors: any hostname starting with "dev."
// (dev.jordannewell.com, future dev.*) stays out of analytics.
// Injection keeps the old static tag's semantics: type=module (deferred).
(function () {
  "use strict";
  if (location.hostname.indexOf("dev.") === 0) return;
  var meta = document.querySelector('meta[name="cf-beacon"]');
  if (!meta || !meta.getAttribute("content")) return;
  var s = document.createElement("script");
  s.type = "module";
  s.src = "https://static.cloudflareinsights.com/beacon.min.js";
  s.setAttribute("data-cf-beacon", meta.getAttribute("content"));
  document.head.appendChild(s);
})();
