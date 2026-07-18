async function apiFetch(path, options = {}) {
  var useAuth = options.auth !== false;
  var headers = { ...(options.headers || {}) };
  if (useAuth && state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }

  var origins = [API_FALLBACK_ORIGIN];
  var lastError;

  for (var origin of origins) {
    try {
      var response = await fetch(`${origin}${path}`, { ...options, headers });
      var data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Error al conectar con la API.");
      }
      return data;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}
async function loadAllData() {
  try {
    var isIt = state.currentUser?.role === "IT";
    var [items, loans, returns, users, history, reports] = await Promise.all([
      apiFetch("/api/inventory"),
      isIt ? Promise.resolve([]) : apiFetch("/api/loans"),
      isIt ? Promise.resolve([]) : apiFetch("/api/returns"),
      apiFetch("/api/users"),
      isIt ? Promise.resolve([]) : apiFetch("/api/history"),
      apiFetch("/api/reports"),
    ]);

    state.items = items;
    state.loans = loans;
    state.returns = returns;
    state.users = users.map(toUiUser);
    state.history = history;
    state.reports = reports;
    state.currentLoan = null;
    state.apiStatus = "Datos sincronizados con Oracle mediante Java.";
  } catch (error) {
    state.apiStatus = error.message || "Error al cargar datos del servidor.";
  }
}
