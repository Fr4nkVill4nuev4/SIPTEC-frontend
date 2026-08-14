/**
 * SIPTEC - Servicio de Reportes
 * Conecta con `/api/reports` en el backend Java Spring Boot.
 */
const reportsService = {
  async getAll() {
    return await apiService.request(SIPTEC_CONFIG.ENDPOINTS.REPORTS, { method: "GET" });
  },

  async create(reportData) {
    return await apiService.request(SIPTEC_CONFIG.ENDPOINTS.REPORTS, {
      method: "POST",
      body: JSON.stringify(reportData)
    });
  },

  async delete(id) {
    return await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.REPORTS}/${id}`, {
      method: "DELETE"
    });
  }
};

window.reportsService = reportsService;
