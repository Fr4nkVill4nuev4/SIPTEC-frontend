/**
 * SIPTEC - Servicio de Tipos de Area
 * Tabla TIPO_AREA. Consume el endpoint /api/tipoArea de la API Spring Boot.
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
  },

  mapToApi(item) {
    return {
      id: item.id || 0,
      nombreTipoArea: item.nombreTipoArea || item.name || item.nombre || ""
    };
  },

  async getById(id) {
    return await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.AREA_TYPES}/${id}`, { method: "GET" });
  },

  async create(itemData) {
    return await apiService.request(SIPTEC_CONFIG.ENDPOINTS.AREA_TYPES, {
      method: "POST",
      body: JSON.stringify(this.mapToApi(itemData))
    });
  },

  async update(id, itemData) {
    return await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.AREA_TYPES}/${id}`, {
      method: "PUT",
      body: JSON.stringify(this.mapToApi({ ...itemData, id }))
    });
  },

  async delete(id) {
    return await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.AREA_TYPES}/${id}`, { method: "DELETE" });
  }
};

window.areaTypesService = areaTypesService;
