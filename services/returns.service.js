/**
 * SIPTEC - Servicio de Devoluciones
 * La API no tiene modulo separado de devoluciones; se deriva de /api/prestamo.
 */
const returnsService = {
  mapFromLoan(loan) {
    const normalized = loansService.mapFromApi ? loansService.mapFromApi(loan.raw || loan) : loan;
    return {
      id: normalized.id,
      code: normalized.code,
      item: normalized.product || "",
      student: normalized.user || "",
      status: normalized.returnedAt ? "Devuelto" : normalized.state || "Pendiente",
      raw: normalized.raw || loan
    };
  },

  async getAll() {
    const loans = await loansService.getAll();
    return loans.map(this.mapFromLoan);
  },

  async processReturn(id, returnData = {}) {
    const loan = await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.LOANS}/${id}`, { method: "GET" });
    const normalized = loansService.mapFromApi(loan || {});
    return await loansService.update(id, {
      ...normalized,
      returnedAt: returnData.fechaDevolucion || new Date().toISOString().slice(0, 10)
    });
  },

  async reportDamage(id, damageData) {
    return { id, ...damageData, status: "Dañado" };
  }
};

window.returnsService = returnsService;
