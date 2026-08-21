/**
 * SIPTEC - Servicio de Herramienta-Categoria
 * Tabla intermedia HERRAMIENTA_CATEGORIA (clave compuesta IDCATEGORIA + IDHERRAMIENTA).
 * Consume el endpoint /api/herramientaCategoria de la API Spring Boot.
 */
const toolCategoriesService = {
  mapFromApi(item) {
    return {
      categoryId: item.categoria || item.idCategoria || item.categoryId || null,
      toolId: item.herramienta || item.idHerramienta || item.toolId || null,
      categoryName: item.nombreCategoria || "",
      toolName: item.nombreHerramienta || "",
      raw: item
    };
  },

  mapToApi(item) {
    return {
      categoria: Number(item.categoria || item.idCategoria || item.categoryId) || null,
      herramienta: Number(item.herramienta || item.idHerramienta || item.toolId) || null
    };
  },

  async getAll() {
    const data = await apiService.request(SIPTEC_CONFIG.ENDPOINTS.TOOL_CATEGORIES, { method: "GET" });
    return Array.isArray(data) ? data.map(this.mapFromApi) : [];
  },

  async getByTool(toolId) {
    const all = await this.getAll();
    return all.filter(item => Number(item.toolId) === Number(toolId));
  },

  async getByCategory(categoryId) {
    const all = await this.getAll();
    return all.filter(item => Number(item.categoryId) === Number(categoryId));
  },

  async assign(categoryId, toolId) {
    const saved = await apiService.request(SIPTEC_CONFIG.ENDPOINTS.TOOL_CATEGORIES, {
      method: "POST",
      body: JSON.stringify(this.mapToApi({ categoryId, toolId }))
    });
    return this.mapFromApi(saved || {});
  },

  async revoke(categoryId, toolId) {
    return await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.TOOL_CATEGORIES}/${categoryId}/${toolId}`, {
      method: "DELETE"
    });
  }
};

window.toolCategoriesService = toolCategoriesService;
