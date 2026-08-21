/**
 * SIPTEC - Controlador Global de Layout
 * Maneja barra lateral, barra superior, tema claro/oscuro, fecha y usuario activo.
 */
document.addEventListener("DOMContentLoaded", () => {
  initLayout();
});

function initLayout() {
  initTheme();
  initDate();
  initUserProfile();
  applyRoleAccess();
  highlightActiveNav();

  // Botón de refresco
  const refreshBtn = document.querySelector("#refreshBtn");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => window.location.reload());
  }

  // Botones de logout
  document.querySelectorAll("#logoutBtn, [data-logout]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (window.authService) {
        authService.logout();
      } else {
        window.location.href = "../index.html";
      }
    });
  });
}

function initTheme() {
  const savedTheme = localStorage.getItem(SIPTEC_CONFIG.THEME_STORAGE_KEY) || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);

  const themeSwitch = document.querySelector("#themeSwitch");
  if (themeSwitch) {
    themeSwitch.checked = savedTheme === "dark";
    themeSwitch.addEventListener("change", (e) => {
      const newTheme = e.target.checked ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem(SIPTEC_CONFIG.THEME_STORAGE_KEY, newTheme);
    });
  }
}

function initDate() {
  const dateEl = document.querySelector("#dateText");
  if (dateEl) {
    const today = new Date();
    const months = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
    dateEl.textContent = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
  }
}

function initUserProfile() {
  const user = window.apiService ? window.apiService.getCurrentUser() : null;
  const userEl = document.querySelector("#userRoleText");
  if (userEl) {
    if (user && user.firstName) {
      userEl.textContent = `${user.firstName} ${user.lastName || ""} (${(user.role || "ADMINISTRADOR").toUpperCase()})`.trim();
    } else {
      userEl.textContent = "Admin Principal (ADMINISTRADOR)";
    }
  }
}

function highlightActiveNav() {
  const currentPath = window.location.pathname.toLowerCase();
  document.querySelectorAll(".nav-link-item").forEach(link => {
    const href = (link.getAttribute("href") || "").toLowerCase();
    if (href && currentPath.endsWith(href)) {
      link.classList.add("active");
    }
  });
}

function getCurrentRoleName() {
  const user = window.apiService ? window.apiService.getCurrentUser() : null;
  return String(user?.role || "ADMINISTRADOR").trim().toUpperCase();
}

function isLimitedUser() {
  const role = getCurrentRoleName();
  return role === "PROFESOR" || role === "USUARIO" || role === "USER";
}

function applyRoleAccess() {
  if (!isLimitedUser()) return;

  const allowedPages = new Set(["inventory.html", "loans.html", "history.html"]);
  const currentPage = (window.location.pathname.split(/[\\/]/).pop() || "").toLowerCase();

  if (currentPage && !allowedPages.has(currentPage)) {
    window.location.replace("inventory.html");
    return;
  }

  document.querySelectorAll(".nav-link-item[href]").forEach(link => {
    const href = (link.getAttribute("href") || "").split("#")[0].toLowerCase();
    const page = href.split("/").pop();
    if (page && !allowedPages.has(page)) {
      link.remove();
    }
  });
}

function getCurrentUserIdentity() {
  const user = window.apiService ? window.apiService.getCurrentUser() : null;
  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.replace(/\s+/g, " ").trim().toLowerCase();
  return {
    id: user?.id == null ? null : Number(user.id),
    email: String(user?.email || "").trim().toLowerCase(),
    fullName
  };
}

function belongsToCurrentUser(record) {
  if (!isLimitedUser()) return true;
  const current = getCurrentUserIdentity();
  const recordUserId = record?.userId ?? record?.usuarioId ?? record?.idUsuario ?? record?.raw?.idUsuario ?? record?.raw?.usuario?.id;
  if (current.id != null && recordUserId != null && Number(recordUserId) === current.id) return true;

  const recordEmail = String(record?.email || record?.correo || record?.raw?.correoUsuario || record?.raw?.usuario?.correoUsuario || "").trim().toLowerCase();
  if (current.email && recordEmail && recordEmail === current.email) return true;

  const recordName = String(record?.user || record?.student || record?.usuario || record?.raw?.nombreUsuario || "").replace(/\s+/g, " ").trim().toLowerCase();
  return Boolean(current.fullName && recordName && recordName === current.fullName);
}

window.isLimitedUser = isLimitedUser;
window.belongsToCurrentUser = belongsToCurrentUser;
// ==========================================
// UTILIDADES GLOBALES
// ==========================================
function showToast(message, type = "info") {
  let host = document.querySelector("#toastHost");
  if (!host) {
    host = document.createElement("div");
    host.id = "toastHost";
    host.style.cssText = "position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:10px;";
    document.body.appendChild(host);
  }

  const bg = type === "success" ? "#22c55e"
           : type === "error"   ? "#dc2626"
           : type === "warning" ? "#f59e0b"
           : "#0e2238";

  const toast = document.createElement("div");
  toast.style.cssText = `background:${bg};color:#fff;padding:12px 20px;border-radius:8px;font-size:13px;font-weight:600;box-shadow:0 4px 14px rgba(0,0,0,.3);border:1px solid rgba(255,255,255,.1);`;
  toast.textContent = message;
  host.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity .3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

window.showToast = showToast;

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Archivo descargado.", "success");
}

window.downloadFile = downloadFile;


