async function render() {
  ensureAllowedView();
  syncActiveNav();
  applyRoleAccess();
  root.innerHTML = skeletonTemplate();
  root.innerHTML = await loadPage(state.view);
  hydrateView();
  bindViewEvents();
}
async function loadPage(view) {
  try {
    var response = await fetch(`pages/${view}.html`, { cache: "no-store" });
    if (!response.ok) throw new Error(`No se encontro pages/${view}.html`);
    return await response.text();
  } catch {
    return `<div class="alert alert-warning">No se encontro la pagina solicitada.</div>`;
  }
}
function hydrateView() {
  var hydrators = {
    dashboard: hydrateDashboard,
    inventory: hydrateInventory,
    loans: hydrateLoans,
    returns: hydrateReturns,
    users: hydrateUsers,
    reports: hydrateReports,
    history: hydrateHistory,
    settings: hydrateSettings,
  };
  hydrators[state.view]?.();
}
