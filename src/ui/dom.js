var appShell = document.querySelector("#appShell");
var loginError = document.querySelector("#loginError");
var itemModal = new bootstrap.Modal("#itemModal");
var itemEditModal = new bootstrap.Modal("#itemEditModal");
var userModal = new bootstrap.Modal("#userModal");
var userEditModal = new bootstrap.Modal("#userEditModal");
var damageReportModal = new bootstrap.Modal("#damageReportModal");
var reportViewerModal = new bootstrap.Modal("#reportViewerModal");

document.querySelector("#dateText").textContent = new Intl.DateTimeFormat(
  "es-GT",
  {
    day: "2-digit",
    month: "short",
    year: "numeric",
  },
).format(new Date());


function updateUserChip() {
  var chip = document.querySelector(".user-chip span");
  if (chip && state.currentUser) {
    chip.textContent = `${state.currentUser.firstName} ${state.currentUser.lastName} (${state.currentUser.role})`;
  }
}
function toast(message) {
  var host = document.querySelector("#toastHost");
  var node = document.createElement("div");
  node.className = "toast align-items-center text-bg-dark border-0";
  node.role = "alert";
  node.innerHTML = `<div class="d-flex"><div class="toast-body">${message}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button></div>`;
  host.appendChild(node);
  var instance = new bootstrap.Toast(node, { delay: 2200 });
  instance.show();
  node.addEventListener("hidden.bs.toast", () => node.remove());
}
