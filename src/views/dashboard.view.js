function hydrateDashboard() {
  var available = state.items.filter(
    (item) => item.status === "Disponible",
  ).length;
  var borrowed = state.items.filter(
    (item) => item.status === "Prestado",
  ).length;
  var pending = state.loans.filter(
    (loan) => loan.state === "Pendiente",
  ).length;
  var greeting = state.currentUser
    ? `${state.currentUser.firstName} ${state.currentUser.lastName}`
    : "Administrador";

  var title = document.querySelector("#viewRoot h2");
  if (title) title.textContent = `Bienvenido, ${greeting}`;

  var apiStatus = document.querySelector("#apiStatus");
  if (apiStatus) apiStatus.textContent = state.apiStatus;

  document.querySelector("#statsGrid").innerHTML = [
    stat("Inventario", state.items.length, "bi-box-seam", "#1aa6ff"),
    stat("Disponibles", available, "bi-check2-circle", "#35bd60"),
    stat("Préstamos", borrowed, "bi-arrow-left-right", "#ff9e1b"),
    stat("Solicitudes", pending, "bi-bell", "#a064ff"),
  ].join("");

  document.querySelector("#weeklyBars").innerHTML = [38, 72, 64, 82, 55, 44, 30]
    .map((value) => `<div class="bar" style="height:${value}%">${value}</div>`)
    .join("");

  document.querySelector("#inventoryLegend").innerHTML = `
    <span><i class="dot" style="background:var(--blue)"></i>Disponible ${available}</span>
    <span><i class="dot" style="background:#33c24d"></i>Prestado ${borrowed}</span>
    <span><i class="dot" style="background:#ffdd28"></i>Dañados ${state.items.length - available - borrowed}</span>
  `;

  document.querySelector("#recentActivity").innerHTML = historyTable(
    state.history.slice(0, 4),
  );
}
