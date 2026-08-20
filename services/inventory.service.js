/**
 * SIPTEC - Servicio de Inventario
 * Conecta la UI existente con /api/herramientas.
 */
const inventoryService = {
  mapFromApi(item) {
    return {
      id: item.idHerramienta || item.id,
      code: item.codigo || item.codInv || `HER-${String(item.idHerramienta || item.id || "").padStart(3, "0")}`,
      name: item.nombreHerramienta || item.name || "",
      category: item.nombreCategoria || item.category || "",
      area: item.nombreArea || item.area || (item.idArea ? `Area ${item.idArea}` : ""),
      acquiredAt: item.fechaAdquisicion || item.acquiredAt || "",
      status: item.nombreEstadoHerramienta || item.status || (Number(item.stock || 0) > 0 ? "Disponible" : "Prestado"),
      stock: item.stock || 0,
      raw: item
    };
  },

  mapToApi(item) {
    return {
      idHerramienta: item.idHerramienta || item.id || 0,
      nombreHerramienta: item.nombreHerramienta || item.name || item.nombre || "",
      descripcionHerramienta: item.descripcionHerramienta || item.description || item.descripcion || "",
      stock: Number.isFinite(Number(item.stock)) ? Number(item.stock) : 1,
      idArea: item.idArea || item.areaId || null
    };
  },

  async getAll() {
    const data = await apiService.request(SIPTEC_CONFIG.ENDPOINTS.INVENTORY, { method: "GET" });
    return Array.isArray(data) ? data.map(this.mapFromApi) : [];
  },

  async create(itemData) {
    const saved = await apiService.request(SIPTEC_CONFIG.ENDPOINTS.INVENTORY, {
      method: "POST",
      body: JSON.stringify(this.mapToApi(itemData))
    });
    return this.mapFromApi(saved || {});
  },

  async update(id, itemData) {
    const saved = await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.INVENTORY}/${id}`, {
      method: "PUT",
      body: JSON.stringify(this.mapToApi({ ...itemData, id }))
    });
    return this.mapFromApi(saved || {});
  },

  async delete(id) {
    return await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.INVENTORY}/${id}`, { method: "DELETE" });
  }
};

window.inventoryService = inventoryService;
