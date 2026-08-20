/**
 * SIPTEC - Servicio Base de API (Cliente HTTP)
 * Maneja peticiones a la API Java Spring Boot y normaliza ApiResponse<T>.
 */
const apiService = {
  getToken() {
    try {
      const session = sessionStorage.getItem(SIPTEC_CONFIG.SESSION_STORAGE_KEY)
                   || localStorage.getItem(SIPTEC_CONFIG.SESSION_STORAGE_KEY);
      if (session) return JSON.parse(session).token || null;
    } catch {
      return null;
    }
    return null;
  },

  getCurrentUser() {
    try {
      const session = sessionStorage.getItem(SIPTEC_CONFIG.SESSION_STORAGE_KEY)
                   || localStorage.getItem(SIPTEC_CONFIG.SESSION_STORAGE_KEY);
      if (session) return JSON.parse(session).user || null;
    } catch {
      return null;
    }
    return null;
  },

  unwrap(payload) {
    if (payload && Object.prototype.hasOwnProperty.call(payload, "data")) {
      return payload.data == null ? [] : payload.data;
    }
    return payload == null ? [] : payload;
  },

  async request(endpoint, options = {}) {
    const baseUrl = SIPTEC_CONFIG.getApiUrl();
    const url = `${baseUrl}${endpoint}`;
    const token = this.getToken();
    const headers = { "Content-Type": "application/json", ...(options.headers || {}) };

    if (token && options.auth !== false) headers.Authorization = `Bearer ${token}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), SIPTEC_CONFIG.REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(url, { ...options, headers, signal: controller.signal });
      clearTimeout(timeoutId);

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        const emptyList404 = response.status === 404 && Array.isArray(payload.data);
        if (!emptyList404) throw new Error(payload.message || payload.error || `Error HTTP ${response.status}`);
      }

      this.updateConnectionStatus(true);
      return this.unwrap(payload);
    } catch (error) {
      clearTimeout(timeoutId);
      this.updateConnectionStatus(false);
      throw error;
    }
  },

  updateConnectionStatus(isConnected) {
    const badge = document.querySelector("#apiStatusBadge");
    if (!badge) return;

    if (isConnected) {
      badge.className = "api-status-badge connected";
      badge.innerHTML = `<i class="bi bi-circle-fill" style="font-size:8px;color:#22c55e;"></i> Java API Conectada`;
      badge.title = `Conectado a ${SIPTEC_CONFIG.getApiUrl()}`;
    } else {
      badge.className = "api-status-badge mock";
      badge.innerHTML = `<i class="bi bi-circle-fill" style="font-size:8px;color:#ef4444;"></i> Sin conexion`;
      badge.title = `No se detecta la API en ${SIPTEC_CONFIG.getApiUrl()}`;
    }
  }
};

window.apiService = apiService;
