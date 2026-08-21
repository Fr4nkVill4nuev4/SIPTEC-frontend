/**
 * SIPTEC - Servicio de Categorias
 * Tabla CATEGORIA. Consume el endpoint /api/categoria de la API Spring Boot.
 */
const categoriesService = {
  mapFromApi(item) {
    return {
      id: item.id || item.idCategoria || null,
      name: item.nombreCategoria || item.nombre || item.name || "",
      raw: item
    };
  },

  mapToApi(item) {
    return {
      id: item.id || 0,
      nombreCategoria: item.nombreCategoria || item.name || item.nombre || ""
    };
  },

  async getAll() {
    const data = await apiService.request(SIPTEC_CONFIG.ENDPOINTS.CATEGORIES, { method: "GET" });
    return Array.isArray(data) ? data.map(this.mapFromApi) : [];
  },

  async getById(id) {
    const data = await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.CATEGORIES}/${id}`, { method: "GET" });
    return this.mapFromApi(data || {});
  },

  async create(itemData) {
    const saved = await apiService.request(SIPTEC_CONFIG.ENDPOINTS.CATEGORIES, {
      method: "POST",
      body: JSON.stringify(this.mapToApi(itemData))
    });
    return this.mapFromApi(saved || {});
  },

  async update(id, itemData) {
    const saved = await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.CATEGORIES}/${id}`, {
      method: "PUT",
      body: JSON.stringify(this.mapToApi({ ...itemData, id }))
    });
    return this.mapFromApi(saved || {});
  },

  async delete(id) {
    return await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.CATEGORIES}/${id}`, { method: "DELETE" });
  }
};

window.categoriesService = categoriesService;
