/**
 * SIPTEC - Controlador de Areas dentro de Herramientas / Areas.
 */
let currentAreasItems = [];

document.addEventListener("DOMContentLoaded", () => {
  setupToolsAreasTabs();
  loadAreas();

  const search = document.querySelector("#areasSearch");
  if (search) {
    search.addEventListener("input", () => renderAreasTable(filterAreas(search.value)));
  }

  const inlineInventorySearch = document.querySelector("#inventorySearchInline");
  const topbarInventorySearch = document.querySelector("#inventorySearch");
  if (inlineInventorySearch && topbarInventorySearch) {
    inlineInventorySearch.addEventListener("input", () => {
      topbarInventorySearch.value = inlineInventorySearch.value;
      topbarInventorySearch.dispatchEvent(new Event("input", { bubbles: true }));
    });
  }
});

function setupToolsAreasTabs() {
  document.querySelectorAll("[data-tools-tab]").forEach((tab) => {
    tab.addEventListener("click", () => activateToolsAreasTab(tab.dataset.toolsTab));
  });
}

function activateToolsAreasTab(name) {
  document.querySelectorAll("[data-tools-tab]").forEach((tab) => {
    const active = tab.dataset.toolsTab === name;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  document.querySelectorAll("[data-tools-panel]").forEach((panel) => {
    panel.classList.toggle("d-none", panel.dataset.toolsPanel !== name);
  });

  document.querySelectorAll("[data-tools-actions]").forEach((actions) => {
    actions.classList.toggle("d-none", actions.dataset.toolsActions !== name);
  });
}

async function loadAreas() {
  const tbody = document.querySelector("#areasTableBody");
  if (!tbody || !window.areasService) return;

  tbody.innerHTML = renderAreasLoading();
  try {
    currentAreasItems = await areasService.getAll();
    renderAreasTable(currentAreasItems);
  } catch (error) {
    console.warn("No se pudieron cargar las areas.", error);
    tbody.innerHTML = renderAreasEmpty("No se pudo consultar /api/area.");
  }
}

function filterAreas(query) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return currentAreasItems;
  return currentAreasItems.filter((area) =>
    areasService.getName(area).toLowerCase().includes(q) ||
    areasService.getTypeName(area).toLowerCase().includes(q)
  );
}

function renderAreasTable(items) {
  const tbody = document.querySelector("#areasTableBody");
  if (!tbody) return;

  if (!items.length) {
    tbody.innerHTML = renderAreasEmpty("No hay areas registradas en la API.");
    return;
  }

  tbody.innerHTML = items.map((area) => `
    <tr>
      <td><strong>${escapeHtml(areasService.getName(area))}</strong></td>
      <td>${escapeHtml(areasService.getTypeName(area))}</td>
      <td><span class="badge-pill-state disponible">${countAssignedTools(area)} herramientas</span></td>
      <td>
        <div class="action-btn-group">
          <button class="btn-table-action" type="button" title="Editar área" disabled><i class="bi bi-pencil"></i></button>
          <button class="btn-table-action delete" type="button" title="Eliminar área" disabled><i class="bi bi-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join("");
}

function countAssignedTools(area) {
  const collections = [area.herramientas, area.tools, area.equipos, area.detalleHerramientas];
  const found = collections.find(Array.isArray);
  if (found) return found.length;
  return Number(area.herramientasAsignadas || area.totalHerramientas || area.stock || 0) || 0;
}

function renderAreasLoading() {
  return `
    <tr>
      <td colspan="4">
        <div class="catalog-empty-state">
          <div class="catalog-empty-icon"><i class="bi bi-arrow-repeat"></i></div>
          <strong>Cargando areas</strong>
          <span>Consultando /api/area...</span>
        </div>
      </td>
    </tr>
  `;
}

function renderAreasEmpty(message) {
  return `
    <tr>
      <td colspan="4">
        <div class="catalog-empty-state">
          <div class="catalog-empty-icon"><i class="bi bi-diagram-3"></i></div>
          <strong>Sin areas</strong>
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
