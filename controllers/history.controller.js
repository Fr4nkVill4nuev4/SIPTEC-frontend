/**
 * SIPTEC - Controlador de Historial
 * Maneja tabla de trazabilidad histórica y exportación consolidada.
 */
let currentHistory = [];

document.addEventListener("DOMContentLoaded", () => {
  initHistoryController();
});

async function initHistoryController() {
  await loadHistory();
  bindHistoryEvents();
}

async function loadHistory() {
  try {
    if (window.historyService) {
      currentHistory = await window.historyService.getAll();
      if (window.isLimitedUser && window.isLimitedUser()) {
        currentHistory = currentHistory.filter(item => window.belongsToCurrentUser && window.belongsToCurrentUser(item));
      }
      renderHistoryTable(currentHistory);
    }
  } catch (error) {
    console.warn("No se pudo cargar historial desde la API.", error);
    currentHistory = [];
    renderHistoryTable([]);
  }
}

function renderHistoryTable(history) {
  const tbody = document.querySelector("#historyTableBody");
  if (!tbody || !history) return;

  tbody.innerHTML = history.map(h => {
    const status = h.status || "Devuelto";
    const statusLower = status.toLowerCase();
    const pillClass = statusLower.includes("devuelto") ? "devuelto" :
                      statusLower.includes("disponible") ? "disponible" :
                      statusLower.includes("prestado") ? "prestado" : "retrasado";

    return `
      <tr>
        <td><strong>${escapeHtml(h.code)}</strong></td>
        <td>${escapeHtml(h.item || h.material || "Implemento técnico")}</td>
        <td>${escapeHtml(h.start || "2026-06-10")}</td>
        <td>${escapeHtml(h.end || "2026-06-13")}</td>
        <td>${escapeHtml(h.user || "Usuario")}</td>
        <td><span class="badge-pill-state ${pillClass}">${escapeHtml(status)}</span></td>
      </tr>
    `;
  }).join("");
}

function bindHistoryEvents() {
  const searchInput = document.querySelector("#historySearch, #globalSearch");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        renderHistoryTable(currentHistory);
        return;
      }
      const filtered = currentHistory.filter(h =>
        (h.code && h.code.toLowerCase().includes(q)) ||
        (h.item && h.item.toLowerCase().includes(q)) ||
        (h.user && h.user.toLowerCase().includes(q)) ||
        (h.status && h.status.toLowerCase().includes(q))
      );
      renderHistoryTable(filtered);
    });
  }

  // Exportar historial
  document.querySelectorAll("[data-export-history]").forEach(btn => {
    btn.addEventListener("click", () => {
      exportFullHistory(btn.dataset.exportHistory);
    });
  });
}

function exportFullHistory(format) {
  if (!currentHistory || currentHistory.length === 0) {
    showToast("No hay datos de historial para exportar.", "warning");
    return;
  }

  if (format === "txt") {
    let text = "SIPTEC - HISTORIAL DE MOVIMIENTOS\nCódigo | Herramienta | Inicio | Entrega | Usuario | Estado\n";
    text += currentHistory.map(h => `${h.code} | ${h.item} | ${h.start} | ${h.end} | ${h.user} | ${h.status}`).join("\n");
    downloadFile("historial-siptec.txt", text, "text/plain;charset=utf-8");
  } else if (format === "csv") {
    let csv = '\ufeff"Código","Herramienta","Inicio","Entrega","Usuario","Estado"\n';
    csv += currentHistory.map(h => `"${h.code}","${h.item}","${h.start}","${h.end}","${h.user}","${h.status}"`).join("\n");
    downloadFile("historial-siptec.csv", csv, "text/csv;charset=utf-8");
  } else if (format === "excel") {
    let html = '<html><head><meta charset="utf-8"></head><body><table border="1"><tr><th>Código</th><th>Herramienta</th><th>Inicio</th><th>Entrega</th><th>Usuario</th><th>Estado</th></tr>';
    html += currentHistory.map(h => `<tr><td>${h.code}</td><td>${h.item}</td><td>${h.start}</td><td>${h.end}</td><td>${h.user}</td><td>${h.status}</td></tr>`).join("");
    html += '</table></body></html>';
    downloadFile("historial-siptec.xls", html, "application/vnd.ms-excel;charset=utf-8");
  } else if (format === "pdf") {
    window.print();
  }
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

window.exportFullHistory = exportFullHistory;



