/**
 * SIPTEC - Configuración Global del Frontend
 * Este archivo centraliza la conexión con el backend de Java (Spring Boot) y las claves de almacenamiento.
 */
const SIPTEC_CONFIG = {
  // URL base de la API Java Spring Boot
  API_BASE_URL: localStorage.getItem("siptec_api_url") || "http://localhost:8080",
  
  // Timeout para peticiones HTTP en milisegundos
  REQUEST_TIMEOUT_MS: 3500,

  // Claves de almacenamiento local y sesión
  SESSION_STORAGE_KEY: "siptec_session",
  THEME_STORAGE_KEY: "siptec_theme",
  MOCK_MODE_KEY: "siptec_force_mock_mode",

  // Mapeo de rutas REST del backend Java
  ENDPOINTS: {
    AUTH_LOGIN: "/api/auth/login",
    AUTH_LOGOUT: "/api/auth/logout",
    INVENTORY: "/api/inventory",
    LOANS: "/api/loans",
    RETURNS: "/api/returns",
    USERS: "/api/users",
    REPORTS: "/api/reports",
    HISTORY: "/api/history",
  },

  // Obtener URL de API actual
  getApiUrl() {
    return localStorage.getItem("siptec_api_url") || this.API_BASE_URL;
  },

  // Guardar nueva URL de API
  setApiUrl(url) {
    var cleanUrl = (url || "").trim().replace(/\/+$/, "");
    if (!cleanUrl) cleanUrl = "http://localhost:8080";
    localStorage.setItem("siptec_api_url", cleanUrl);
    this.API_BASE_URL = cleanUrl;
  }
};

window.SIPTEC_CONFIG = SIPTEC_CONFIG;
