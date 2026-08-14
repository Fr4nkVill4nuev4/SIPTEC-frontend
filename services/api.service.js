/**
 * SIPTEC - Servicio Base de API (Cliente HTTP)
 * Maneja peticiones a la API Java Spring Boot con autorización JWT.
 */
const apiService = {

  // Obtener Token de autenticación
  getToken() {
    try {
      const session = sessionStorage.getItem(SIPTEC_CONFIG.SESSION_STORAGE_KEY)
                   || localStorage.getItem(SIPTEC_CONFIG.SESSION_STORAGE_KEY);
      if (session) {
        const parsed = JSON.parse(session);
        return parsed.token || null;
      }
    } catch {
      return null;
    }
    return null;
  },

  // Obtener Usuario actual de la sesión guardada
  getCurrentUser() {
    try {
      const session = sessionStorage.getItem(SIPTEC_CONFIG.SESSION_STORAGE_KEY)
                   || localStorage.getItem(SIPTEC_CONFIG.SESSION_STORAGE_KEY);
      if (session) {
        const parsed = JSON.parse(session);
        return parsed.user || null;
      }
    } catch {
      return null;
    }
    return null;
  },

  // Ejecutar petición HTTP con timeout y autorización JWT
  async request(endpoint, options = {}) {
    const baseUrl = SIPTEC_CONFIG.getApiUrl();
    const url = `${baseUrl}${endpoint}`;
    const token = this.getToken();

    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {})
    };

    if (token && options.auth !== false) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Timeout con AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), SIPTEC_CONFIG.REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || data.error || `Error HTTP ${response.status}`);
      }

      this.updateConnectionStatus(true);
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      this.updateConnectionStatus(false);
      throw error;
    }
  },

  // Actualizar indicador visual de conexión en el Topbar
  updateConnectionStatus(isConnected) {
    const badge = document.querySelector("#apiStatusBadge");
    if (!badge) return;

    if (isConnected) {
      badge.className = "api-status-badge connected";
      badge.innerHTML = `<i class="bi bi-circle-fill" style="font-size:8px;color:#22c55e;"></i> Java API Conectada`;
      badge.title = `Conectado a ${SIPTEC_CONFIG.getApiUrl()}`;
    } else {
      badge.className = "api-status-badge mock";
      badge.innerHTML = `<i class="bi bi-circle-fill" style="font-size:8px;color:#ef4444;"></i> Sin conexión`;
      badge.title = `No se detecta la API en ${SIPTEC_CONFIG.getApiUrl()}`;
    }
  }
};

window.apiService = apiService;
