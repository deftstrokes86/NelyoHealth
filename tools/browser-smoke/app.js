const statusButton = document.querySelector("#status-button");
const liveStatus = document.querySelector("#live-status");
const form = document.querySelector("#smoke-form");
const input = document.querySelector("#synthetic-name");
const error = document.querySelector("#synthetic-name-error");
const dialog = document.querySelector("#smoke-dialog");
const openDialog = document.querySelector("#open-dialog");
const closeDialog = document.querySelector("#close-dialog");
const runRequest = document.querySelector("#run-request");
const showError = document.querySelector("#show-error");
const asyncState = document.querySelector("#async-state");

function setValidation(message) {
  if (!message) {
    error.hidden = true;
    error.textContent = "";
    input.removeAttribute("aria-invalid");
    input.setAttribute("aria-describedby", "synthetic-name-help");
    return;
  }
  error.hidden = false;
  error.textContent = message;
  input.setAttribute("aria-invalid", "true");
  input.setAttribute("aria-describedby", "synthetic-name-help synthetic-name-error");
  input.focus();
}

statusButton.addEventListener("click", () => {
  liveStatus.textContent = "Synthetic status updated.";
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (input.value.trim().toLowerCase() !== "ready") {
    setValidation('Enter "ready" to pass the synthetic validation check.');
    return;
  }
  setValidation("");
  liveStatus.textContent = "Synthetic form accepted.";
});

openDialog.addEventListener("click", () => {
  dialog.showModal();
  closeDialog.focus();
});

closeDialog.addEventListener("click", () => {
  dialog.close();
  openDialog.focus();
});

runRequest.addEventListener("click", async () => {
  asyncState.dataset.state = "loading";
  asyncState.textContent = "Loading synthetic same-origin response...";
  try {
    const response = await fetch("/api/smoke", { method: "GET", cache: "no-store" });
    if (!response.ok) {
      throw new Error("Synthetic same-origin response failed.");
    }
    const payload = await response.json();
    asyncState.dataset.state = "success";
    asyncState.textContent = payload.message;
  } catch {
    asyncState.dataset.state = "error";
    asyncState.textContent = "Synthetic request failed in a handled way.";
  }
});

showError.addEventListener("click", () => {
  asyncState.dataset.state = "error";
  asyncState.textContent = "Synthetic handled error state.";
});
