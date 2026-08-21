/**
 * SIPTEC - Controlador de Autenticación
 * Maneja el formulario de login. Si la API falla, muestra error al usuario.
 */
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("#loginForm");
  const loginError = document.querySelector("#loginError");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.querySelector("#email").value.trim();
      const password = document.querySelector("#password").value.trim();
      const submitBtn = loginForm.querySelector("button[type='submit']");

      if (loginError) loginError.classList.add("d-none");

      if (!email || !password) {
        showError("Por favor completa todos los campos.");
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="bi bi-hourglass-split"></i> Iniciando sesión...`;

      try {
        const data = await window.authService.login(email, password);
        window.authService.saveSession(data.token, data.user);
        const role = String(data.user?.role || "").toUpperCase();
        const isLimited = role === "PROFESOR" || role === "USUARIO" || role === "USER";
        window.location.href = isLimited ? "pages/inventory.html" : "pages/dashboard.html";
      } catch (error) {
        showError("Credenciales incorrectas o el servidor no está disponible.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="bi bi-box-arrow-in-right"></i> Iniciar Sesión`;
      }
    });
  }

  function showError(msg) {
    if (loginError) {
      loginError.textContent = msg;
      loginError.classList.remove("d-none");
    } else {
      alert(msg);
    }
  }
});


