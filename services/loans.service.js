/**
 * SIPTEC - Servicio de Préstamos
 * Conecta con `/api/loans` en el backend Java Spring Boot.
 */
const loansService = {
  async getAll() {
    return await apiService.request(SIPTEC_CONFIG.ENDPOINTS.LOANS, { method: "GET" });
  },

  async create(loanData) {
    return await apiService.request(SIPTEC_CONFIG.ENDPOINTS.LOANS, {
      method: "POST",
      body: JSON.stringify(loanData)
    });
  },

  async updateState(id, newState) {
    return await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.LOANS}/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ state: newState })
    });
  },

  async update(id, loanData) {
    return await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.LOANS}/${id}`, {
      method: "PUT",
      body: JSON.stringify(loanData)
    });
  },

  async delete(id) {
    return await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.LOANS}/${id}`, {
      method: "DELETE"
    });
  }
};

window.loansService = loansService;
