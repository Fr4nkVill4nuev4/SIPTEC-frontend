function hydrateSettings() {
  if (state.currentUser) {
    var inputs = document.querySelectorAll(
      ".settings-box input.form-control",
    );
    if (inputs[0]) inputs[0].value = state.currentUser.firstName;
    if (inputs[1]) inputs[1].value = state.currentUser.lastName;
  }
  syncThemeControl();
}
