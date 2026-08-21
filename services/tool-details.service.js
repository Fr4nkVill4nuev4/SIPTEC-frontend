/**
 * SIPTEC - Servicio de Detalle de Herramientas
 * Tabla DETALLE_HERRAMIENTAS (unidad fisica con codigo de inventario, marca y estado).
 * Consume el endpoint /api/detalle-herramienta de la API Spring Boot.
 */
const toolDetailsService = {
  mapFromApi(item) {
    return {
      id: item.id || item.idDetalle || null,
      toolId: item.herramienta || item.idHerramienta || null,
      toolName: item.nombreHerramienta || "",
      brandId: item.marca || item.idMarca || null,
      brandName: item.nombreMarca || "",
      statusId: item.estadoHerramienta || item.idEstadoHerramienta || null,
      statusName: item.nombreEstadoHerramienta || "",
      code: item.codInv || item.codigo || "",
      raw: item
    };
  },

  mapToApi(item) {
    return {
      id: item.id || 0,
      herramienta: Number(item.herramienta || item.idHerramienta || item.toolId) || null,
      marca: Number(item.marca || item.idMarca || item.brandId) || null,
      estadoHerramienta: Number(item.estadoHerramienta || item.idEstadoHerramienta || item.statusId) || null,
      codInv: item.codInv || item.code || ""
    };
  },

  async getAll() {
    const data = await apiService.request(SIPTEC_CONFIG.ENDPOINTS.TOOL_DETAILS, { method: "GET" });
    return Array.isArray(data) ? data.map(this.mapFromApi) : [];
  },

  async getById(id) {
    const data = await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.TOOL_DETAILS}/${id}`, { method: "GET" });
    return this.mapFromApi(data || {});
  },

  async getByTool(toolId) {
    const all = await this.getAll();
    return all.filter(item => Number(item.toolId) === Number(toolId));
  },

  async create(itemData) {
    const saved = await apiService.request(SIPTEC_CONFIG.ENDPOINTS.TOOL_DETAILS, {
      method: "POST",
      body: JSON.stringify(this.mapToApi(itemData))
    });
    return this.mapFromApi(saved || {});
  },

  async update(id, itemData) {
    const saved = await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.TOOL_DETAILS}/${id}`, {
      method: "PUT",
      body: JSON.stringify(this.mapToApi({ ...itemData, id }))
    });
    return this.mapFromApi(saved || {});
  },

  async delete(id) {
    return await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.TOOL_DETAILS}/${id}`, { method: "DELETE" });
  }
};

window.toolDetailsService = toolDetailsService;
