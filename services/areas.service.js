/**
 * SIPTEC - Servicio de Areas
 * Consume el endpoint /api/area de la API Spring Boot.
 */
const areasService = {
  async getAll() {
    const data = await apiService.request(SIPTEC_CONFIG.ENDPOINTS.AREAS, { method: "GET" });
    return Array.isArray(data) ? data : [];
  },

  getId(item) {
    return item.id || item.idArea || item.areaId || "";
  },

  getName(item) {
    return item.nombreArea || item.nombre || item.name || "Sin nombre";
  },

  getTypeName(item) {
    const type = item.tipoArea || item.tipo || item.areaTipo || item.idTipoArea;
    if (type && typeof type === "object") {
      return type.nombreTipoArea || type.nombre || type.name || `Tipo ${type.id || type.idTipoArea || ""}`.trim();
    }
    return item.nombreTipoArea || item.tipoAreaNombre || item.tipoNombre || (type ? String(type) : "Sin tipo");
  }
};

window.areasService = areasService;
