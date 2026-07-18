function hydrateLoans() {
  var isEmployee = state.currentUser?.role === "EMPLEADO";
  var canApproveLoans = state.currentUser?.role === "ADMINISTRADOR";
  var selected =
    state.currentLoan ||
    state.loans.find((loan) => loan.state === "Pendiente") ||
    state.loans[0];

  document.querySelector("#loansTable").innerHTML = filterRows(state.loans)
    .map(
      (loan) => `
    <tr role="button" data-select-loan="${loan.id}" class="${selected?.id === loan.id ? "table-active" : ""}">
      <td>${loan.code}</td><td>${loan.student}</td><td>${loan.date}</td><td>${loan.item}</td>
    </tr>
  `,
    )
    .join("");

  if (isEmployee) {
    var today = new Date().toISOString().slice(0, 10);
    var availableItems = state.items.filter(
      (item) => item.status === "Disponible",
    );
    document.querySelector("#loanDetails").innerHTML = `
      <strong>Solicitar préstamo</strong>
      <p class="muted mt-2">Selecciona una herramienta disponible. Tu solicitud quedará pendiente hasta que Administrador la apruebe.</p>
      <form id="loanRequestForm" class="d-grid gap-3 mt-3">
        <label class="form-label">Herramienta disponible
          <select class="form-select" name="inventoryId" required ${availableItems.length ? "" : "disabled"}>
            <option value="">Selecciona una herramienta</option>
            ${availableItems.map((item) => `<option value="${item.id}">${item.code} - ${item.name}</option>`).join("")}
          </select>
        </label>
        <label class="form-label">Fecha de inicio
          <input class="form-control" type="date" name="startDate" value="${today}" required>
        </label>
        <label class="form-label">Fecha de entrega
          <input class="form-control" type="date" name="endDate" value="${today}" required>
        </label>
        <button class="btn btn-primary" type="submit" ${availableItems.length ? "" : "disabled"}>
          <i class="bi bi-send"></i> Enviar solicitud
        </button>
      </form>
      ${
        selected
          ? `
        <hr>
        <p class="muted mb-1">Última solicitud seleccionada</p>
        <div class="d-flex justify-content-between align-items-center">
          <strong>${selected.code}</strong>
          <span class="${statusClass(selected.state)}">${selected.state}</span>
        </div>
        <p class="mb-0">${selected.item} - ${selected.date}</p>
      `
          : '<p class="muted mt-3">Todavía no tienes solicitudes registradas.</p>'
      }
    `;
    return;
  }

  if (!selected) {
    document.querySelector("#loanDetails").innerHTML =
      '<p class="muted">No hay préstamos registrados.</p>';
    return;
  }

  document.querySelector("#loanDetails").innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <strong>Préstamo ${selected.code}</strong>
      <span class="${statusClass(selected.state)}">${selected.state}</span>
    </div>
    <p class="muted mb-1">Descripción</p>
    <div class="bg-white rounded p-3 mb-3 text-dark">${selected.student} solicita ${selected.item}.</div>
    <p class="muted mb-1">Estado del material</p>
    <strong>${selected.state}</strong>
    ${
      canApproveLoans
        ? `
          <div class="d-grid gap-2 mt-4">
            <button class="btn btn-success" data-loan-action="Aprobado" data-id="${selected.id}" ${selected.state !== "Pendiente" ? "disabled" : ""}>
              <i class="bi bi-check-lg"></i> Aprobar Préstamo
            </button>
            <button class="btn btn-danger" data-loan-action="Rechazado" data-id="${selected.id}" ${selected.state !== "Pendiente" ? "disabled" : ""}>
              <i class="bi bi-x-lg"></i> Rechazar Préstamo
            </button>
          </div>
        `
        : '<p class="muted mt-4">Tu rol puede revisar la solicitud, pero no aprobarla ni rechazarla.</p>'
    }
  `;
}
