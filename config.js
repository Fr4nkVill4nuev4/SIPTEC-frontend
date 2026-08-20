/**
 * SIPTEC - Configuracion Global del Frontend
 * Centraliza la conexion con la API Java Spring Boot y las claves locales.
 */
const SIPTEC_CONFIG = {
  API_BASE_URL: localStorage.getItem("siptec_api_url") || "http://localhost:8080",
  REQUEST_TIMEOUT_MS: 5000,

  SESSION_STORAGE_KEY: "siptec_session",
  THEME_STORAGE_KEY: "siptec_theme",
  MOCK_MODE_KEY: "siptec_force_mock_mode",

  ENDPOINTS: {
    AUTH_LOGIN: "/api/auth/login",
    AUTH_LOGOUT: "/api/auth/logout",
    INVENTORY: "/api/herramientas",
    TOOL_DETAILS: "/api/detalle-herramienta",
    TOOL_STATUS: "/api/estadoHerramienta",
    CATEGORIES: "/api/categoria",
    TOOL_CATEGORIES: "/api/herramientaCategoria",
    AREAS: "/api/area",
    AREA_TYPES: "/api/tipoArea",
    BRANDS: "/api/marca",
    LOANS: "/api/prestamo",
    LOAN_DETAILS: "/api/detallePrestamoHerramienta",
    LOAN_STATUS: "/api/estado",
    RETURNS: "/api/prestamo",
    USERS: "/api/usuarios",
    ROLES: "/api/roles",
    PERMISSIONS: "/api/permisos",
    ROLE_PERMISSIONS: "/api/rolPermiso",
    INSTITUTIONS: "/api/instituciones",
    REPORTS: "/api/prestamo",
    HISTORY: "/api/prestamo"
  },

  getApiUrl() {
    return (localStorage.getItem("siptec_api_url") || this.API_BASE_URL).replace(/\/+$/, "");
  },

  setApiUrl(url) {
    var cleanUrl = (url || "").trim().replace(/\/+$/, "");
    if (!cleanUrl) cleanUrl = "http://localhost:8080";
    localStorage.setItem("siptec_api_url", cleanUrl);
    this.API_BASE_URL = cleanUrl;
  }
};

window.SIPTEC_CONFIG = SIPTEC_CONFIG;

