document.addEventListener("DOMContentLoaded", iniciarAplicacion);

function iniciarAplicacion() {
  applyTheme(getStoredTheme());
  registrarEventosGlobales();
  restoreSession();
}

function registrarEventosGlobales() {
  document
    .querySelector("#loginForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      var email = document.querySelector("#email").value.trim();
      var password = document.querySelector("#password").value.trim();

      loginError.classList.add("d-none");
      if (!email || !password) {
        loginError.textContent = "Completa ambos campos para continuar.";
        loginError.classList.remove("d-none");
        return;
      }

      var submitBtn = event.submitter;
      submitBtn.disabled = true;

      try {
        var data = await apiFetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          auth: false,
        });

        state.token = data.token;
        state.currentUser = data.user;
        sessionStorage.setItem(
          SESSION_KEY,
          JSON.stringify({ token: data.token, user: data.user }),
        );

        loginScreen.classList.add("d-none");
        appShell.classList.remove("d-none");
        updateUserChip();
        ensureAllowedView();
        syncActiveNav();
        applyRoleAccess();
        await loadAllData();
        render();
      } catch (error) {
        loginError.textContent = error.message || "No se pudo iniciar sesión.";
        loginError.classList.remove("d-none");
      } finally {
        submitBtn.disabled = false;
      }
    });

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => {
      if (!canAccessView(button.dataset.view)) {
        toast("Tu rol no tiene acceso a esta sección.");
        return;
      }
      state.view = button.dataset.view;
      document
        .querySelectorAll(".nav-item")
        .forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      render();
    });
  });

  document.querySelector("#globalSearch").addEventListener("input", (event) => {
    state.query = event.target.value.toLowerCase();
    render();
  });

  document.querySelector("#refreshBtn").addEventListener("click", async () => {
    await loadAllData();
    toast("Datos actualizados correctamente.");
    render();
  });

  document
    .querySelector("#logoutBtn")
    ?.addEventListener("click", logoutCurrentUser);

  document
    .querySelector("#itemForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      var submitBtn = event.submitter;
      submitBtn.disabled = true;

      try {
        var item = await apiFetch("/api/inventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: document.querySelector("#itemCode").value,
            name: document.querySelector("#itemName").value,
            category: document.querySelector("#itemCategory").value,
            location: document.querySelector("#itemLocation").value,
          }),
        });

        state.items.push(item);
        event.target.reset();
        document.querySelector("#itemLocation").value = "Bodega técnica";
        itemModal.hide();
        toast("Herramienta registrada en la base de datos.");
        render();
      } catch (error) {
        toast(error.message || "No se pudo registrar la herramienta.");
      } finally {
        submitBtn.disabled = false;
      }
    });

  document
    .querySelector("#itemEditForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      var submitBtn = event.submitter;
      var id = Number(document.querySelector("#editItemId").value);
      submitBtn.disabled = true;

      try {
        var updated = await apiFetch(`/api/inventory/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: document.querySelector("#editItemCode").value,
            name: document.querySelector("#editItemName").value,
            category: document.querySelector("#editItemCategory").value,
            location: document.querySelector("#editItemLocation").value,
            status: document.querySelector("#editItemStatus").value,
            acquiredAt: document.querySelector("#editItemAcquiredAt").value,
          }),
        });

        var index = state.items.findIndex((item) => item.id === id);
        if (index >= 0) state.items[index] = updated;

        event.target.reset();
        itemEditModal.hide();
        toast("Inventario actualizado en la base de datos.");
        render();
      } catch (error) {
        toast(error.message || "No se pudo actualizar el inventario.");
      } finally {
        submitBtn.disabled = false;
      }
    });

  document
    .querySelector("#userForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      var submitBtn = event.submitter;
      submitBtn.disabled = true;

      try {
        var user = await apiFetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: document.querySelector("#userFirstName").value,
            lastName: document.querySelector("#userLastName").value,
            email: document.querySelector("#userEmail").value,
            role: document.querySelector("#userRole").value,
            institution: document.querySelector("#userInstitution").value,
            password: document.querySelector("#userPassword").value,
          }),
        });

        state.users.push(toUiUser(user));
        event.target.reset();
        userModal.hide();
        toast("Usuario creado y guardado en la base de datos.");
        if (state.view === "users") render();
      } catch (error) {
        toast(error.message || "No se pudo crear el usuario.");
      } finally {
        submitBtn.disabled = false;
      }
    });

  document
    .querySelector("#userEditForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      var submitBtn = event.submitter;
      var id = Number(document.querySelector("#editUserId").value);
      submitBtn.disabled = true;

      try {
        var password = document.querySelector("#editUserPassword").value;
        var payload = {
          firstName: document.querySelector("#editUserFirstName").value,
          lastName: document.querySelector("#editUserLastName").value,
          email: document.querySelector("#editUserEmail").value,
          role: document.querySelector("#editUserRole").value,
          institution: document.querySelector("#editUserInstitution").value,
          active: document.querySelector("#editUserActive").checked,
        };

        if (password.trim()) {
          payload.password = password;
        }

        var updated = await apiFetch(`/api/users/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        var index = state.users.findIndex((user) => user.id === id);
        if (index >= 0) state.users[index] = toUiUser(updated);

        if (state.currentUser?.id === id) {
          state.currentUser = updated;
          sessionStorage.setItem(
            SESSION_KEY,
            JSON.stringify({ token: state.token, user: updated }),
          );
          updateUserChip();
        }

        event.target.reset();
        userEditModal.hide();
        toast("Usuario actualizado en la base de datos.");
        render();
      } catch (error) {
        toast(error.message || "No se pudo actualizar el usuario.");
      } finally {
        submitBtn.disabled = false;
      }
    });

  document
    .querySelector("#damageReportForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      var submitBtn = event.submitter;
      var id = Number(document.querySelector("#damageReturnId").value);
      submitBtn.disabled = true;

      try {
        await apiFetch(`/api/returns/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "daño",
            damageDescription: document.querySelector("#damageDescription").value,
          }),
        });
        await loadAllData();
        event.target.reset();
        damageReportModal.hide();
        toast("Daño reportado y enviado al área de reportes.");
        render();
      } catch (error) {
        toast(error.message || "No se pudo reportar el daño.");
      } finally {
        submitBtn.disabled = false;
      }
    });

  document.querySelector("#copyReportBtn").addEventListener("click", async () => {
    if (!state.viewedReport) return;
    await navigator.clipboard.writeText(formatReportText(state.viewedReport));
    toast("Reporte copiado al portapapeles.");
  });

  document.querySelectorAll("[data-export-viewed]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!state.viewedReport) return;
      exportReport(state.viewedReport, button.dataset.exportViewed);
    });
  });
}
