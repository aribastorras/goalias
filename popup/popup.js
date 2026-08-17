const form = document.getElementById("aliasForm");
const aliasInput = document.getElementById("alias");
const urlInput = document.getElementById("url");
const titleInput = document.getElementById("title");
const quickCaptureButton = document.getElementById("quickCapture");
const duplicateWarning = document.getElementById("duplicateWarning");
const duplicateMessage = document.getElementById("duplicateMessage");
const confirmOverwriteButton = document.getElementById("confirmOverwrite");
const cancelOverwriteButton = document.getElementById("cancelOverwrite");
const statusEl = document.getElementById("status");

let pendingSave = null;

quickCaptureButton.addEventListener("click", async () => {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;
  urlInput.value = tab.url || "";
  titleInput.value = tab.title || "";
  aliasInput.focus();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  await trySave(aliasInput.value, urlInput.value, titleInput.value);
});

async function trySave(alias, url, title) {
  const normalizedKey = normalizeAliasKey(alias);
  const existing = await getAlias(normalizedKey);

  if (existing) {
    pendingSave = { alias, url, title };
    duplicateMessage.textContent = `"${existing.alias}" already points to ${existing.url}. Overwrite it?`;
    duplicateWarning.style.display = "block";
    return;
  }

  await commitSave(alias, url, title);
}

confirmOverwriteButton.addEventListener("click", async () => {
  if (!pendingSave) return;
  await commitSave(pendingSave.alias, pendingSave.url, pendingSave.title);
  pendingSave = null;
});

cancelOverwriteButton.addEventListener("click", () => {
  pendingSave = null;
  duplicateWarning.style.display = "none";
});

async function commitSave(alias, url, title) {
  await saveAlias({ alias, url, title });
  duplicateWarning.style.display = "none";
  statusEl.textContent = `Saved "${alias}".`;
  setTimeout(() => window.close(), 600);
}
