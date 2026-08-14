/**
 * SIPTEC - Controlador de Usuarios
 * Maneja listado y modales de usuarios.
 */
let currentUsers = [];

document.addEventListener("DOMContentLoaded", () => {
  initUsersController();
});

async function initUsersController() {
  await loadUsers();
  bindUsersEvents();
}

async function loadUsers() {
  try {
    if (window.usersService) {
      currentUsers = await window.usersService.getAll();
      renderUsersTable(currentUsers);
    }
  } catch (error) {
    console.warn("Usando filas maquetadas en HTML de usuarios.", error);
  }
}

function renderUsersTable(users) {
  const tbody = document.querySelector("#usersTableBody");
  if (!tbody || !users) return;

  tbody.innerHTML = users.map(u => {
    const fullName = u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Usuario";
    const isActive = u.active !== false;

    return `
      <tr data-id="${u.id}">
        <td><strong>${escapeHtml(fullName)}</strong></td>
        <td>${escapeHtml(u.email)}</td>
        <td>${escapeHtml(u.role || "EMPLEADO")}</td>
        <td>${escapeHtml(u.section || u.institution || "ITR")}</td>
        <td><span class="badge-pill-state activo">${isActive ? "Activo" : "Inactivo"}</span></td>
        <td>
          <div class="action-btn-group">
            <button class="btn-table-action" onclick="openEditUserModal(${u.id})" title="Editar"><i class="bi bi-pencil"></i></button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function bindUsersEvents() {
  const searchInput = document.querySelector("#usersSearch, #globalSearch");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        renderUsersTable(currentUsers);
        return;
      }
      const filtered = currentUsers.filter(u =>
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.role && u.role.toLowerCase().includes(q)) ||
        (u.section && u.section.toLowerCase().includes(q))
      );
      renderUsersTable(filtered);
    });
  }

  // Formulario Crear Usuario
  const userForm = document.querySelector("#createUserForm");
  if (userForm) {
    userForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.querySelector("#userFullName").value.trim();
      const email = document.querySelector("#userEmail").value.trim();
      const role = document.querySelector("#userRole").value;
      const section = document.querySelector("#userSection").value;

      try {
        await window.usersService.create({ name, email, role, section, active: true });
        showToast("Usuario creado exitosamente.", "success");
        closeBootstrapModal("createUserModal");
        userForm.reset();
        await loadUsers();
      } catch (err) {
        showToast(err.message || "Error al crear usuario.", "error");
      }
    });
  }

  // Formulario Editar Usuario
  const editUserForm = document.querySelector("#editUserForm");
  if (editUserForm) {
    editUserForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = Number(document.querySelector("#editUserId").value);
      const name = document.querySelector("#editUserFullName").value.trim();
      const email = document.querySelector("#editUserEmail").value.trim();
      const role = document.querySelector("#editUserRole").value;
      const section = document.querySelector("#editUserSection").value;

      try {
        await window.usersService.update(id, { name, email, role, section });
        showToast("Usuario actualizado correctamente.", "success");
        closeBootstrapModal("editUserModal");
        await loadUsers();
      } catch (err) {
        showToast(err.message || "Error al actualizar.", "error");
      }
    });
  }
}

function openEditUserModal(id) {
  const user = currentUsers.find(u => u.id === id);
  if (!user) return;

  document.querySelector("#editUserId").value = user.id;
  document.querySelector("#editUserFullName").value = user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim();
  document.querySelector("#editUserEmail").value = user.email || "";
  document.querySelector("#editUserRole").value = user.role || "EMPLEADO";
  document.querySelector("#editUserSection").value = user.section || user.institution || "ITR";

  openBootstrapModal("editUserModal");
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

window.openEditUserModal = openEditUserModal;
