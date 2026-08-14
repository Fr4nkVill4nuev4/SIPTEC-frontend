/**
 * SIPTEC - Servicio de Usuarios
 * Conecta con `/api/users` en el backend Java Spring Boot.
 */
const usersService = {
  async getAll() {
    return await apiService.request(SIPTEC_CONFIG.ENDPOINTS.USERS, { method: "GET" });
  },

  async create(userData) {
    return await apiService.request(SIPTEC_CONFIG.ENDPOINTS.USERS, {
      method: "POST",
      body: JSON.stringify(userData)
    });
  },

  async update(id, userData) {
    return await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.USERS}/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData)
    });
  },

  async toggleActive(id, active) {
    return await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.USERS}/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ active })
    });
  }
};

window.usersService = usersService;
