async function restoreSession() {
  const saved = sessionStorage.getItem(SESSION_KEY);
  if (!saved) return;

  try {
    const session = JSON.parse(saved);
    state.token = session.token;
    state.currentUser = session.user;

    await apiFetch("/api/auth/me");
    loginScreen.classList.add("d-none");
    appShell.classList.remove("d-none");
    updateUserChip();
    ensureAllowedView();
    syncActiveNav();
    applyRoleAccess();
    await loadAllData();
    render();
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    state.token = null;
    state.currentUser = null;
  }
}
async function logoutCurrentUser() {
  try {
    await apiFetch("/api/auth/logout", { method: "POST" });
  } catch {
    /* ignore logout errors */
  }
  sessionStorage.removeItem(SESSION_KEY);
  state.token = null;
  state.currentUser = null;
  document.querySelector("#loginForm").reset();
  appShell.classList.add("d-none");
  loginScreen.classList.remove("d-none");
}
