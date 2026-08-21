/**
 * SIPTEC - Servicio de Rol-Permiso
 * Tabla intermedia ROL_PERMISO (clave compuesta IDROL + IDPERMISO).
 * Consume el endpoint /api/rolPermiso de la API Spring Boot.
 */
const rolePermissionsService = {
  mapFromApi(item) {
    return {
      roleId: item.rol || item.idRol || item.roleId || null,
      permissionId: item.permiso || item.idPermiso || item.permissionId || null,
      roleName: item.nombreRol || "",
      permissionName: item.nombrePermiso || "",
      raw: item
    };
  },

  mapToApi(item) {
    return {
      rol: Number(item.rol || item.idRol || item.roleId) || null,
      permiso: Number(item.permiso || item.idPermiso || item.permissionId) || null
    };
  },

  async getAll() {
    const data = await apiService.request(SIPTEC_CONFIG.ENDPOINTS.ROLE_PERMISSIONS, { method: "GET" });
    return Array.isArray(data) ? data.map(this.mapFromApi) : [];
  },

  async getByRole(roleId) {
    const all = await this.getAll();
    return all.filter(item => Number(item.roleId) === Number(roleId));
  },

  async assign(roleId, permissionId) {
    const saved = await apiService.request(SIPTEC_CONFIG.ENDPOINTS.ROLE_PERMISSIONS, {
      method: "POST",
      body: JSON.stringify(this.mapToApi({ roleId, permissionId }))
    });
    return this.mapFromApi(saved || {});
  },

  async revoke(roleId, permissionId) {
    return await apiService.request(`${SIPTEC_CONFIG.ENDPOINTS.ROLE_PERMISSIONS}/${roleId}/${permissionId}`, {
      method: "DELETE"
    });
  }
};

window.rolePermissionsService = rolePermissionsService;
