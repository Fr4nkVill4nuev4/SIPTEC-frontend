/**
 * SIPTEC - Datos Simulados (Mock Data)
 * Coincide exactamente con los datos y estados de las capturas de pantalla de la aplicación.
 */
const SIPTEC_MOCK_DATA = {
  getStorage(key, defaultVal) {
    try {
      const data = localStorage.getItem("siptec_mock_" + key);
      return data ? JSON.parse(data) : defaultVal;
    } catch {
      return defaultVal;
    }
  },

  setStorage(key, val) {
    try {
      localStorage.setItem("siptec_mock_" + key, JSON.stringify(val));
    } catch (e) {
      console.warn("No se pudo persistir en localStorage", e);
    }
  },

  // 1. INVENTARIO
  getItems() {
    return this.getStorage("items", [
      { id: 1, code: "CAA-120", name: "Cautin", category: "Material de apoyo", area: "Bodega técnica", acquiredAt: "2026-05-12", status: "Prestado" },
      { id: 2, code: "MRT-009", name: "Martillo", category: "Mecánico", area: "Taller", acquiredAt: "2026-05-18", status: "Disponible" },
      { id: 3, code: "MUL-010", name: "Multímetro", category: "Equipo de medición", area: "Laboratorio", acquiredAt: "2026-06-01", status: "Prestado" },
      { id: 4, code: "SOL-001", name: "Soldadora", category: "Equipo técnico", area: "Área Técnica", acquiredAt: "2026-04-20", status: "Dañado" },
      { id: 5, code: "EQP-065", name: "Equipo de sonido", category: "Electrónico", area: "Audiovisuales", acquiredAt: "2026-03-30", status: "Disponible" },
      { id: 6, code: "PC001", name: "Computadora", category: "Equipo técnico", area: "Salones Técnicos de Desarrollo de Software", acquiredAt: "2026-07-17", status: "Disponible" }
    ]);
  },

  saveItems(items) {
    this.setStorage("items", items);
  },

  // 2. PRÉSTAMOS
  getLoans() {
    return this.getStorage("loans", [
      { id: 1, code: "PR-001", user: "Marco Perez", startDate: "2026-06-13", product: "Cautin", description: "Práctica técnica en laboratorio.", materialState: "Bueno", state: "Aprobado" },
      { id: 2, code: "PR-002", user: "Soporte IT", startDate: "2026-06-13", product: "Martillo", description: "Soporte IT solicita Martillo.", materialState: "Bueno", state: "Pendiente" },
      { id: 3, code: "PR-006", user: "Leonardo Valladares", startDate: "2026-07-27", product: "Multímetro", description: "Medición de voltajes de fuente.", materialState: "Bueno", state: "Pendiente" }
    ]);
  },

  saveLoans(loans) {
    this.setStorage("loans", loans);
  },

  // 3. DEVOLUCIONES
  getReturns() {
    return this.getStorage("returns", [
      { id: 1, code: "CAA-120", item: "Cautin", student: "Marco Perez", status: "Retrasado" },
      { id: 2, code: "SOL-001", item: "Soldadora", student: "Soporte IT", status: "Revisión" },
      { id: 3, code: "MUL-010", item: "Multímetro", student: "Leonardo Valladares", status: "En tiempo" }
    ]);
  },

  saveReturns(returns) {
    this.setStorage("returns", returns);
  },

  // 4. USUARIOS
  getUsers() {
    return this.getStorage("users", [
      { id: 1, name: "Admin Principal", email: "admin@correo.com", role: "ADMINISTRADOR", section: "ITR", active: true, state: "Activo" },
      { id: 2, name: "Marco Perez", email: "marco@siptec.edu", role: "EMPLEADO", section: "ITR", active: true, state: "Activo" },
      { id: 3, name: "Soporte IT", email: "it@siptec.edu", role: "IT", section: "CFP", active: true, state: "Activo" },
      { id: 4, name: "Melissa Melendez", email: "melissa@gmail.com", role: "EMPLEADO", section: "ITR", active: true, state: "Activo" },
      { id: 5, name: "Leonardo Valladares", email: "20240848@ricaldone.edu.sv", role: "EMPLEADO", section: "CFP", active: true, state: "Activo" }
    ]);
  },

  saveUsers(users) {
    this.setStorage("users", users);
  },

  // 5. REPORTES
  getReports() {
    return this.getStorage("reports", [
      { id: 1, title: "Reporte de préstamos activos", type: "General", author: "Admin Principal", createdAt: "15/07/26, 9:24 p. m.", description: "Resumen de préstamos activos en la plataforma.", content: "Total de préstamos activos: 2 en curso." },
      { id: 2, title: "Herramientas más usadas", type: "General", author: "Admin Principal", createdAt: "15/07/26, 9:24 p. m.", description: "Reporte resumido para seguimiento de inventario.", content: "1. Cautin (42 veces)\n2. Multímetro (38 veces)\n3. Martillo (24 veces)" },
      { id: 3, title: "Daño reportado: Soldadora", type: "Daño", author: "Admin Principal", createdAt: "17/07/26, 4:36 p. m.", description: "La maquinaria tiene fallos eléctricos.", content: "Incidente reportado: Sobrecalentamiento en circuito de alimentación." }
    ]);
  },

  saveReports(reports) {
    this.setStorage("reports", reports);
  },

  // 6. HISTORIAL
  getHistory() {
    return this.getStorage("history", [
      { id: 1, code: "EQP-065", item: "Equipo de sonido", start: "2026-06-13", end: "2026-07-17", user: "Marco Perez", status: "Devuelto" },
      { id: 2, code: "EQP-065", item: "Equipo de sonido", start: "2026-06-12", end: "2026-06-13", user: "Henry", status: "Devuelto" },
      { id: 3, code: "SOL-001", item: "Soldadora", start: "2026-06-10", end: "2026-06-13", user: "Karla", status: "Prestado" },
      { id: 4, code: "MRT-009", item: "Martillo", start: "2026-06-10", end: "2026-06-13", user: "Carlos", status: "Retrasado" },
      { id: 5, code: "CAA-120", item: "Cautin", start: "2026-06-08", end: "2026-06-09", user: "Brandon", status: "Disponible" }
    ]);
  },

  saveHistory(history) {
    this.setStorage("history", history);
  }
};

window.SIPTEC_MOCK_DATA = SIPTEC_MOCK_DATA;
