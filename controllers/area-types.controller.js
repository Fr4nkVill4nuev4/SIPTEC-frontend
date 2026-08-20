/**
 * SIPTEC - Controlador de Tipos de Area
 * Muestra los tipos de area registrados en la API.
 */
document.addEventListener("DOMContentLoaded", () => {
  loadAreaTypes();
});

async function loadAreaTypes() {
  const tbody = document.querySelector("#areaTypesTableBody");
  const count = document.querySelector("#areaTypesCountText");
  if (!tbody || !window.areaTypesService) return;

  tbody.innerHTML = renderAreaTypesLoading();
  if (count) count.textContent = "Cargando...";

  try {
    const items = await areaTypesService.getAll();
    if (count) count.textContent = `${items.length} ${items.length === 1 ? "registro" : "registros"}`;
    renderAreaTypesTable(items);
  } catch (error) {
    console.warn("No se pudieron cargar los tipos de area.", error);
    if (count) count.textContent = "0 registros";
    tbody.innerHTML = renderAreaTypesEmpty("No se pudo consultar /api/tipoArea.");
  }
}

function renderAreaTypesTable(items) {
  const tbody = document.querySelector("#areaTypesTableBody");
  if (!tbody) return;

  if (!items.length) {
    tbody.innerHTML = renderAreaTypesEmpty("No hay tipos de area registrados en la API.");
    return;
  }

  tbody.innerHTML = items.map(item => `
    <tr>
      <td><span class="catalog-id-chip">${escapeHtml(areaTypesService.getId(item) || "-")}</span></td>
      <td>
        <div class="catalog-primary-cell">
          <span class="catalog-row-icon"><i class="bi bi-grid-3x3-gap"></i></span>
          <strong>${escapeHtml(areaTypesService.getName(item))}</strong>
        </div>
      </td>
      <td><span class="badge-pill-state disponible">API</span></td>
    </tr>
  `).join("");
}

function renderAreaTypesLoading() {
  return `
    <tr>
      <td colspan="3">
        <div class="catalog-empty-state">
          <div class="catalog-empty-icon"><i class="bi bi-arrow-repeat"></i></div>
          <strong>Cargando tipos de area</strong>
          <span>Consultando /api/tipoArea...</span>
        </div>
      </td>
    </tr>
  `;
}

function renderAreaTypesEmpty(message) {
  return `
    <tr>
      <td colspan="3">
        <div class="catalog-empty-state">
          <div class="catalog-empty-icon"><i class="bi bi-database-x"></i></div>
          <strong>Sin registros</strong>
          <span>${escapeHtml(message)}</span>
        </div>
      </td>
    </tr>
  `;
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
