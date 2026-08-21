/**
 * SIPTEC - Controlador de Inventario
 * Maneja búsqueda, filtros, cambio rápido de estado y modales de producto.
 */
let currentInventoryItems = [];
let inventoryAreasOptions = [];
let activeInventoryStatusFilter = "all";

document.addEventListener("DOMContentLoaded", () => {
  initInventoryController();
});

async function initInventoryController() {
  await loadInventoryAreasOptions();
  await loadInventory();
  bindInventoryEvents();
}

async function loadInventory() {
  try {
    if (window.inventoryService) {
      currentInventoryItems = await window.inventoryService.getAll();
      renderInventoryTable(currentInventoryItems);
    }
  } catch (error) {
    console.warn("No se pudo cargar inventario desde la API.", error);
    currentInventoryItems = [];
    renderInventoryTable([]);
  }
}


async function loadInventoryAreasOptions() {
  const selects = Array.from(document.querySelectorAll("#addArea, #editArea"));
  if (!selects.length) return;

  inventoryAreasOptions = [];
  try {
    if (window.areasService) {
      const apiAreas = await window.areasService.getAll();
      inventoryAreasOptions = apiAreas.map((area) => areasService.getName(area)).filter(Boolean);
    }
  } catch (error) {
    console.warn("No se pudieron cargar las areas para el selector.", error);
  }

  if (!inventoryAreasOptions.length) {
    inventoryAreasOptions = ["Bodega técnica"];
  }

  renderAreaSelectOptions(selects);
}

function renderAreaSelectOptions(selects) {
  const uniqueAreas = [...new Set(inventoryAreasOptions)];
  selects.forEach((select) => {
    const currentValue = select.value;
    select.innerHTML = uniqueAreas.map((area) => `<option value="${escapeHtml(area)}">${escapeHtml(area)}</option>`).join("");
    setSelectValue(select, currentValue || uniqueAreas[0]);
  });
}

function setSelectValue(select, value) {
  if (!select) return;
  const cleanValue = String(value || "").trim();
  if (!cleanValue) return;

  const exists = Array.from(select.options).some((option) => option.value === cleanValue);
  if (!exists) {
    select.insertAdjacentHTML("beforeend", `<option value="${escapeHtml(cleanValue)}">${escapeHtml(cleanValue)}</option>`);
  }
  select.value = cleanValue;
}

