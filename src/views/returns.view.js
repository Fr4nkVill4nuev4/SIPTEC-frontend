function hydrateReturns() {
  var canCloseReturn = ["ADMINISTRADOR", "IT"].includes(
    state.currentUser?.role,
  );
  document.querySelector("#returnsGrid").innerHTML = state.returns.length
    ? state.returns
        .map(
          (item) => `
    <article class="data-card">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="${statusClass(item.status)}">${item.status}</span>
        <small class="muted">código: ${item.code}</small>
      </div>
      <h3>${item.student}</h3>
      <p class="mb-1"><i class="bi bi-box"></i> ${item.item}</p>
      ${canCloseReturn ? `<button class="btn btn-success btn-sm" data-return="${item.id}">Devuelto</button>` : ""}
      <button class="btn btn-warning btn-sm" data-report-return="${item.id}">Reportar daño</button>
    </article>
  `,
        )
        .join("")
    : '<p class="muted">No hay devoluciones pendientes.</p>';
}
