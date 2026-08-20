/**
 * SIPTEC - Servicio de Historial
 * La API no tiene modulo separado de historial; se deriva de /api/prestamo.
 */
const historyService = {
  async getAll() {
    const loans = await loansService.getAll();
    return loans.map(loan => ({
      id: loan.id,
      code: loan.code,
      item: loan.product || "",
      start: loan.startDate || "",
      end: loan.returnedAt || loan.expectedDate || "",
      user: loan.user || "",
      status: loan.returnedAt ? "Devuelto" : loan.state || "Pendiente"
    }));
  }
};

window.historyService = historyService;
