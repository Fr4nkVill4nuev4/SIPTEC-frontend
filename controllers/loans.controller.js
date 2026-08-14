/**
 * SIPTEC - Controlador de Préstamos
 * Maneja listado y panel de aprobación/rechazo de solicitudes de préstamo.
 */
let currentLoans = [];
let selectedLoanId = null;

document.addEventListener("DOMContentLoaded", () => {
  initLoansController();
});

async function initLoansController() {
  await loadLoans();
  bindLoansEvents();
}

async function loadLoans() {
  try {
    if (window.loansService) {
      currentLoans = await window.loansService.getAll();
      renderLoansTable(currentLoans);
      if (currentLoans.length && !selectedLoanId) {
        selectLoan(currentLoans[1] ? currentLoans[1].id : currentLoans[0].id);
      }
    }
  } catch (error) {
    console.warn("Usando filas maquetadas en HTML de préstamos.", error);
  }
}

function renderLoansTable(loans) {
  const tbody = document.querySelector("#loansTableBody");
  if (!tbody || !loans) return;

  tbody.innerHTML = loans.map(loan => {
    const isSelected = loan.id === selectedLoanId;

    return `
      <tr class="${isSelected ? 'table-active' : ''}" onclick="selectLoan(${loan.id})" style="cursor: pointer;">
        <td><strong>${escapeHtml(loan.code)}</strong></td>
        <td>${escapeHtml(loan.user || loan.student || "Usuario")}</td>
        <td>${escapeHtml(loan.startDate || "2026-06-13")}</td>
        <td>${escapeHtml(loan.product || loan.material || "Implemento")}</td>
      </tr>
    `;
  }).join("");
}

function selectLoan(id) {
  selectedLoanId = id;
  const loan = currentLoans.find(l => l.id === id);
  if (!loan) return;

  const titleEl = document.querySelector("#detailTitle");
  const badgeEl = document.querySelector("#detailBadge");
  const descEl = document.querySelector("#detailDescription");
  const stateEl = document.querySelector("#detailMaterialState");

  const state = loan.state || "Pendiente";
  const stateLower = state.toLowerCase();
  const pillClass = stateLower.includes("aprobado") ? "disponible" :
                    stateLower.includes("rechazado") ? "daniado" : "pendiente";

  if (titleEl) titleEl.textContent = `Préstamo ${loan.code}`;
  if (badgeEl) {
    badgeEl.className = `badge-pill-state ${pillClass}`;
    badgeEl.textContent = state;
  }
  if (descEl) descEl.textContent = loan.description || `${loan.user || "Usuario"} solicita ${loan.product || loan.material || "material"}.`;
  if (stateEl) stateEl.textContent = state;

  renderLoansTable(currentLoans);
}

function bindLoansEvents() {
  const searchInput = document.querySelector("#loansSearch, #globalSearch");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        renderLoansTable(currentLoans);
        return;
      }
      const filtered = currentLoans.filter(l =>
        (l.code && l.code.toLowerCase().includes(q)) ||
        (l.user && l.user.toLowerCase().includes(q)) ||
        (l.product && l.product.toLowerCase().includes(q))
      );
      renderLoansTable(filtered);
    });
  }

  // Botón Aprobar Préstamo
  const approveBtn = document.querySelector("#btnApproveLoan");
  if (approveBtn) {
    approveBtn.addEventListener("click", async () => {
      if (!selectedLoanId) return;
      try {
        await window.loansService.updateState(selectedLoanId, "Aprobado");
        showToast("Préstamo Aprobado exitosamente.", "success");
        await loadLoans();
        selectLoan(selectedLoanId);
      } catch (err) {
        showToast(err.message || "Error al aprobar.", "error");
      }
    });
  }

  // Botón Rechazar Préstamo
  const rejectBtn = document.querySelector("#btnRejectLoan");
  if (rejectBtn) {
    rejectBtn.addEventListener("click", async () => {
      if (!selectedLoanId) return;
      try {
        await window.loansService.updateState(selectedLoanId, "Rechazado");
        showToast("Préstamo Rechazado.", "warning");
        await loadLoans();
        selectLoan(selectedLoanId);
      } catch (err) {
        showToast(err.message || "Error al rechazar.", "error");
      }
    });
  }
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

window.selectLoan = selectLoan;
