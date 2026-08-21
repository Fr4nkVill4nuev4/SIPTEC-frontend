/**
 * SIPTEC - Servicio de Devoluciones
 * La API no tiene modulo separado de devoluciones; se deriva de /api/prestamo.
 */
const RETURNS_CLOSED_STORAGE_KEY = "siptec_closed_returns";

const returnsService = {
  getClosedIds() {
    try {
      const data = localStorage.getItem(RETURNS_CLOSED_STORAGE_KEY);
      return new Set(data ? JSON.parse(data).map(Number) : []);
    } catch {
      return new Set();
    }
  },

  closeLocal(id) {
    const closed = this.getClosedIds();
    closed.add(Number(id));
    localStorage.setItem(RETURNS_CLOSED_STORAGE_KEY, JSON.stringify([...closed]));
  },

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
    const closed = this.getClosedIds();
    const loans = await loansService.getAll();
    return loans
      .map(this.mapFromLoan)
      .filter(item => {
        const status = String(item.status || "").toLowerCase();
        return !closed.has(Number(item.id)) &&
          !status.includes("devuelto") &&
          !status.includes("entregado") &&
          !status.includes("dañado") &&
          !status.includes("danado");
      });
  },

  async processReturn(id, returnData = {}) {
    const loan = await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.LOANS}/${id}`, { method: "GET" });
    const normalized = loansService.mapFromApi(loan || {});
    const result = await loansService.update(id, {
      ...normalized,
      returnedAt: returnData.fechaDevolucion || new Date().toISOString().slice(0, 10)
    });
    this.closeLocal(id);
    return result;
  },

  async reportDamage(id, damageData) {
    this.closeLocal(id);
    return { id, ...damageData, status: "Dañado" };
  }
};

window.returnsService = returnsService;
