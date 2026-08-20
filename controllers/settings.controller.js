/**
 * SIPTEC - Controlador de Configuración
 * Permite cambiar nombre de usuario, tema visual y URL del backend Java.
 */
document.addEventListener("DOMContentLoaded", () => {
  initSettingsController();
});

function initSettingsController() {
  const user = window.apiService ? window.apiService.getCurrentUser() : null;

  const firstNameInput = document.querySelector("#settingsFirstName");
  const lastNameInput  = document.querySelector("#settingsLastName");
  const apiUrlInput    = document.querySelector("#settingsApiUrl");

  if (firstNameInput && user) firstNameInput.value = user.firstName || "Admin";
  if (lastNameInput  && user) lastNameInput.value  = user.lastName  || "Principal";
  if (apiUrlInput)            apiUrlInput.value    = SIPTEC_CONFIG.getApiUrl();

  // Guardar perfil
  const saveProfileBtn = document.querySelector("#btnSaveProfile");
  if (saveProfileBtn) {
    saveProfileBtn.addEventListener("click", () => {
      const fn = firstNameInput ? firstNameInput.value.trim() : "Admin";
      const ln = lastNameInput  ? lastNameInput.value.trim()  : "Principal";
      if (user) {
        user.firstName = fn;
        user.lastName  = ln;
        if (window.authService) authService.saveSession(apiService.getToken() || "", user);
      }
      showToast("Perfil actualizado correctamente.", "success");
      const userChip = document.querySelector("#userRoleText");
      if (userChip) userChip.textContent = `${fn} ${ln} (${(user?.role || "ADMINISTRADOR").toUpperCase()})`;
    });
  }

  // Probar y guardar URL de API Java
  const testApiBtn = document.querySelector("#btnTestApi");
  if (testApiBtn) {
    testApiBtn.addEventListener("click", async () => {
      const newUrl = apiUrlInput ? apiUrlInput.value.trim() : "http://localhost:8080";
      SIPTEC_CONFIG.setApiUrl(newUrl);

      testApiBtn.disabled = true;
      testApiBtn.textContent = "Probando conexión...";

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        const res = await fetch(`${newUrl}/api/herramientas`, { signal: controller.signal }).catch(() => null);
        clearTimeout(timeout);

        if (res && res.ok) {
          showToast(`¡Conexión exitosa con la API Java en ${newUrl}!`, "success");
          if (window.apiService) apiService.updateConnectionStatus(true);
        } else {
          showToast(`No se pudo conectar a ${newUrl}. Verifica que el servidor esté corriendo.`, "warning");
          if (window.apiService) apiService.updateConnectionStatus(false);
        }
      } catch {
        showToast("No se detectó respuesta del servidor.", "error");
        if (window.apiService) apiService.updateConnectionStatus(false);
      } finally {
        testApiBtn.disabled = false;
        testApiBtn.textContent = "Probar Conexión";
      }
    });
  }

  // Logout
  document.querySelectorAll("[data-logout]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (window.authService) {
        authService.logout();
      } else {
        window.location.href = "../index.html";
      }
    });
  });
}

