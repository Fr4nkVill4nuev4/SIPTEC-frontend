function hydrateHistory() {
  document.querySelector("#historyTable").innerHTML = state.history.length
    ? historyTable(state.history)
    : '<p class="muted">No hay registros en el historial.</p>';
  syncThemeControl();
}
function historyTable(rows) {
  return `
    <table class="sip-table">
      <thead><tr><th>Código</th><th>Herramienta</th><th>Inicio</th><th>Entrega</th><th>Usuario</th><th>Estado</th></tr></thead>
      <tbody>${rows
        .map(
          (row) => `
        <tr><td>${row.code}</td><td>${row.item}</td><td>${row.start}</td><td>${row.end}</td><td>${row.user}</td><td><span class="${statusClass(row.status)}">${row.status}</span></td></tr>
      `,
        )
        .join("")}</tbody>
    </table>
  `;
}
