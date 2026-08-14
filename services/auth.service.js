/**
 * SIPTEC - Servicio de Autenticación
 * Conecta con `/api/auth/login` en el backend Java Spring Boot.
 */
const authService = {
  async login(email, password) {
    return await apiService.request(SIPTEC_CONFIG.ENDPOINTS.AUTH_LOGIN, {
      method: "POST",
      auth: false,
      body: JSON.stringify({ email, password })
    });
  },

  async logout() {
    try {
      await apiService.request(SIPTEC_CONFIG.ENDPOINTS.AUTH_LOGOUT, { method: "POST" });
    } catch {
      // Si la API falla, limpiar localmente
    }
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
