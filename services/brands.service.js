/**
 * SIPTEC - Servicio de Marcas
 * Tabla MARCA. Consume el endpoint /api/marca de la API Spring Boot.
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
  },

  mapToApi(item) {
    return {
      id: item.id || 0,
      nombreMarca: item.nombreMarca || item.name || item.nombre || ""
    };
  },

  async getById(id) {
    return await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.BRANDS}/${id}`, { method: "GET" });
  },

  async create(itemData) {
    return await apiService.request(SIPTEC_CONFIG.ENDPOINTS.BRANDS, {
      method: "POST",
      body: JSON.stringify(this.mapToApi(itemData))
    });
  },

  async update(id, itemData) {
    return await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.BRANDS}/${id}`, {
      method: "PUT",
      body: JSON.stringify(this.mapToApi({ ...itemData, id }))
    });
  },

  async delete(id) {
    return await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.BRANDS}/${id}`, { method: "DELETE" });
  }
};

window.brandsService = brandsService;
