/**
 * SIPTEC - Servicio de Historial
 * Conecta con `/api/history` en el backend Java Spring Boot.
 */
const historyService = {
  async getAll() {
    return await apiService.request(SIPTEC_CONFIG.ENDPOINTS.HISTORY, { method: "GET" });
  }
};

window.historyService = historyService;
