function stat(label, value, icon, color) {
  return `
    <article class="stat-card">
      <div class="stat-icon" style="background:${color}"><i class="bi ${icon}"></i></div>
      <div><strong>${value}</strong><span>${label}</span></div>
    </article>
  `;
}
function skeletonTemplate() {
  return `
    <div class="skeleton-page">
      <div class="skeleton-line skeleton-title"></div>
      <div class="skeleton-grid">
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
      </div>
      <div class="skeleton-wide"></div>
      <div class="skeleton-wide short"></div>
    </div>
  `;
}
function statusClass(status) {
  var normalized = status.toLowerCase();
  var type =
    normalized.includes("disponible") ||
    normalized.includes("activo") ||
    normalized.includes("devuelto") ||
    normalized.includes("tiempo") ||
    normalized.includes("aprobado")
      ? "available"
      : normalized.includes("pendiente") ||
          normalized.includes("prestado") ||
          normalized.includes("revision") ||
          normalized.includes("retrasado")
        ? "borrowed"
        : "damage";
  return `status ${type}`;
}
function filterRows(rows) {
  if (!state.query) return rows;
  return rows.filter((row) =>
    Object.values(row).join(" ").toLowerCase().includes(state.query),
  );
}
function formatDateTime(value) {
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es-GT", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value.replace(" ", "T")));
}
function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
