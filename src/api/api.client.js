async function apiFetch(path, options = {}) {
  const useAuth = options.auth !== false;
  const headers = { ...(options.headers || {}) };
  if (useAuth && state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }

  const origins = [API_FALLBACK_ORIGIN];
  let lastError;

  for (const origin of origins) {
    try {
      const response = await fetch(`${origin}${path}`, { ...options, headers });
      const data = await response.json().catch(() => ({}));
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
    const isIt = state.currentUser?.role === "IT";
    const [items, loans, returns, users, history, reports] = await Promise.all([
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
