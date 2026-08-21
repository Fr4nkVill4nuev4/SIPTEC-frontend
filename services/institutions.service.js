/**
 * SIPTEC - Servicio de Instituciones
 * Tabla INSTITUCIONES. Consume el endpoint /api/instituciones de la API Spring Boot.
 */
const institutionsService = {
  mapFromApi(item) {
    return {
      id: item.id || item.idInstitucion || null,
      name: item.nombreInstitucion || item.nombre || item.name || "",
      raw: item
    };
  },

  mapToApi(item) {
    return {
      id: item.id || 0,
      nombreInstitucion: item.nombreInstitucion || item.name || item.nombre || ""
    };
  },

  async getAll() {
    const data = await apiService.request(SIPTEC_CONFIG.ENDPOINTS.INSTITUTIONS, { method: "GET" });
    return Array.isArray(data) ? data.map(this.mapFromApi) : [];
  },

  async getById(id) {
    const data = await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.INSTITUTIONS}/${id}`, { method: "GET" });
    return this.mapFromApi(data || {});
  },

  async create(itemData) {
    const saved = await apiService.request(SIPTEC_CONFIG.ENDPOINTS.INSTITUTIONS, {
      method: "POST",
      body: JSON.stringify(this.mapToApi(itemData))
    });
    return this.mapFromApi(saved || {});
  },

  async update(id, itemData) {
    const saved = await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.INSTITUTIONS}/${id}`, {
      method: "PUT",
      body: JSON.stringify(this.mapToApi({ ...itemData, id }))
    });
    return this.mapFromApi(saved || {});
  },

  async delete(id) {
    return await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.INSTITUTIONS}/${id}`, { method: "DELETE" });
  }
};

window.institutionsService = institutionsService;
