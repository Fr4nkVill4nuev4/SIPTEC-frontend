function getStoredTheme() {
  var savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme === "dark";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function applyTheme(isDark) {
  document.body.classList.toggle("dark-mode", isDark);
  window.localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
}
function syncThemeControl() {
  var themeSwitch = document.querySelector("#themeSwitch");
  if (themeSwitch) {
    themeSwitch.checked = document.body.classList.contains("dark-mode");
  }
}
