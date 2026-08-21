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
      greetingEl.textContent = user && user.firstName
        ? `Bienvenido, ${user.firstName} ${user.lastName || ""}`.trim()
        : "Bienvenido, Admin Principal";
    }

    const [items, loans] = await Promise.all([
      window.inventoryService ? window.inventoryService.getAll() : [],
      window.loansService ? window.loansService.getAll() : []
    ]);

    const totalItems = items.length;
    const availableItems = items.filter(i => normalize(i.status).includes("disponible")).length;
    const activeLoans = loans.filter(l => {
      const state = normalize(l.state);
      return state.includes("aprobado") || state.includes("prestado");
    }).length;
    const pendingLoans = loans.filter(l => normalize(l.state).includes("pendiente")).length;
    const damagedItems = items.filter(i => {
      const status = normalize(i.status);
      return status.includes("dan") || status.includes("mantenimiento");
    }).length;

    setText("#statTotalItems", totalItems);
    setText("#statActiveLoans", activeLoans);
    setText("#statPendingReturns", pendingLoans);
    setText("#statAvailableItems", availableItems);

    renderWeeklyLoansChart(loans);
    renderInventoryPie(availableItems, activeLoans, damagedItems);
    renderRecentActivity(loans);
  } catch (error) {
    console.warn("Error al refrescar dashboard desde la API.", error);
    ["#statTotalItems", "#statActiveLoans", "#statPendingReturns", "#statAvailableItems"].forEach(selector => setText(selector, "0"));
    renderWeeklyLoansChart([]);
    renderInventoryPie(0, 0, 0);
    renderRecentActivity([]);
  }
}

function renderWeeklyLoansChart(loans) {
  const chart = document.querySelector("#weeklyLoansChart");
  if (!chart) return;

  const days = buildLastSevenDays();
  const counts = days.map(day => loans.filter(loan => sameDate(getLoanStartDate(loan), day.date)).length);
  const max = Math.max(...counts, 1);

  chart.innerHTML = days.map((day, index) => {
    const count = counts[index];
    const height = count ? Math.max(16, Math.round((count / max) * 92)) : 8;
    return `
      <div class="bar-col" title="${day.label}: ${count} préstamos">
        <div class="bar-fill ${count ? "" : "is-empty"}" style="height: ${height}%;">${count}</div>
        <span class="bar-label">${day.short}</span>
      </div>
    `;
  }).join("");
}

function renderInventoryPie(available, borrowed, damaged) {
  const pie = document.querySelector("#inventoryPieChart");
  const total = available + borrowed + damaged;
  const borrowedEnd = total ? ((available + borrowed) / total) * 100 : 66;
  const availableEnd = total ? (available / total) * 100 : 34;

  if (pie) {
    pie.style.background = total
      ? `conic-gradient(#2f66ed 0 ${availableEnd}%, #16a34a ${availableEnd}% ${borrowedEnd}%, #d89200 ${borrowedEnd}% 100%)`
      : "conic-gradient(#2f66ed 0 34%, #16a34a 34% 66%, #d89200 66% 100%)";
    pie.classList.toggle("is-empty", !total);
  }

  setText("#legendAvailable", `Disponible ${available}`);
  setText("#legendBorrowed", `Prestado ${borrowed}`);
  setText("#legendMaintenance", `Dañados ${damaged}`);
}

function renderRecentActivity(loans) {
  const tbody = document.querySelector("#recentActivityTable");
  if (!tbody) return;

  const rows = loans
    .filter((item, index, arr) => arr.findIndex(other => Number(other.id) === Number(item.id)) === index)
    .sort((a, b) => String(getLoanStartDate(b) || "").localeCompare(String(getLoanStartDate(a) || "")))
    .slice(0, 5);

  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-muted py-4">No hay actividad reciente desde la API.</td></tr>`;
    return;
  }

  tbody.innerHTML = rows.map(item => {
    const state = item.state || item.status || "Sin estado";
    return `
      <tr>
        <td><strong>${escapeHtml(item.code || item.toolCode || item.id || "-")}</strong></td>
        <td>${escapeHtml(item.product || item.toolName || item.name || "Prestamo")}</td>
        <td>${escapeHtml(formatDate(getLoanStartDate(item)))}</td>
        <td>${escapeHtml(formatDate(item.expectedDate || item.endDate || item.returnDate || item.deliveryDate))}</td>
        <td>${escapeHtml(item.userName || item.user || item.employee || "-")}</td>
        <td><span class="badge-pill-state ${statusClass(state)}">${escapeHtml(state)}</span></td>
      </tr>
    `;
  }).join("");
}
function buildLastSevenDays() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    return {
      date,
      label: date.toLocaleDateString("es-SV", { weekday: "long", day: "2-digit", month: "short" }),
      short: date.toLocaleDateString("es-SV", { weekday: "short" }).replace(".", "")
    };
  });
}

function getLoanStartDate(loan) {
  return loan.startDate || loan.loanDate || loan.date || loan.fechaInicio || loan.inicio || "";
}

function sameDate(value, date) {
  if (!value) return false;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return false;
  return parsed.getFullYear() === date.getFullYear()
    && parsed.getMonth() === date.getMonth()
    && parsed.getDate() === date.getDate();
}

function formatDate(value) {
  if (!value) return "-";
  return String(value).split("T")[0];
}

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function statusClass(state) {
  const value = normalize(state);
  if (value.includes("retras")) return "retrasado";
  if (value.includes("pend")) return "prestado";
  if (value.includes("dan")) return "danado";
  return "disponible";
}

function setText(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.textContent = value;
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}




