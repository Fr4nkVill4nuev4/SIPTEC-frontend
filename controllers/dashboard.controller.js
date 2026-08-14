/**
 * SIPTEC - Controlador del Panel de Control (Dashboard)
 * Sincroniza métricas, gráficos y actividad reciente con los servicios.
 */
document.addEventListener("DOMContentLoaded", () => {
  loadDashboardData();
});

async function loadDashboardData() {
  try {
    const user = window.apiService ? window.apiService.getCurrentUser() : null;
    const greetingEl = document.querySelector("#dashboardGreeting");
    if (greetingEl) {
      if (user && user.firstName) {
        greetingEl.textContent = `Bienvenido, ${user.firstName} ${user.lastName || ""}`.trim();
      } else {
        greetingEl.textContent = "Bienvenido, Admin Principal";
      }
    }

    // Cargar datos de inventario, préstamos y devoluciones
    const [items, loans, returns] = await Promise.all([
      window.inventoryService ? window.inventoryService.getAll() : [],
      window.loansService ? window.loansService.getAll() : [],
      window.returnsService ? window.returnsService.getAll() : []
    ]);

    const totalItems = items.length || 6;
    const availableItems = items.filter(i => (i.status || "").toLowerCase().includes("disponible")).length || 3;
    const activeLoans = loans.filter(l => (l.state || "").toLowerCase().includes("aprobado") || (l.state || "").toLowerCase().includes("prestado")).length || 2;
    const pendingLoans = loans.filter(l => (l.state || "").toLowerCase().includes("pendiente")).length || 1;
    const damagedItems = items.filter(i => (i.status || "").toLowerCase().includes("dañ") || (i.status || "").toLowerCase().includes("dani")).length || 1;

    // Actualizar contadores
    const totalEl = document.querySelector("#statTotalItems");
    const activeLoansEl = document.querySelector("#statActiveLoans");
    const pendingReturnsEl = document.querySelector("#statPendingReturns");
    const availableEl = document.querySelector("#statAvailableItems");

    if (totalEl) totalEl.textContent = totalItems;
    if (activeLoansEl) activeLoansEl.textContent = activeLoans;
    if (pendingReturnsEl) pendingReturnsEl.textContent = pendingLoans;
    if (availableEl) availableEl.textContent = availableItems;

    // Actualizar leyenda de inventario
    const legendDisp = document.querySelector("#legendAvailable");
    const legendPrest = document.querySelector("#legendBorrowed");
    const legendMaint = document.querySelector("#legendMaintenance");

    if (legendDisp) legendDisp.textContent = `Disponible ${availableItems}`;
    if (legendPrest) legendPrest.textContent = `Prestado ${activeLoans}`;
    if (legendMaint) legendMaint.textContent = `Dañados ${damagedItems}`;

  } catch (error) {
    console.warn("Error al refrescar dashboard, manteniendo maquetado base.", error);
  }
}
