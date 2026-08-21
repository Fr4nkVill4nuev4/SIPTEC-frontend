/**
 * SIPTEC - Servicio de Permisos
 * Tabla PERMISO. Consume el endpoint /api/permisos de la API Spring Boot.
 */
const permissionsService = {
  mapFromApi(item) {
    return {
      id: item.id || item.idPermiso || null,
      name: item.nombrePermiso || item.nombre || item.name || "",
      raw: item
    };
  },

  mapToApi(item) {
    return {
      id: item.id || 0,
      nombrePermiso: item.nombrePermiso || item.name || item.nombre || ""
    };
  },

  async getAll() {
    const data = await apiService.request(SIPTEC_CONFIG.ENDPOINTS.PERMISSIONS, { method: "GET" });
    return Array.isArray(data) ? data.map(this.mapFromApi) : [];
  },

  async getById(id) {
    const data = await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.PERMISSIONS}/${id}`, { method: "GET" });
    return this.mapFromApi(data || {});
  },

  async create(itemData) {
    const saved = await apiService.request(SIPTEC_CONFIG.ENDPOINTS.PERMISSIONS, {
      method: "POST",
      body: JSON.stringify(this.mapToApi(itemData))
    });
    return this.mapFromApi(saved || {});
  },

  async update(id, itemData) {
    const saved = await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.PERMISSIONS}/${id}`, {
      method: "PUT",
      body: JSON.stringify(this.mapToApi({ ...itemData, id }))
    });
    return this.mapFromApi(saved || {});
  },

  async delete(id) {
    return await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.PERMISSIONS}/${id}`, { method: "DELETE" });
  }
};

window.permissionsService = permissionsService;
