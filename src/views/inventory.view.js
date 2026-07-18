function hydrateInventory() {
  document.querySelector("#inventoryTable").innerHTML = filterRows(state.items)
    .map((item) => itemRow(item))
    .join("");
  document
    .querySelector("#addItem")
    ?.classList.toggle("d-none", !canManageInventory());
}
function itemRow(item) {
  return `
    <tr>
      <td><i class="bi bi-${item.category.includes("Equipo") ? "cpu-fill" : "hammer"}"></i></td>
      <td>${item.code}</td>
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>${item.location || "Bodega técnica"}</td>
      <td>${item.acquiredAt || "Sin fecha"}</td>
      <td><span class="${statusClass(item.status)}">${item.status}</span></td>
      <td>
        ${
          canManageInventory()
            ? `
          <button class="icon-btn" data-edit-item="${item.id}" title="Editar inventario"><i class="bi bi-pencil"></i></button>
          <button class="icon-btn" data-item-status="${item.id}" title="Cambiar estado"><i class="bi bi-arrow-repeat"></i></button>
          <button class="icon-btn" data-item-remove="${item.id}" title="Eliminar"><i class="bi bi-trash"></i></button>
        `
            : '<span class="muted">Lectura</span>'
        }
      </td>
    </tr>
  `;
}
function openItemEditMenu(id) {
  if (!canManageInventory()) {
    toast("Tu rol no puede editar inventario.");
    return;
  }
  var item = state.items.find((entry) => entry.id === id);
  if (!item) {
    toast("Producto no encontrado.");
    return;
  }

  document.querySelector("#editItemId").value = item.id;
  document.querySelector("#editItemCode").value = item.code;
  document.querySelector("#editItemName").value = item.name;
  document.querySelector("#editItemCategory").value = item.category;
  document.querySelector("#editItemLocation").value =
    item.location || "Bodega técnica";
  document.querySelector("#editItemStatus").value = item.status;
  document.querySelector("#editItemAcquiredAt").value = item.acquiredAt || "";
  itemEditModal.show();
}
