/**
 * SIPTEC - Controlador de Usuarios
 * Maneja listado y modales de usuarios.
 */
let currentUsers = [];
let currentRoles = [];
let currentInstitutions = [];

document.addEventListener("DOMContentLoaded", () => {
  initUsersController();
});

async function initUsersController() {
  await Promise.all([loadUsers(), loadUserCatalogs()]);
  bindUsersEvents();
}

async function loadUsers() {
  try {
    if (window.usersService) {
      currentUsers = await window.usersService.getAll();
      renderUsersTable(currentUsers);
    }
  } catch (error) {
    console.warn("No se pudo cargar usuarios desde la API.", error);
    currentUsers = [];
    renderUsersTable([]);
  }
}

async function loadUserCatalogs() {
  try {
    if (!window.usersService) return;
    const [roles, institutions] = await Promise.all([
      window.usersService.getRoles(),
      window.usersService.getInstitutions()
    ]);
    currentRoles = roles;
    currentInstitutions = institutions;
    renderSelectOptions("#userRole", currentRoles, "Seleccione un rol");
    renderSelectOptions("#userSection", currentInstitutions, "Seleccione una institución");
    renderSelectOptions("#editUserRole", currentRoles, "Seleccione un rol");
    renderSelectOptions("#editUserSection", currentInstitutions, "Seleccione una institución");
  } catch (error) {
    console.warn("No se pudieron cargar roles o instituciones.", error);
    renderSelectOptions("#userRole", [], "Sin roles disponibles");
    renderSelectOptions("#userSection", [], "Sin instituciones disponibles");
  }
}

function renderSelectOptions(selector, items, placeholder) {
  const select = document.querySelector(selector);
  if (!select) return;

  select.innerHTML = `<option value="">${escapeHtml(placeholder)}</option>` + items.map(item => `
    <option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>
  `).join("");
}

function renderUsersTable(users) {
  const tbody = document.querySelector("#usersTableBody");
  if (!tbody || !users) return;

  if (!users.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-muted py-4">No hay usuarios disponibles desde la API.</td></tr>`;
    return;
  }

  tbody.innerHTML = users.map(u => {
    const fullName = u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Usuario";
    const isActive = u.active !== false;

    return `
      <tr data-id="${u.id}">
        <td><strong>${escapeHtml(fullName)}</strong></td>
        <td>${escapeHtml(u.email)}</td>
        <td>${escapeHtml(resolveRoleName(u))}</td>
        <td>${escapeHtml(resolveInstitutionName(u))}</td>
        <td><span class="badge-pill-state activo">${isActive ? "Activo" : "Inactivo"}</span></td>
        <td>
          <div class="action-btn-group">
            <button class="btn-table-action" onclick="openEditUserModal(${u.id})" title="Editar"><i class="bi bi-pencil"></i></button>
            <button class="btn-table-action delete" onclick="deleteUserDirect(${u.id})" title="Eliminar"><i class="bi bi-trash"></i></button>
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
        (resolveRoleName(u).toLowerCase().includes(q)) ||
        (resolveInstitutionName(u).toLowerCase().includes(q))
      );
      renderUsersTable(filtered);
    });
  }

  const refreshBtn = document.querySelector("#refreshBtn");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", async () => {
      await Promise.all([loadUsers(), loadUserCatalogs()]);
      showToast("Usuarios actualizados.", "success");
    });
  }

  const userForm = document.querySelector("#createUserForm");
  if (userForm) {
    userForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const firstName = document.querySelector("#userFirstName").value.trim();
      const lastName = document.querySelector("#userLastName").value.trim();
      const name = `${firstName} ${lastName}`.trim();
      const email = document.querySelector("#userEmail").value.trim();
      const password = document.querySelector("#userPassword").value;
      const roleId = document.querySelector("#userRole").value;
      const institutionId = document.querySelector("#userSection").value;

      if (!firstName || !lastName) {
        showToast("Ingrese nombre y apellido del usuario.", "error");
        return;
      }

      if (!roleId || !institutionId) {
        showToast("Seleccione rol e institución antes de guardar.", "error");
        return;
      }

      try {
        await window.usersService.create({
          name,
          firstName,
          lastName,
          email,
          password,
          rol: Number(roleId),
          institucion: Number(institutionId)
        });
        showToast("Usuario creado exitosamente.", "success");
        closeBootstrapModal("createUserModal");
        userForm.reset();
        renderSelectOptions("#userRole", currentRoles, "Seleccione un rol");
        renderSelectOptions("#userSection", currentInstitutions, "Seleccione una institución");
        await loadUsers();
      } catch (err) {
        showToast(err.message || "Error al crear usuario.", "error");
      }
    });
  }

  const editUserForm = document.querySelector("#editUserForm");
  if (editUserForm) {
    editUserForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = Number(document.querySelector("#editUserId").value);
      const firstName = document.querySelector("#editUserFirstName").value.trim();
      const lastName = document.querySelector("#editUserLastName").value.trim();
      const name = `${firstName} ${lastName}`.trim();
      const email = document.querySelector("#editUserEmail").value.trim();
      const roleId = document.querySelector("#editUserRole").value;
      const institutionId = document.querySelector("#editUserSection").value;

      try {
        await window.usersService.update(id, {
          name,
          firstName,
          lastName,
          email,
          rol: roleId ? Number(roleId) : null,
          institucion: institutionId ? Number(institutionId) : null,
          password: currentUsers.find(u => u.id === id)?.raw?.passwordHash || "actualizar"
        });
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
  document.querySelector("#editUserFirstName").value = user.firstName || "";
  document.querySelector("#editUserLastName").value = user.lastName || "";
  document.querySelector("#editUserEmail").value = user.email || "";
  document.querySelector("#editUserRole").value = user.rol || "";
  document.querySelector("#editUserSection").value = user.institution || "";

  openBootstrapModal("editUserModal");
}


async function deleteUserDirect(id) {
  const user = currentUsers.find(u => Number(u.id) === Number(id));
  if (!user) return;

  const currentUser = window.apiService ? window.apiService.getCurrentUser() : null;
  if (currentUser && Number(currentUser.id) === Number(id)) {
    showToast("No puedes eliminar el usuario con el que estás conectado.", "warning");
    return;
  }

  const fullName = user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "este usuario";
  if (!confirm(`¿Deseas eliminar a ${fullName}? Esta acción no se puede deshacer.`)) return;

  try {
    await window.usersService.delete(id);
    showToast("Usuario eliminado correctamente.", "success");
    await loadUsers();
  } catch (err) {
    showToast(err.message || "No se pudo eliminar el usuario.", "error");
  }
}
function resolveRoleName(user) {
  if (user.role && !/^ROL \d+$/i.test(user.role)) return user.role;
  const role = currentRoles.find(item => Number(item.id) === Number(user.rol));
  return role ? role.name : (user.role || "-");
}

function resolveInstitutionName(user) {
  if (user.section && !/^Institucion \d+$/i.test(user.section)) return user.section;
  const institution = currentInstitutions.find(item => Number(item.id) === Number(user.institution));
  return institution ? institution.name : (user.section || "-");
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
window.deleteUserDirect = deleteUserDirect;







