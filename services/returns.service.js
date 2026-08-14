/**
 * SIPTEC - Servicio de Devoluciones
 * Conecta con `/api/returns` en el backend Java Spring Boot.
 */
const returnsService = {
  async getAll() {
    return await apiService.request(SIPTEC_CONFIG.ENDPOINTS.RETURNS, { method: "GET" });
  },

  async processReturn(id, returnData = {}) {
    return await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.RETURNS}/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ action: "devuelto", ...returnData })
    });
  },

  async reportDamage(id, damageData) {
    // Registra daño en devoluciones y crea un reporte
    return await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.RETURNS}/${id}/damage`, {
      method: "POST",
      body: JSON.stringify(damageData)
    });
  }
};

window.returnsService = returnsService;
