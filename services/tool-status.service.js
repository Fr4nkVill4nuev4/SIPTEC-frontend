/**
 * SIPTEC - Servicio de Estados de Herramienta
 * Tabla ESTADO_HERRAMIENTA. Consume el endpoint /api/estadoHerramienta de la API Spring Boot.
 */
const toolStatusService = {
  mapFromApi(item) {
    return {
      id: item.id || item.idEstadoHerramienta || null,
      name: item.nombreEstadoHerramienta || item.nombreEstado || item.nombre || item.name || "",
      raw: item
    };
  },

  mapToApi(item) {
    return {
      id: item.id || 0,
      nombreEstadoHerramienta: item.nombreEstadoHerramienta || item.name || item.nombre || ""
    };
  },

  async getAll() {
    const data = await apiService.request(SIPTEC_CONFIG.ENDPOINTS.TOOL_STATUS, { method: "GET" });
    return Array.isArray(data) ? data.map(this.mapFromApi) : [];
  },

  async getById(id) {
    const data = await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.TOOL_STATUS}/${id}`, { method: "GET" });
    return this.mapFromApi(data || {});
  },

  async findIdByName(name) {
    const all = await this.getAll().catch(() => []);
    const found = all.find(item => String(item.name).toLowerCase() === String(name || "").toLowerCase());
    return found ? found.id : null;
  },

  async create(itemData) {
    const saved = await apiService.request(SIPTEC_CONFIG.ENDPOINTS.TOOL_STATUS, {
      method: "POST",
      body: JSON.stringify(this.mapToApi(itemData))
    });
    return this.mapFromApi(saved || {});
  },

  async update(id, itemData) {
    const saved = await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.TOOL_STATUS}/${id}`, {
      method: "PUT",
      body: JSON.stringify(this.mapToApi({ ...itemData, id }))
    });
    return this.mapFromApi(saved || {});
  },

  async delete(id) {
    return await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.TOOL_STATUS}/${id}`, { method: "DELETE" });
  }
};

window.toolStatusService = toolStatusService;
