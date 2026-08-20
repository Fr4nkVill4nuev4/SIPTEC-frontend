/**
 * SIPTEC - Controlador de Devoluciones
 * Maneja tarjetas de implementos por devolver y reportes de daño.
 */
let currentReturns = [];
let activeReturnId = null;

document.addEventListener("DOMContentLoaded", () => {
  initReturnsController();
});

async function initReturnsController() {
  await loadReturns();
  bindReturnsEvents();
}

async function loadReturns() {
  try {
    if (window.returnsService) {
      currentReturns = await window.returnsService.getAll();
      renderReturnsGrid(currentReturns);
    }
  } catch (error) {
    console.warn("No se pudo cargar devoluciones desde la API.", error);
    currentReturns = [];
    renderReturnsGrid([]);
  }
}

function renderReturnsGrid(returns) {
  const grid = document.querySelector("#returnsGridContainer");
  if (!grid || !returns) return;

  if (returns.length === 0) {
    grid.innerHTML = `<div class="col-12 text-center text-muted p-4">No hay devoluciones pendientes.</div>`;
    return;
  }

  grid.innerHTML = returns.map(ret => {
    const status = ret.status || "En tiempo";
    const statusLower = status.toLowerCase();
    const pillClass = statusLower.includes("tiempo") ? "entiempo" :
                      statusLower.includes("revisión") || statusLower.includes("revision") ? "revision" : "retrasado";

    return `
      <div class="return-card-figma" data-id="${ret.id}">
        <div class="return-card-top-row">
          <span class="badge-pill-state ${pillClass}">${escapeHtml(status)}</span>
          <span class="return-code-dim">código: ${escapeHtml(ret.code)}</span>
        </div>
        <div class="return-person-name">${escapeHtml(ret.student || "Usuario")}</div>
        <div class="return-item-line">
          <i class="bi bi-box"></i> ${escapeHtml(ret.item)}
        </div>
        <div class="return-btn-row">
          <button class="btn-devuelto" onclick="processReturnDirect(${ret.id})">Devuelto</button>
          <button class="btn-reportar-dano" onclick="openDamageModal(${ret.id})">Reportar daño</button>
        </div>
      </div>
    `;
  }).join("");
}

function bindReturnsEvents() {
  const searchInput = document.querySelector("#returnsSearch, #globalSearch");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        renderReturnsGrid(currentReturns);
        return;
      }
      const filtered = currentReturns.filter(r =>
        (r.code && r.code.toLowerCase().includes(q)) ||
        (r.item && r.item.toLowerCase().includes(q)) ||
        (r.student && r.student.toLowerCase().includes(q))
      );
      renderReturnsGrid(filtered);
    });
  }

  // Formulario Reportar Daño
  const damageForm = document.querySelector("#reportDamageForm");
  if (damageForm) {
    damageForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!activeReturnId) return;
      const desc = document.querySelector("#damageDescription").value;

      try {
        await window.returnsService.reportDamage(activeReturnId, { description: desc });
        showToast("Reporte de daño registrado correctamente.", "warning");
        closeBootstrapModal("damageModal");
        await loadReturns();
      } catch (err) {
        showToast(err.message || "Error al reportar daño.", "error");
      }
    });
  }
}

async function processReturnDirect(id) {
  try {
    await window.returnsService.processReturn(id);
    showToast("Devolución registrada con éxito.", "success");
    await loadReturns();
  } catch (err) {
    showToast("Error al registrar devolución.", "error");
  }
}

function openDamageModal(id) {
  activeReturnId = id;
  const ret = currentReturns.find(r => r.id === id);
  if (!ret) return;

  const summary = document.querySelector("#damageSummaryText");
  if (summary) {
    summary.innerHTML = `${ret.code} - ${ret.item} entregado por ${ret.student || "Usuario"}`;
  }

  openBootstrapModal("damageModal");
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

function closeBootstrapModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) {
    if (window.bootstrap && bootstrap.Modal) {
      const modal = bootstrap.Modal.getInstance(el);
      if (modal) modal.hide();
    } else {
      el.classList.remove("show");
      el.style.display = "none";
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

window.processReturnDirect = processReturnDirect;
window.openDamageModal = openDamageModal;


