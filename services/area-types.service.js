/**
 * SIPTEC - Servicio de Tipos de Area
 * Consume el endpoint /api/tipoArea de la API Spring Boot.
 */
const areaTypesService = {
  async getAll() {
    const data = await apiService.request(SIPTEC_CONFIG.ENDPOINTS.AREA_TYPES, { method: "GET" });
    return Array.isArray(data) ? data : [];
  },

  getId(item) {
    return item.id || item.idTipoArea || item.tipoAreaId || "";
  },

  getName(item) {
    return item.nombreTipoArea || item.nombre || item.name || "Sin nombre";
  }
};

window.areaTypesService = areaTypesService;
