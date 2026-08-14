/**
 * SIPTEC - Servicio de Inventario
 * Conecta con `/api/inventory` en el backend Java Spring Boot.
 */
const inventoryService = {
  async getAll() {
    return await apiService.request(SIPTEC_CONFIG.ENDPOINTS.INVENTORY, { method: "GET" });
  },

  async create(itemData) {
    return await apiService.request(SIPTEC_CONFIG.ENDPOINTS.INVENTORY, {
      method: "POST",
      body: JSON.stringify(itemData)
    });
  },

  async update(id, itemData) {
    return await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.INVENTORY}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(itemData)
    });
  },

  async delete(id) {
    return await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.INVENTORY}/${id}`, {
      method: "DELETE"
    });
  }
};

window.inventoryService = inventoryService;
