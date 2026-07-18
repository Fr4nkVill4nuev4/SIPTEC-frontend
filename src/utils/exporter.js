function formatReportText(report) {
  return [
    `SIPTEC - ${report.title}`,
    `Tipo: ${report.type}`,
    `Generado por: ${report.author}`,
    `Fecha: ${formatDateTime(report.createdAt)}`,
    report.content,
  ].join("\n");
}
function reportBaseFilename(report) {
  return (
    report.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-|-$/g, "") || "reporte"
  );
}
function exportReport(report, format) {
  var normalized = String(format || "txt").toLowerCase();
  var filename = reportBaseFilename(report);

  if (normalized === "pdf") {
    openPrintablePdf(report);
    return;
  }

  if (normalized === "csv") {
    downloadFile(
      `${filename}.csv`,
      formatReportCsv(report),
      "text/csv;charset=utf-8",
    );
    return;
  }

  if (normalized === "excel") {
    downloadFile(
      `${filename}.xls`,
      formatReportExcel(report),
      "application/vnd.ms-excel;charset=utf-8",
    );
    return;
  }

  downloadFile(
    `${filename}.txt`,
    formatReportText(report),
    "text/plain;charset=utf-8",
  );
}
function formatReportCsv(report) {
  var rows = [
    ["Campo", "Valor"],
    ["Título", report.title],
    ["Tipo", report.type],
    ["Generado por", report.author],
    ["Fecha", formatDateTime(report.createdAt)],
    ["Descripción", report.description],
    ["Contenido", report.content],
  ];
  return `\ufeff${rows.map((row) => row.map(csvCell).join(",")).join("\n")}`;
}
function csvCell(value) {
  return `"${String(value || "").replace(/"/g, '""')}"`;
}
function formatReportExcel(report) {
  var rows = [
    ["Título", report.title],
    ["Tipo", report.type],
    ["Generado por", report.author],
    ["Fecha", formatDateTime(report.createdAt)],
    ["Descripción", report.description],
    ["Contenido", report.content],
  ];

  return `
    <html>
      <head><meta charset="UTF-8"></head>
      <body>
        <table border="1">
          ${rows
            .map(
              (row) => `
            <tr>
              <th>${escapeHtml(row[0])}</th>
              <td>${escapeHtml(row[1]).replace(/\n/g, "<br>")}</td>
            </tr>
          `,
            )
            .join("")}
        </table>
      </body>
    </html>
  `;
}
function openPrintablePdf(report) {
  var printWindow = window.open("", "_blank");
  if (!printWindow) {
    toast("Permite ventanas emergentes para exportar PDF.");
    return;
  }

  printWindow.document.write(`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>${escapeHtml(report.title)}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
        <style>
          body { font-family: "IBM Plex Sans", Helvetica, Arial, sans-serif; margin: 40px; color: #102235; }
          h1 { margin-bottom: 8px; color: #001f3d; }
          .meta { color: #5f6f80; margin-bottom: 24px; }
          pre { white-space: pre-wrap; line-height: 1.55; font-family: inherit; }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(report.title)}</h1>
        <div class="meta">
          <strong>Tipo:</strong> ${escapeHtml(report.type)}<br>
          <strong>Generado por:</strong> ${escapeHtml(report.author)}<br>
          <strong>Fecha:</strong> ${escapeHtml(formatDateTime(report.createdAt))}
        </div>
        <pre>${escapeHtml(report.content)}</pre>
        <script>
          window.addEventListener("load", () => {
            window.print();
          });
        <\/script>
      </body>
    </html>
  `);
  printWindow.document.close();
  toast("Vista PDF abierta. Elige Guardar como PDF.");
}
function exportHistory(format) {
  var normalized = String(format || "csv").toLowerCase();

  if (normalized === "pdf") {
    openHistoryPdf();
    return;
  }

  if (normalized === "txt") {
    downloadFile(
      "historial-siptec.txt",
      formatHistoryText(),
      "text/plain;charset=utf-8",
    );
    return;
  }

  if (normalized === "excel") {
    downloadFile(
      "historial-siptec.xls",
      formatHistoryExcel(),
      "application/vnd.ms-excel;charset=utf-8",
    );
    return;
  }

  downloadFile(
    "historial-siptec.csv",
    formatHistoryCsv(),
    "text/csv;charset=utf-8",
  );
}
function historyRows() {
  return state.history.map((row) => [
    row.code,
    row.item,
    row.start,
    row.end,
    row.user,
    row.status,
  ]);
}
function formatHistoryText() {
  var lines = [
    "SIPTEC - Historial",
    `Generado: ${new Intl.DateTimeFormat("es-GT", { dateStyle: "short", timeStyle: "short" }).format(new Date())}`,
    "",
    "Código | Herramienta | Inicio | Entrega | Usuario | Estado",
    ...historyRows().map((row) => row.join(" | ")),
  ];
  return lines.join("\n");
}
function formatHistoryCsv() {
  var rows = [
    ["Código", "Herramienta", "Inicio", "Entrega", "Usuario", "Estado"],
    ...historyRows(),
  ];
  return `\ufeff${rows.map((row) => row.map(csvCell).join(",")).join("\n")}`;
}
function formatHistoryExcel() {
  var rows = [
    ["Código", "Herramienta", "Inicio", "Entrega", "Usuario", "Estado"],
    ...historyRows(),
  ];

  return `
    <html>
      <head><meta charset="UTF-8"></head>
      <body>
        <table border="1">
          ${rows
            .map(
              (row, index) => `
            <tr>
              ${row.map((cell) => (index === 0 ? `<th>${escapeHtml(cell)}</th>` : `<td>${escapeHtml(cell)}</td>`)).join("")}
            </tr>
          `,
            )
            .join("")}
        </table>
      </body>
    </html>
  `;
}
function openHistoryPdf() {
  var printWindow = window.open("", "_blank");
  if (!printWindow) {
    toast("Permite ventanas emergentes para exportar PDF.");
    return;
  }

  var rows = historyRows();
  var author = state.currentUser
    ? `${state.currentUser.firstName} ${state.currentUser.lastName}`
    : "Sistema";
  printWindow.document.write(`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Historial SIPTEC de prestamo de bienes</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
        <style>
          body { font-family: "IBM Plex Sans", Helvetica, Arial, sans-serif; margin: 32px; color: #102235; }
          h1 { color: #001f3d; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { border: 1px solid #c8d3de; padding: 8px; text-align: left; }
          th { background: #eaf0f6; }
        </style>
      </head>
      <body>
        <h1>Historial SIPTEC de prestamo de bienes</h1>
        <p>Generado por: ${escapeHtml(author)}</p>
        <p>Fecha: ${escapeHtml(new Intl.DateTimeFormat("es-GT", { dateStyle: "short", timeStyle: "short" }).format(new Date()))}</p>
        <table>
          <thead>
            <tr><th>Código</th><th>Herramienta</th><th>Inicio</th><th>Entrega</th><th>Usuario</th><th>Estado</th></tr>
          </thead>
          <tbody>
            ${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>
        <script>
          window.addEventListener("load", () => {
            window.print();
          });
        <\/script>
      </body>
    </html>
  `);
  printWindow.document.close();
  toast("Vista PDF abierta. Elige Guardar como PDF.");
}
function downloadText(filename, text) {
  downloadFile(filename, text, "text/plain;charset=utf-8");
}
function downloadFile(filename, content, type) {
  var blob = new Blob([content], { type });
  var url = URL.createObjectURL(blob);
  var link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
  toast("Archivo generado.");
}
