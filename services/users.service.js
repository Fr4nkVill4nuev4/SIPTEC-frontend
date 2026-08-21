/**
 * SIPTEC - Servicio de Usuarios
 * Conecta la UI existente con /api/usuarios.
 */
const usersService = {
  mapFromApi(user) {
    const fullName = `${user.nombreUsuario || ""} ${user.apellidoUsuario || ""}`.trim();
    return {
      id: user.id,
      name: user.name || fullName || "",
      firstName: user.nombreUsuario || "",
      lastName: user.apellidoUsuario || "",
      email: user.correoUsuario || user.email || "",
      role: user.nombreRol || user.role || (user.rol ? `ROL ${user.rol}` : ""),
      section: user.nombreInstitucion || user.section || (user.institucion ? `Institucion ${user.institucion}` : ""),
      institution: user.institucion || null,
      rol: user.rol || null,
      active: user.active !== false,
      raw: user
    };
  },

  mapToApi(user) {
    const parts = String(user.name || "").trim().split(/\s+/).filter(Boolean);
    const firstName = user.nombreUsuario || user.firstName || parts.shift() || "";
    const lastName = user.apellidoUsuario || user.lastName || parts.join(" ") || "";
    const rol = user.rol || user.roleId || user.role || null;
    const institucion = user.institucion || user.institutionId || user.section || user.institution || null;

    return {
      id: user.id || 0,
      nombreUsuario: firstName,
      apellidoUsuario: lastName,
      correoUsuario: user.correoUsuario || user.email || "",
      passwordHash: user.passwordHash || user.password || "",
      rol: rol == null || rol === "" ? null : Number(rol),
      institucion: institucion == null || institucion === "" ? null : Number(institucion)
    };
  },

  mapRole(role) {
    return {
      id: role.id,
      name: role.nombreRol || role.name || `Rol ${role.id}`
    };
  },

  mapInstitution(institution) {
    return {
      id: institution.id,
      name: institution.nombreInstitucion || institution.name || `Institucion ${institution.id}`
    };
  },

  async getAll() {
    const data = await apiService.request(SIPTEC_CONFIG.ENDPOINTS.USERS, { method: "GET" });
    return Array.isArray(data) ? data.map(this.mapFromApi) : [];
  },

  async getRoles() {
    const data = await apiService.request(SIPTEC_CONFIG.ENDPOINTS.ROLES, { method: "GET" });
    return Array.isArray(data) ? data.map(this.mapRole) : [];
  },

  async getInstitutions() {
    const data = await apiService.request(SIPTEC_CONFIG.ENDPOINTS.INSTITUTIONS, { method: "GET" });
    return Array.isArray(data) ? data.map(this.mapInstitution) : [];
  },

  async create(userData) {
    const saved = await apiService.request(SIPTEC_CONFIG.ENDPOINTS.USERS, {
      method: "POST",
      body: JSON.stringify(this.mapToApi(userData))
    });
    return this.mapFromApi(saved || {});
  },

  async update(id, userData) {
    const saved = await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.USERS}/${id}`, {
      method: "PUT",
      body: JSON.stringify(this.mapToApi({ ...userData, id }))
    });
    return this.mapFromApi(saved || {});
  },

  async delete(id) {
    return await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.USERS}/${id}`, { method: "DELETE" });
  },

  async toggleActive(id, active) {
    const current = await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.USERS}/${id}`, { method: "GET" });
    return this.mapFromApi({ ...(current || {}), active });
  }
};

window.usersService = usersService;

