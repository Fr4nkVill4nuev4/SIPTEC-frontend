function defaultViewForRole() {
  if (state.currentUser?.role === "IT") return "inventory";
  return state.currentUser?.role === "EMPLEADO" ? "inventory" : "dashboard";
}
function ensureAllowedView() {
  if (!canAccessView(state.view)) {
    state.view = defaultViewForRole();
  }
}
function syncActiveNav() {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === state.view);
  });
}
function canAccessView(view) {
  var role = state.currentUser?.role;
  if (!role || role === "ADMINISTRADOR") return true;
  if (role === "IT") return ["inventory", "reports", "settings"].includes(view);
  if (role === "EMPLEADO")
    return ["inventory", "loans", "returns", "reports"].includes(view);
  return false;
}
function applyRoleAccess() {
  document.querySelectorAll(".nav-item").forEach((button) => {
    var allowed = canAccessView(button.dataset.view);
    button.classList.toggle("d-none", !allowed);
    if (!allowed && button.classList.contains("active")) {
      button.classList.remove("active");
      state.view = defaultViewForRole();
      syncActiveNav();
    }
  });
}
function canManageInventory() {
  return ["ADMINISTRADOR", "IT"].includes(state.currentUser?.role);
}
