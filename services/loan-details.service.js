/**
 * SIPTEC - Servicio de Detalle de Prestamo (Herramientas)
 * Tabla DETALLE_PRESTAMO_HERRAMIENTAS.
 * Consume el endpoint /api/detallePrestamoHerramienta de la API Spring Boot.
 */
const loanDetailsService = {
  mapFromApi(item) {
    return {
      id: item.id || item.idDetalle || null,
      loanId: item.prestamo || item.idPrestamo || null,
      toolId: item.herramienta || item.idHerramienta || null,
      toolName: item.nombreHerramienta || "",
      quantity: Number(item.cantidad != null ? item.cantidad : 1),
      raw: item
    };
  },

  mapToApi(item) {
    return {
      id: item.id || 0,
      prestamo: Number(item.prestamo || item.idPrestamo || item.loanId) || null,
      herramienta: Number(item.herramienta || item.idHerramienta || item.toolId) || null,
      cantidad: Number(item.cantidad != null ? item.cantidad : item.quantity != null ? item.quantity : 1)
    };
  },

  async getAll() {
    const data = await apiService.request(SIPTEC_CONFIG.ENDPOINTS.LOAN_DETAILS, { method: "GET" });
    return Array.isArray(data) ? data.map(this.mapFromApi) : [];
  },

  async getById(id) {
    const data = await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.LOAN_DETAILS}/${id}`, { method: "GET" });
    return this.mapFromApi(data || {});
  },

  async getByLoan(loanId) {
    const all = await this.getAll();
    return all.filter(item => Number(item.loanId) === Number(loanId));
  },

  async create(itemData) {
    const saved = await apiService.request(SIPTEC_CONFIG.ENDPOINTS.LOAN_DETAILS, {
      method: "POST",
      body: JSON.stringify(this.mapToApi(itemData))
    });
    return this.mapFromApi(saved || {});
  },

  async update(id, itemData) {
    const saved = await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.LOAN_DETAILS}/${id}`, {
      method: "PUT",
      body: JSON.stringify(this.mapToApi({ ...itemData, id }))
    });
    return this.mapFromApi(saved || {});
  },

  async delete(id) {
    return await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.LOAN_DETAILS}/${id}`, { method: "DELETE" });
  }
};

window.loanDetailsService = loanDetailsService;
