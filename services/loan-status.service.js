/**
 * SIPTEC - Servicio de Estados de Prestamo
 * Tabla ESTADO_PRESTAMO. Consume el endpoint /api/estado de la API Spring Boot.
 */
const loanStatusService = {
  mapFromApi(item) {
    return {
      id: item.id || item.idEstado || null,
      name: item.nombreEstado || item.nombre || item.name || "",
      raw: item
    };
  },

  mapToApi(item) {
    return {
      id: item.id || 0,
      nombreEstado: item.nombreEstado || item.name || item.nombre || ""
    };
  },

  async getAll() {
    const data = await apiService.request(SIPTEC_CONFIG.ENDPOINTS.LOAN_STATUS, { method: "GET" });
    return Array.isArray(data) ? data.map(this.mapFromApi) : [];
  },

  async getById(id) {
    const data = await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.LOAN_STATUS}/${id}`, { method: "GET" });
    return this.mapFromApi(data || {});
  },

  async findIdByName(name) {
    const all = await this.getAll().catch(() => []);
    const found = all.find(item => String(item.name).toLowerCase() === String(name || "").toLowerCase());
    return found ? found.id : null;
  },

  async create(itemData) {
    const saved = await apiService.request(SIPTEC_CONFIG.ENDPOINTS.LOAN_STATUS, {
      method: "POST",
      body: JSON.stringify(this.mapToApi(itemData))
    });
    return this.mapFromApi(saved || {});
  },

  async update(id, itemData) {
    const saved = await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.LOAN_STATUS}/${id}`, {
      method: "PUT",
      body: JSON.stringify(this.mapToApi({ ...itemData, id }))
    });
    return this.mapFromApi(saved || {});
  },

  async delete(id) {
    return await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.LOAN_STATUS}/${id}`, { method: "DELETE" });
  }
};

window.loanStatusService = loanStatusService;
