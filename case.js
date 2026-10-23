// Click a color capsule to copy its hex code
document.querySelectorAll(".cs-cap").forEach(function (cap) {
  cap.addEventListener("click", function () {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(cap.dataset.hex).then(function () {
      cap.classList.add("copied");
      setTimeout(function () { cap.classList.remove("copied"); }, 1300);
    }).catch(function () {});
  });
});

// Key features: hover or tap a feature to show its screen in the phone
(function () {
  var img = document.getElementById("fxImg");
  if (!img) return;
  var items = document.querySelectorAll(".cs-fx__item");
  function show(item) {
    if (item.classList.contains("is-active")) return;
    items.forEach(function (i) { i.classList.remove("is-active"); });
    item.classList.add("is-active");
    img.classList.add("is-fading");
    setTimeout(function () {
      img.src = item.dataset.img; img.alt = item.dataset.alt;
      img.classList.remove("is-fading");
    }, 220);
  }
  items.forEach(function (item) {
    item.addEventListener("mouseenter", function () { show(item); });
    item.addEventListener("click", function () { show(item); });
    item.addEventListener("focus", function () { show(item); });
  });
})();

// Screens: duplicate each column so the vertical scroll loops seamlessly
document.querySelectorAll(".cs-iso__track").forEach(function (track) {
  Array.prototype.slice.call(track.children).forEach(function (img) {
    var copy = img.cloneNode(true);
    copy.setAttribute("aria-hidden", "true");
    track.appendChild(copy);
  });
});
