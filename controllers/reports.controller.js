/**
 * SIPTEC - Controlador de Reportes
 * Maneja pestañas, visor y exportaciones multiformato.
 */
let currentReports = [];
let activeTab = "history";

document.addEventListener("DOMContentLoaded", () => {
  initReportsController();
});

async function initReportsController() {
  await loadReports();
  bindReportsEvents();
}

async function loadReports() {
  try {
    if (window.reportsService) {
      currentReports = await window.reportsService.getAll();
      renderReportsGrid();
    }
  } catch (error) {
    console.warn("Usando tarjetas maquetadas en HTML de reportes.", error);
  }
}

function renderReportsGrid() {
  const container = document.querySelector("#reportsGridContainer");
  if (!container || !currentReports) return;

  const filtered = activeTab === "history"
    ? currentReports.filter(r => (r.type || "").toLowerCase().includes("general") || r.id <= 2)
    : currentReports.filter(r => (r.type || "").toLowerCase().includes("daño") || r.id > 2);

  if (filtered.length === 0) {
    container.innerHTML = `<div class="col-12 text-center text-muted p-4">No hay reportes en esta sección.</div>`;
    return;
  }

  container.innerHTML = filtered.map(rep => {
    const isDamage = (rep.type || "").toLowerCase().includes("daño");
    const badgeClass = isDamage ? "daniado" : "activo";

    return `
      <div class="report-card-figma" data-id="${rep.id}">
        <div class="d-flex justify-content-between align-items-center">
          <strong style="font-size: 15px;">${escapeHtml(rep.title)}</strong>
          <span class="badge-pill-state ${badgeClass}">${escapeHtml(rep.type || "General")}</span>
        </div>
        <p class="text-muted mb-0" style="font-size: 12.5px;">Generado por ${escapeHtml(rep.author || "Admin Principal")}. ${escapeHtml(rep.description || "")}</p>
        <div class="text-dim" style="font-size: 11.5px;">Fecha: ${escapeHtml(rep.createdAt || "15/07/26, 9:24 p. m.")}</div>
        <div class="d-flex align-items-center gap-2 mt-2">
          <button class="btn-siptec-outline btn-siptec-sm" onclick="openReportViewer(${rep.id})"><i class="bi bi-eye"></i> Ver</button>
          <div class="dropdown">
            <button class="btn-siptec-blue btn-siptec-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
              <i class="bi bi-download"></i> Exportar
            </button>
            <ul class="dropdown-menu siptec-dropdown">
              <li><button class="dropdown-item" onclick="exportSingleReport(${rep.id}, 'txt')">Texto (.TXT)</button></li>
              <li><button class="dropdown-item" onclick="exportSingleReport(${rep.id}, 'pdf')">Imprimir PDF</button></li>
              <li><button class="dropdown-item" onclick="exportSingleReport(${rep.id}, 'csv')">Archivo CSV</button></li>
              <li><button class="dropdown-item" onclick="exportSingleReport(${rep.id}, 'excel')">Excel (.XLS)</button></li>
            </ul>
          </div>
          <button class="btn-report-trash" onclick="deleteReportDirect(${rep.id})" title="Eliminar"><i class="bi bi-trash"></i></button>
        </div>
      </div>
    `;
  }).join("");
}

function bindReportsEvents() {
  const tabs = document.querySelectorAll(".report-tab-pill");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      activeTab = tab.getAttribute("data-tab") || "history";
      renderReportsGrid();
    });
  });
}

function openReportViewer(id) {
  const rep = currentReports.find(r => r.id === id);
  if (!rep) return;

  const titleEl = document.querySelector("#reportModalTitle");
  const metaEl = document.querySelector("#reportModalMeta");
  const contentEl = document.querySelector("#reportModalContent");

  if (titleEl) titleEl.textContent = rep.title;
  if (metaEl) metaEl.textContent = `Generado por ${rep.author || "Admin"} • ${rep.createdAt || ""}`;
  if (contentEl) contentEl.textContent = rep.content || rep.description || "Sin contenido adicional.";

  openBootstrapModal("reportViewerModal");
}

function exportSingleReport(id, format) {
  const rep = currentReports.find(r => r.id === id);
  if (!rep) return;

  const content = `SIPTEC - REPORTE\n===============================\nTítulo: ${rep.title}\nTipo: ${rep.type}\nFecha: ${rep.createdAt}\nAutor: ${rep.author}\n\nDescripción:\n${rep.description}\n\nDetalle:\n${rep.content || ""}`;

  if (format === "pdf") {
    openReportViewer(id);
    window.print();
  } else {
    downloadFile(`reporte_${rep.id}.${format === "excel" ? "xls" : format}`, content, "text/plain");
    showToast(`Reporte exportado como .${format.toUpperCase()}`, "success");
  }
}

async function deleteReportDirect(id) {
  if (!confirm("¿Deseas eliminar este reporte?")) return;
  try {
    currentReports = currentReports.filter(r => r.id !== id);
    if (window.SIPTEC_MOCK_DATA) {
      window.SIPTEC_MOCK_DATA.saveReports(currentReports);
    }
    showToast("Reporte eliminado.", "info");
    renderReportsGrid();
  } catch (err) {
    showToast("Error al eliminar.", "error");
  }
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function openBootstrapModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) {
    if (window.bootstrap && bootstrap.Modal) {
      const modal = bootstrap.Modal.getOrCreateInstance(el);
      modal.show();
    } else {
      el.classList.add("show");
      el.style.display = "block";
    }
  }
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

window.openReportViewer = openReportViewer;
window.exportSingleReport = exportSingleReport;
window.deleteReportDirect = deleteReportDirect;
