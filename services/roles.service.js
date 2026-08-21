/**
 * SIPTEC - Servicio de Roles
 * Tabla ROLES. Consume el endpoint /api/roles de la API Spring Boot.
 */
const rolesService = {
  mapFromApi(item) {
    return {
      id: item.id || item.idRol || null,
      name: item.nombreRol || item.nombre || item.name || "",
      raw: item
    };
  },

  mapToApi(item) {
    return {
      id: item.id || 0,
      nombreRol: item.nombreRol || item.name || item.nombre || ""
    };
  },

  async getAll() {
    const data = await apiService.request(SIPTEC_CONFIG.ENDPOINTS.ROLES, { method: "GET" });
    return Array.isArray(data) ? data.map(this.mapFromApi) : [];
  },

  async getById(id) {
    const data = await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.ROLES}/${id}`, { method: "GET" });
    return this.mapFromApi(data || {});
  },

  async create(itemData) {
    const saved = await apiService.request(SIPTEC_CONFIG.ENDPOINTS.ROLES, {
      method: "POST",
      body: JSON.stringify(this.mapToApi(itemData))
    });
    return this.mapFromApi(saved || {});
  },

  async update(id, itemData) {
    const saved = await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.ROLES}/${id}`, {
      method: "PUT",
      body: JSON.stringify(this.mapToApi({ ...itemData, id }))
    });
    return this.mapFromApi(saved || {});
  },

  async delete(id) {
    return await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.ROLES}/${id}`, { method: "DELETE" });
  }
};

window.rolesService = rolesService;
