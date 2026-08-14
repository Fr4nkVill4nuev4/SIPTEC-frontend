/**
 * SIPTEC - Controlador de Inventario
 * Maneja búsqueda, filtros, cambio rápido de estado y modales de producto.
 */
let currentInventoryItems = [];

document.addEventListener("DOMContentLoaded", () => {
  initInventoryController();
});

async function initInventoryController() {
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
    console.warn("Usando filas maquetadas en HTML de inventario.", error);
  }
}

function renderInventoryTable(items) {
  const tbody = document.querySelector("#inventoryTableBody");
  if (!tbody || !items || !items.length) return;

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
        <td>${escapeHtml(item.category || "Equipo técnico")}</td>
        <td>${escapeHtml(item.area || "Bodega técnica")}</td>
        <td>${escapeHtml(item.acquiredAt || "2026-05-12")}</td>
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
      renderInventoryTable(currentInventoryItems);
      showToast("Mostrando todos los implementos.", "info");
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
      const area = document.querySelector("#addArea").value.trim();

      if (!code || !name) {
        showToast("Completa el código y el nombre.", "warning");
        return;
      }

      try {
        await window.inventoryService.create({ code, name, category, area, status: "Disponible", acquiredAt: new Date().toISOString().slice(0, 10) });
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
      const status = document.querySelector("#editStatus").value;
      const area = document.querySelector("#editArea").value.trim();

      try {
        await window.inventoryService.update(id, { code, name, category, status, area });
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
  if (!q) {
    renderInventoryTable(currentInventoryItems);
    return;
  }
  const filtered = currentInventoryItems.filter(it => 
    (it.code && it.code.toLowerCase().includes(q)) ||
    (it.name && it.name.toLowerCase().includes(q)) ||
    (it.category && it.category.toLowerCase().includes(q)) ||
    (it.area && it.area.toLowerCase().includes(q)) ||
    (it.status && it.status.toLowerCase().includes(q))
  );
  renderInventoryTable(filtered);
}

function openEditModal(id) {
  const item = currentInventoryItems.find(it => it.id === id);
  if (!item) return;

  document.querySelector("#editId").value = item.id;
  document.querySelector("#editCode").value = item.code || "";
  document.querySelector("#editName").value = item.name || "";
  document.querySelector("#editCategory").value = item.category || "Material de apoyo";
  document.querySelector("#editStatus").value = item.status || "Disponible";
  document.querySelector("#editArea").value = item.area || "Bodega técnica";

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
