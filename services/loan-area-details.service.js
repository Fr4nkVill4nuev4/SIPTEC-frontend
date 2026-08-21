/**
 * SIPTEC - Servicio de Detalle de Prestamo (Areas)
 * Tabla DETALLE_PRESTAMO_AREAS (clave compuesta AREAS_IDAREA + PRESTAMO_IDPRESTAMO).
 * Consume el endpoint /api/detallePrestamoArea de la API Spring Boot.
 */
const loanAreaDetailsService = {
  mapFromApi(item) {
    return {
      areaId: item.area || item.idArea || item.areasIdarea || null,
      loanId: item.prestamo || item.idPrestamo || item.prestamoIdprestamo || null,
      areaName: item.nombreArea || "",
      raw: item
    };
  },

  mapToApi(item) {
    return {
      area: Number(item.area || item.idArea || item.areaId) || null,
      prestamo: Number(item.prestamo || item.idPrestamo || item.loanId) || null
    };
  },

  async getAll() {
    const data = await apiService.request(SIPTEC_CONFIG.ENDPOINTS.LOAN_AREA_DETAILS, { method: "GET" });
    return Array.isArray(data) ? data.map(this.mapFromApi) : [];
  },

  async getByLoan(loanId) {
    const all = await this.getAll();
    return all.filter(item => Number(item.loanId) === Number(loanId));
  },

  async getByArea(areaId) {
    const all = await this.getAll();
    return all.filter(item => Number(item.areaId) === Number(areaId));
  },

  async assign(areaId, loanId) {
    const saved = await apiService.request(SIPTEC_CONFIG.ENDPOINTS.LOAN_AREA_DETAILS, {
      method: "POST",
      body: JSON.stringify(this.mapToApi({ areaId, loanId }))
    });
    return this.mapFromApi(saved || {});
  },

  async revoke(areaId, loanId) {
    return await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.LOAN_AREA_DETAILS}/${areaId}/${loanId}`, {
      method: "DELETE"
    });
  }
};

window.loanAreaDetailsService = loanAreaDetailsService;
