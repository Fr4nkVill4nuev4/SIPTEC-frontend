/**
 * SIPTEC - Servicio de Reportes
 * La API actual no tiene modulo de reportes; genera tarjetas desde datos reales.
 */
const reportsService = {
  async getAll() {
    const [items, loans] = await Promise.all([
      inventoryService.getAll().catch(() => []),
      loansService.getAll().catch(() => [])
    ]);

    if (!items.length && !loans.length) return [];

    const now = new Date().toLocaleString("es-SV", { dateStyle: "short", timeStyle: "short" });
    const activeLoans = loans.filter(l => !String(l.state || "").toLowerCase().includes("devuelto"));
    const damagedItems = items.filter(i => String(i.status || "").toLowerCase().includes("da"));
    const mostUsed = items.slice(0, 5).map((item, idx) => `${idx + 1}. ${item.name || item.code}`).join("\n");

    const reports = [];
    if (activeLoans.length) {
      reports.push({
        id: 1,
        title: "Reporte de prestamos activos",
        type: "General",
        author: "Admin Principal",
        createdAt: now,
        description: "Resumen de prestamos activos en la plataforma.",
        content: activeLoans.map(l => `${l.code} | ${l.product || ""} | ${l.user || ""} | ${l.startDate || ""}`).join("\n")
      });
    }

    if (items.length) {
      reports.push({
        id: 2,
        title: "Herramientas mas usadas",
        type: "General",
        author: "Admin Principal",
        createdAt: now,
        description: "Reporte resumido para seguimiento de inventario.",
        content: mostUsed
      });
    }

    damagedItems.forEach((item, index) => {
      reports.push({
        id: 10 + index,
        title: `Dano reportado: ${item.name || item.code}`,
        type: "Dano",
        author: "Admin Principal",
        createdAt: now,
        description: `${item.code || ""} se encuentra marcado como ${item.status || "danado"}.`,
        content: `Herramienta: ${item.name || ""}\nCodigo: ${item.code || ""}\nArea: ${item.area || ""}`
      });
    });

    return reports;
  },

  async create(reportData) {
    return reportData;
  },

  async delete(id) {
    return { id };
  }
};

window.reportsService = reportsService;
