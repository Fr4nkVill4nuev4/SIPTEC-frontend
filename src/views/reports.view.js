function hydrateReports() {
  document.querySelectorAll("[data-report-tab]").forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.reportTab === state.reportTab,
    );
  });

  var source =
    state.reportTab === "generated"
      ? state.reports.filter((report) => report.type === "Daño")
      : state.reports.filter((report) => report.type !== "Daño");
  var reports = filterRows(source);

  document.querySelector("#reportsGrid").innerHTML = reports.length
    ? reports.map(reportCard).join("")
    : '<p class="muted">No hay reportes para mostrar.</p>';
}
function reportCard(report) {
  return `
    <article class="data-card">
      <div class="d-flex justify-content-between gap-2 align-items-start mb-2">
        <h3>${report.title}</h3>
        <span class="status available">${report.type}</span>
      </div>
      <p class="muted">Generado por ${report.author}. ${report.description}</p>
      <p class="muted">Fecha: ${formatDateTime(report.createdAt)}</p>
      <button class="btn btn-outline-primary btn-sm" data-view-report="${report.id}"><i class="bi bi-eye"></i> Ver</button>
      <div class="btn-group">
        <button class="btn btn-primary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="bi bi-download"></i> Exportar
        </button>
        <ul class="dropdown-menu">
          <li><button class="dropdown-item" type="button" data-export-report="${report.id}" data-export-format="txt">TXT</button></li>
          <li><button class="dropdown-item" type="button" data-export-report="${report.id}" data-export-format="pdf">PDF</button></li>
          <li><button class="dropdown-item" type="button" data-export-report="${report.id}" data-export-format="csv">CSV</button></li>
          <li><button class="dropdown-item" type="button" data-export-report="${report.id}" data-export-format="excel">Excel</button></li>
        </ul>
      </div>
      <button class="btn btn-outline-danger btn-sm" data-delete-report="${report.id}"><i class="bi bi-trash"></i></button>
    </article>
  `;
}
function openReportViewer(id) {
  var report = state.reports.find((item) => item.id === id);
  if (!report) {
    toast("Reporte no encontrado.");
    return;
  }
  state.viewedReport = report;
  document.querySelector("#reportViewerTitle").textContent = report.title;
  document.querySelector("#reportViewerContent").textContent =
    formatReportText(report);
  reportViewerModal.show();
}
