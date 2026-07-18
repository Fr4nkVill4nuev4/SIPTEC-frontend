function hydrateUsers() {
  document.querySelector("#usersTable").innerHTML = filterRows(state.users)
    .map(
      (user) => `
    <tr>
      <td>${user.name}</td><td>${user.email}</td><td>${user.role}</td><td>${user.section}</td>
      <td><span class="${statusClass(user.state)}">${user.state}</span></td>
      <td><button class="icon-btn" data-edit-user="${user.id}" title="Editar usuario"><i class="bi bi-pencil"></i></button></td>
    </tr>
  `,
    )
    .join("");
}
function openUserEditMenu(id) {
  var user = state.users.find((item) => item.id === id);
  if (!user) {
    toast("Usuario no encontrado.");
    return;
  }

  document.querySelector("#editUserId").value = user.id;
  document.querySelector("#editUserFirstName").value =
    user.firstName || user.name.split(" ")[0] || "";
  document.querySelector("#editUserLastName").value =
    user.lastName || user.name.split(" ").slice(1).join(" ") || "";
  document.querySelector("#editUserEmail").value = user.email;
  document.querySelector("#editUserRole").value = user.role;
  document.querySelector("#editUserInstitution").value =
    user.institution || user.section;
  document.querySelector("#editUserPassword").value = "";
  document.querySelector("#editUserActive").checked = user.active;
  userEditModal.show();
}
function toUiUser(user) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    role: user.role,
    section: user.institution,
    institution: user.institution,
    active: Boolean(user.active),
    state: user.active ? "Activo" : "Inactivo",
  };
}
