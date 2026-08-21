/**
 * SIPTEC - Servicio de Prestamos
 * Conecta la UI existente con /api/prestamo y enriquece estados/usuarios.
 */
const loansService = {
  mapFromApi(loan, lookups = {}) {
    const id = loan.id;
    const statusName = lookups.statuses?.get(Number(loan.estado));
    const user = lookups.users?.get(Number(loan.usuario));
    const areaDetail = lookups.areaDetails?.get(Number(id));
    const stateText = loan.nombreEstado || loan.state || statusName || (loan.estado ? `Estado ${loan.estado}` : "Pendiente");
    const userName = loan.nombreUsuario || loan.user || user?.name || (loan.usuario ? `Usuario ${loan.usuario}` : "");
    const productName = areaDetail?.nombreArea || loan.nombreArea || loan.nombreHerramienta || loan.product || "Area prestada";

    return {
      id,
      code: loan.code || `PR-${String(id || "").padStart(3, "0")}`,
      user: userName,
      userId: loan.usuario || user?.id || null,
      startDate: loan.fechaInicio || "",
      expectedDate: loan.fechaEsperada || "",
      returnedAt: loan.fechaDevolucion || "",
      product: productName,
      description: loan.description || `${userName || "Usuario"} solicita ${productName}.`,
      materialState: loan.materialState || stateText,
      state: stateText,
      usuario: loan.usuario || null,
      estado: loan.estado || null,
      type: areaDetail ? "Area" : (loan.nombreHerramienta ? "Herramienta" : "Prestamo"),
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
    const [data, statuses, users, areaDetails] = await Promise.all([
      apiService.request(SIPTEC_CONFIG.ENDPOINTS.LOANS, { method: "GET" }),
      apiService.request(SIPTEC_CONFIG.ENDPOINTS.LOAN_STATUS, { method: "GET" }).catch(() => []),
      apiService.request(SIPTEC_CONFIG.ENDPOINTS.USERS, { method: "GET" }).catch(() => []),
      apiService.request(SIPTEC_CONFIG.ENDPOINTS.LOAN_AREA_DETAILS, { method: "GET" }).catch(() => [])
    ]);

    const lookups = {
      statuses: new Map((Array.isArray(statuses) ? statuses : []).map(item => [Number(item.id), item.nombreEstado || item.name])),
      users: new Map((Array.isArray(users) ? users : []).map(item => [Number(item.id), {
        id: item.id,
        name: `${item.nombreUsuario || ""} ${item.apellidoUsuario || ""}`.trim() || item.correoUsuario || `Usuario ${item.id}`
      }])),
      areaDetails: new Map((Array.isArray(areaDetails) ? areaDetails : []).map(item => [Number(item.prestamo || item.idPrestamo), item]))
    };

    return Array.isArray(data) ? data.map(item => this.mapFromApi(item, lookups)) : [];
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
