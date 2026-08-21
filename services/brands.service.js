/**
 * SIPTEC - Servicio de Marcas
 * Consume el endpoint /api/marca de la API Spring Boot.
 */
const brandsService = {
  async getAll() {
    const data = await apiService.request(SIPTEC_CONFIG.ENDPOINTS.BRANDS, { method: "GET" });
    return Array.isArray(data) ? data : [];
  },

  getId(item) {
    return item.id || item.idMarca || item.marcaId || "";
  },

  getName(item) {
    return item.nombreMarca || item.nombre || item.name || "Sin marca";
  }
};

window.brandsService = brandsService;
