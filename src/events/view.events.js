function bindViewEvents() {
  applyRoleAccess();
  document.querySelector("#addItem")?.addEventListener("click", () => {
    if (!canManageInventory()) {
      toast("Tu rol no puede agregar inventario.");
      return;
    }
    itemModal.show();
  });

  document.querySelectorAll("[data-edit-item]").forEach((button) => {
    button.addEventListener("click", () => {
      openItemEditMenu(Number(button.dataset.editItem));
    });
  });

  document.querySelectorAll("[data-item-status]").forEach((button) => {
    button.addEventListener("click", async () => {
      var id = Number(button.dataset.itemStatus);
      try {
        var updated = await apiFetch(`/api/inventory/${id}/status`, {
          method: "PATCH",
        });
        var index = state.items.findIndex((item) => item.id === id);
        if (index >= 0) state.items[index] = updated;
        toast("Estado de herramienta actualizado.");
        render();
      } catch (error) {
        toast(error.message || "No se pudo actualizar el estado.");
      }
    });
  });

  document.querySelectorAll("[data-item-remove]").forEach((button) => {
    button.addEventListener("click", async () => {
      var id = Number(button.dataset.itemRemove);
      try {
        await apiFetch(`/api/inventory/${id}`, { method: "DELETE" });
        state.items = state.items.filter((item) => item.id !== id);
        toast("Herramienta eliminada.");
        render();
      } catch (error) {
        toast(error.message || "No se pudo eliminar la herramienta.");
      }
    });
  });

  document.querySelectorAll("[data-select-loan]").forEach((row) => {
    row.addEventListener("click", () => {
      state.currentLoan = state.loans.find(
        (loan) => loan.id === Number(row.dataset.selectLoan),
      );
      render();
    });
  });

  document.querySelectorAll("[data-loan-action]").forEach((button) => {
    button.addEventListener("click", async () => {
      var id = Number(button.dataset.id);
      var action = button.dataset.loanAction;
      try {
        var updated = await apiFetch(`/api/loans/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ state: action }),
        });
        var index = state.loans.findIndex((loan) => loan.id === id);
        if (index >= 0) state.loans[index] = updated;
        state.currentLoan = updated;
        await loadAllData();
        toast(`Préstamo ${updated.state.toLowerCase()}.`);
        render();
      } catch (error) {
        toast(error.message || "No se pudo actualizar el préstamo.");
      }
    });
  });

  document
    .querySelector("#loanRequestForm")
    ?.addEventListener("submit", async (event) => {
      event.preventDefault();
      var form = event.currentTarget;
      var submitBtn = event.submitter;
      submitBtn.disabled = true;

      try {
        await apiFetch("/api/loans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            inventoryId: form.inventoryId.value,
            startDate: form.startDate.value,
            endDate: form.endDate.value,
          }),
        });
        await loadAllData();
        toast("Solicitud de préstamo enviada.");
        render();
      } catch (error) {
        toast(error.message || "No se pudo solicitar el préstamo.");
      } finally {
        submitBtn.disabled = false;
      }
    });

  document.querySelectorAll("[data-return]").forEach((button) => {
    button.addEventListener("click", async () => {
      var id = Number(button.dataset.return);
      try {
        await apiFetch(`/api/returns/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "devuelto" }),
        });
        await loadAllData();
        toast("Devolución registrada.");
        render();
      } catch (error) {
        toast(error.message || "No se pudo registrar la devolucion.");
      }
    });
  });

  document.querySelectorAll("[data-report-return]").forEach((button) => {
    button.addEventListener("click", () => {
      var id = Number(button.dataset.reportReturn);
      var item = state.returns.find((entry) => entry.id === id);
      if (!item) {
        toast("Devolución no encontrada.");
        return;
      }
      document.querySelector("#damageReturnId").value = id;
      document.querySelector("#damageDescription").value = "";
      document.querySelector("#damageItemSummary").textContent =
        `${item.code} - ${item.item} entregado por ${item.student}`;
      damageReportModal.show();
    });
  });

  document.querySelectorAll("[data-edit-user]").forEach((button) => {
    button.addEventListener("click", () => {
      openUserEditMenu(Number(button.dataset.editUser));
    });
  });

  document
    .querySelector("[data-user-add]")
    ?.addEventListener("click", () => userModal.show());

  document.querySelectorAll("[data-report-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.reportTab = button.dataset.reportTab;
      render();
    });
  });

  document.querySelectorAll("[data-view-report]").forEach((button) => {
    button.addEventListener("click", () => {
      openReportViewer(Number(button.dataset.viewReport));
    });
  });

  document.querySelectorAll("[data-delete-report]").forEach((button) => {
    button.addEventListener("click", async () => {
      var id = Number(button.dataset.deleteReport);
      try {
        await apiFetch(`/api/reports/${id}`, { method: "DELETE" });
        state.reports = state.reports.filter((report) => report.id !== id);
        toast("Reporte eliminado.");
        render();
      } catch (error) {
        toast(error.message || "No se pudo eliminar el reporte.");
      }
    });
  });

  document.querySelectorAll("[data-delete-card]").forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".data-card").remove();
      toast("Reporte eliminado.");
    });
  });

  document.querySelectorAll("[data-export-format]").forEach((button) => {
    button.addEventListener("click", () => {
      var report = state.reports.find(
        (item) => item.id === Number(button.dataset.exportReport),
      );
      if (report) exportReport(report, button.dataset.exportFormat);
    });
  });

  document.querySelectorAll("[data-export-history]").forEach((button) => {
    button.addEventListener("click", () => {
      exportHistory(button.dataset.exportHistory);
    });
  });

  document
    .querySelector("[data-save-settings]")
    ?.addEventListener("click", () => toast("Configuración guardada."));
  document
    .querySelector("#themeSwitch")
    ?.addEventListener("change", (event) => applyTheme(event.target.checked));
  document
    .querySelector("[data-logout]")
    ?.addEventListener("click", logoutCurrentUser);
}
