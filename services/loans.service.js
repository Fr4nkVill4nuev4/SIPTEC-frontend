/**
 * SIPTEC - Servicio de Prestamos
 * Conecta la UI existente con /api/prestamo.
 */
const loansService = {
  mapFromApi(loan) {
    const id = loan.id;
    const stateText = loan.nombreEstado || loan.state || (loan.estado ? `Estado ${loan.estado}` : "Pendiente");
    return {
      id,
      code: loan.code || `PR-${String(id || "").padStart(3, "0")}`,
      user: loan.nombreUsuario || loan.user || (loan.usuario ? `Usuario ${loan.usuario}` : ""),
      startDate: loan.fechaInicio || "",
      expectedDate: loan.fechaEsperada || "",
      returnedAt: loan.fechaDevolucion || "",
      product: loan.nombreHerramienta || loan.product || "",
      description: loan.description || "",
      materialState: loan.materialState || stateText,
      state: stateText,
      usuario: loan.usuario || null,
      estado: loan.estado || null,
      raw: loan
    };
  },

  mapToApi(loan) {
    return {
      id: loan.id || 0,
      usuario: loan.usuario || loan.userId || null,
      fechaInicio: loan.fechaInicio || loan.startDate || new Date().toISOString().slice(0, 10),
      fechaEsperada: loan.fechaEsperada || loan.expectedDate || loan.fechaInicio || loan.startDate || new Date().toISOString().slice(0, 10),
      fechaDevolucion: loan.fechaDevolucion || loan.returnedAt || null,
      estado: loan.estado || loan.stateId || null
    };
  },

  async getAll() {
    const data = await apiService.request(SIPTEC_CONFIG.ENDPOINTS.LOANS, { method: "GET" });
    return Array.isArray(data) ? data.map(this.mapFromApi) : [];
  },

  async create(loanData) {
    const saved = await apiService.request(SIPTEC_CONFIG.ENDPOINTS.LOANS, {
      method: "POST",
      body: JSON.stringify(this.mapToApi(loanData))
    });
    return this.mapFromApi(saved || {});
  },

  async updateState(id, newState) {
    const current = await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.LOANS}/${id}`, { method: "GET" });
    const mapped = this.mapFromApi(current || {});
    const statusId = await this.resolveStatusId(newState);
    const saved = await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.LOANS}/${id}`, {
      method: "PUT",
      body: JSON.stringify(this.mapToApi({ ...mapped, id, estado: statusId || mapped.estado, state: newState }))
    });
    return this.mapFromApi({ ...(saved || {}), state: newState });
  },

  async resolveStatusId(name) {
    try {
      const statuses = await apiService.request(SIPTEC_CONFIG.ENDPOINTS.LOAN_STATUS, { method: "GET" });
      const found = Array.isArray(statuses) ? statuses.find(s => String(s.nombreEstado || "").toLowerCase() === String(name || "").toLowerCase()) : null;
      return found ? found.id : null;
    } catch {
      return null;
    }
  },

  async update(id, loanData) {
    const saved = await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.LOANS}/${id}`, {
      method: "PUT",
      body: JSON.stringify(this.mapToApi({ ...loanData, id }))
    });
    return this.mapFromApi(saved || {});
  },

  async delete(id) {
    return await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.LOANS}/${id}`, { method: "DELETE" });
  }
};

window.loansService = loansService;