function renderInventoryTable(items) {
  const tbody = document.querySelector("#inventoryTableBody");
  if (!tbody || !items) return;
  if (!items.length) {
    tbody.innerHTML = "";
    return;
  }

  tbody.innerHTML = items.map(item => {
    const status = item.status || "Disponible";
    const statusLower = status.toLowerCase();
    const pillClass = statusLower.includes("disponible") ? "disponible" :
                      statusLower.includes("prestado") ? "prestado" : "daniado";

    const iconClass = item.category?.toLowerCase().includes("mecánico") ? "bi-wrench" :
                      item.category?.toLowerCase().includes("medición") ? "bi-speedometer2" :
                      item.category?.toLowerCase().includes("electrónico") ? "bi-speaker" :
                      item.category?.toLowerCase().includes("apoyo") ? "bi-tools" : "bi-laptop";

    return `
      <tr data-id="${item.id}">
        <td><i class="bi ${iconClass} text-muted"></i></td>
        <td><strong>${escapeHtml(item.code)}</strong></td>
        <td>${escapeHtml(item.name)}</td>
        <td>${escapeHtml(item.brand || "-")}</td>
        <td>${escapeHtml(item.category || "Equipo técnico")}</td>
        <td>${escapeHtml(item.stock ?? 0)}</td>
        <td>${escapeHtml(item.area || "Bodega técnica")}</td>
        <td><span class="badge-pill-state ${pillClass}">${escapeHtml(status)}</span></td>
        <td>
          <div class="action-btn-group">
            <button class="btn-table-action" onclick="openEditModal(${item.id})" title="Editar"><i class="bi bi-pencil"></i></button>
            <button class="btn-table-action" onclick="toggleItemStatus(${item.id})" title="Cambiar Estado"><i class="bi bi-arrow-repeat"></i></button>
            <button class="btn-table-action delete" onclick="deleteItemDirect(${item.id})" title="Eliminar"><i class="bi bi-trash"></i></button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function bindInventoryEvents() {
  const searchInput = document.querySelector("#inventorySearch, #globalSearch");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      filterInventory(q);
    });
  }

  // Filtro Todo
  const filterAllBtn = document.querySelector("[data-filter='all']");
  if (filterAllBtn) {
    filterAllBtn.addEventListener("click", () => {
      showInventoryFilterMenu(filterAllBtn);
    });
  }

  // Formulario Agregar Equipo
  const addForm = document.querySelector("#addEquipmentForm");
  if (addForm) {
    addForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const code = document.querySelector("#addCode").value.trim();
      const name = document.querySelector("#addName").value.trim();
      const category = document.querySelector("#addCategory").value;
      const brand = document.querySelector("#addBrand").value.trim();
      const area = document.querySelector("#addArea").value;
      const stock = Number(document.querySelector("#addStock").value);

      if (!code || !name || !Number.isFinite(stock) || stock < 0) {
        showToast("Completa el código, nombre y stock válido.", "warning");
        return;
      }

      try {
        await window.inventoryService.create({ code, name, category, brand, area, stock, status: "Disponible", acquiredAt: new Date().toISOString().slice(0, 10) });
        showToast("Herramienta agregada correctamente.", "success");
        closeBootstrapModal("addEquipmentModal");
        addForm.reset();
        await loadInventory();
      } catch (err) {
        showToast(err.message || "Error al registrar.", "error");
      }
    });
  }

  // Formulario Editar Equipo
  const editForm = document.querySelector("#editEquipmentForm");
  if (editForm) {
    editForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = Number(document.querySelector("#editId").value);
      const code = document.querySelector("#editCode").value.trim();
      const name = document.querySelector("#editName").value.trim();
      const category = document.querySelector("#editCategory").value;
      const brand = document.querySelector("#editBrand").value.trim();
      const status = document.querySelector("#editStatus").value;
      const area = document.querySelector("#editArea").value;
      const stock = Number(document.querySelector("#editStock").value);

      if (!code || !name || !Number.isFinite(stock) || stock < 0) {
        showToast("Completa los datos y un stock válido.", "warning");
        return;
      }

      try {
        await window.inventoryService.update(id, { code, name, category, brand, status, area, stock });
        showToast("Inventario actualizado correctamente.", "success");
        closeBootstrapModal("editEquipmentModal");
        await loadInventory();
      } catch (err) {
        showToast(err.message || "Error al actualizar.", "error");
      }
    });
  }
}

function filterInventory(q) {
  const query = String(q || "").toLowerCase().trim();
  const filtered = currentInventoryItems.filter(it => {
    const matchesText = !query ||
      (it.code && it.code.toLowerCase().includes(query)) ||
      (it.name && it.name.toLowerCase().includes(query)) ||
      (it.brand && it.brand.toLowerCase().includes(query)) ||
      (it.category && it.category.toLowerCase().includes(query)) ||
      (it.area && it.area.toLowerCase().includes(query)) ||
      (it.status && it.status.toLowerCase().includes(query));

    const matchesStatus = activeInventoryStatusFilter === "all" ||
      String(it.status || "").toLowerCase().includes(activeInventoryStatusFilter);

    return matchesText && matchesStatus;
  });
  renderInventoryTable(filtered);
}

function showInventoryFilterMenu(anchor) {
  const existing = document.querySelector("#inventoryFilterMenu");
  if (existing) {
    existing.remove();
    return;
  }

  const options = [
    { value: "all", label: "Todo" },
    { value: "disponible", label: "Disponibles" },
    { value: "prestado", label: "Prestados" },
    { value: "dañado", label: "Dañados" }
  ];

  const menu = document.createElement("div");
  menu.id = "inventoryFilterMenu";
  menu.className = "siptec-floating-menu";
  menu.innerHTML = options.map(option => `
    <button type="button" data-status-filter="${option.value}" class="${activeInventoryStatusFilter === option.value ? "active" : ""}">
      ${escapeHtml(option.label)}
    </button>
  `).join("");

  document.body.appendChild(menu);
  const rect = anchor.getBoundingClientRect();
  menu.style.left = `${rect.left}px`;
  menu.style.top = `${rect.bottom + 8}px`;

  menu.querySelectorAll("[data-status-filter]").forEach(button => {
    button.addEventListener("click", () => {
      activeInventoryStatusFilter = button.dataset.statusFilter;
      const label = button.textContent.trim();
      anchor.innerHTML = `<i class="bi bi-funnel"></i> ${escapeHtml(label)}`;
      menu.remove();
      const inlineSearch = document.querySelector("#inventorySearchInline");
      const topbarSearch = document.querySelector("#inventorySearch");
      filterInventory((inlineSearch && inlineSearch.value) || (topbarSearch && topbarSearch.value) || "");
    });
  });

  setTimeout(() => {
    document.addEventListener("click", function closeMenu(event) {
      if (!menu.contains(event.target) && event.target !== anchor) {
        menu.remove();
        document.removeEventListener("click", closeMenu);
      }
    });
  }, 0);
}
function openEditModal(id) {
  const item = currentInventoryItems.find(it => it.id === id);
  if (!item) return;

  document.querySelector("#editId").value = item.id;
  document.querySelector("#editCode").value = item.code || "";
  document.querySelector("#editName").value = item.name || "";
  document.querySelector("#editCategory").value = item.category || "Material de apoyo";
  document.querySelector("#editBrand").value = item.brand || "";
  document.querySelector("#editStatus").value = item.status || "Disponible";
  document.querySelector("#editStock").value = item.stock ?? 1;
  setSelectValue(document.querySelector("#editArea"), item.area || "Bodega técnica");

  openBootstrapModal("editEquipmentModal");
}

async function toggleItemStatus(id) {
  const item = currentInventoryItems.find(it => it.id === id);
  if (!item) return;

  const nextStatus = item.status === "Disponible" ? "Prestado" :
                     item.status === "Prestado" ? "Dañado" : "Disponible";

  try {
    await window.inventoryService.update(id, { ...item, status: nextStatus });
    showToast(`Estado de ${item.code} cambiado a ${nextStatus}.`, "info");
    await loadInventory();
  } catch (err) {
    showToast("No se pudo cambiar el estado.", "error");
  }
}

async function deleteItemDirect(id) {
  if (!confirm("¿Deseas eliminar este producto del inventario?")) return;
  try {
    await window.inventoryService.delete(id);
    showToast("Herramienta eliminada.", "warning");
    await loadInventory();
  } catch (err) {
    showToast("Error al eliminar.", "error");
  }
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

window.openEditModal = openEditModal;
window.toggleItemStatus = toggleItemStatus;
window.deleteItemDirect = deleteItemDirect;














