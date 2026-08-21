/**
 * SIPTEC - Servicio de Autenticación
 * Conecta con la API separada ApiAuth.
 */
const authService = {
  async login(email, password) {
    const baseUrl = SIPTEC_CONFIG.getAuthApiUrl ? SIPTEC_CONFIG.getAuthApiUrl() : SIPTEC_CONFIG.getApiUrl();
    const response = await fetch(`${baseUrl}${SIPTEC_CONFIG.ENDPOINTS.AUTH_LOGIN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo: email, clave: password })
    });

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    const data = await response.json();
    return {
      token: `auth-session-${data.id || Date.now()}`,
      user: {
        id: data.id,
        firstName: data.nombreUsuario || "",
        lastName: data.apellidoUsuario || "",
        email: data.correoUsuario || email,
        roleId: data.idRol || null,
        role: data.nombreRol || "USUARIO"
      }
    };
  },

  async logout() {
    sessionStorage.removeItem(SIPTEC_CONFIG.SESSION_STORAGE_KEY);
    localStorage.removeItem(SIPTEC_CONFIG.SESSION_STORAGE_KEY);
    window.location.href = "../index.html";
  },

  saveSession(token, user) {
    const sessionData = JSON.stringify({ token, user });
    sessionStorage.setItem(SIPTEC_CONFIG.SESSION_STORAGE_KEY, sessionData);
    localStorage.setItem(SIPTEC_CONFIG.SESSION_STORAGE_KEY, sessionData);
  },

  getSession() {
    try {
      const data = sessionStorage.getItem(SIPTEC_CONFIG.SESSION_STORAGE_KEY) || localStorage.getItem(SIPTEC_CONFIG.SESSION_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }
};

window.authService = authService;
