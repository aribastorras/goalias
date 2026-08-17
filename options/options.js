const addForm = document.getElementById("addForm");
const aliasInput = document.getElementById("alias");
const urlInput = document.getElementById("url");
const titleInput = document.getElementById("title");
const duplicateWarning = document.getElementById("duplicateWarning");
const duplicateMessage = document.getElementById("duplicateMessage");
const confirmOverwriteButton = document.getElementById("confirmOverwrite");
const cancelOverwriteButton = document.getElementById("cancelOverwrite");
const statusEl = document.getElementById("status");
const searchInput = document.getElementById("search");
const aliasTableBody = document.getElementById("aliasTableBody");
const exportButton = document.getElementById("exportButton");
const importInput = document.getElementById("importInput");
const importCollisionWarning = document.getElementById("importCollisionWarning");
const importCollisionMessage = document.getElementById("importCollisionMessage");
const importConfirmOverwriteButton = document.getElementById("importConfirmOverwrite");
const importSkipButton = document.getElementById("importSkip");

let pendingAddSave = null;
let collisionQueue = [];

async function render(filterText = "") {
  const aliases = await getAllAliases();
  const normalizedFilter = filterText.trim().toLowerCase();

  const entries = Object.values(aliases)
    .filter((entry) => {
      if (!normalizedFilter) return true;
      return (
        entry.alias.toLowerCase().includes(normalizedFilter) ||
        (entry.title || "").toLowerCase().includes(normalizedFilter)
      );
    })
    .sort((a, b) => a.alias.localeCompare(b.alias));

  aliasTableBody.innerHTML = "";
  for (const entry of entries) {
    aliasTableBody.appendChild(createRow(entry));
  }
}

function createRow(entry) {
  const row = document.createElement("tr");

  const aliasCell = document.createElement("td");
  aliasCell.textContent = entry.alias;
  row.appendChild(aliasCell);

  const titleCell = document.createElement("td");
  const titleField = document.createElement("input");
  titleField.type = "text";
  titleField.value = entry.title || "";
  titleCell.appendChild(titleField);
  row.appendChild(titleCell);

  const urlCell = document.createElement("td");
  const urlField = document.createElement("input");
  urlField.type = "url";
  urlField.value = entry.url;
  urlCell.appendChild(urlField);
  row.appendChild(urlCell);

  const actionsCell = document.createElement("td");

  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.textContent = "Save";
  saveButton.addEventListener("click", async () => {
    await saveAlias({ alias: entry.alias, url: urlField.value, title: titleField.value });
    await render(searchInput.value);
  });
  actionsCell.appendChild(saveButton);

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", async () => {
    if (!window.confirm(`Delete alias "${entry.alias}"?`)) return;
    await deleteAlias(normalizeAliasKey(entry.alias));
    await render(searchInput.value);
  });
  actionsCell.appendChild(deleteButton);

  row.appendChild(actionsCell);
  return row;
}

searchInput.addEventListener("input", () => render(searchInput.value));

addForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await tryAddSave(aliasInput.value, urlInput.value, titleInput.value);
});

async function tryAddSave(alias, url, title) {
  const normalizedKey = normalizeAliasKey(alias);
  const existing = await getAlias(normalizedKey);

  if (existing) {
    pendingAddSave = { alias, url, title };
    duplicateMessage.textContent = `"${existing.alias}" already points to ${existing.url}. Overwrite it?`;
    duplicateWarning.style.display = "block";
    return;
  }

  await commitAddSave(alias, url, title);
}

confirmOverwriteButton.addEventListener("click", async () => {
  if (!pendingAddSave) return;
  await commitAddSave(pendingAddSave.alias, pendingAddSave.url, pendingAddSave.title);
  pendingAddSave = null;
});

cancelOverwriteButton.addEventListener("click", () => {
  pendingAddSave = null;
  duplicateWarning.style.display = "none";
});

async function commitAddSave(alias, url, title) {
  await saveAlias({ alias, url, title });
  duplicateWarning.style.display = "none";
  addForm.reset();
  statusEl.textContent = `Saved "${alias}".`;
  setTimeout(() => {
    statusEl.textContent = "";
  }, 3000);
  await render(searchInput.value);
}

exportButton.addEventListener("click", async () => {
  const json = await exportAliases();
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "goalias-export.json";
  link.click();
  URL.revokeObjectURL(url);
});

importInput.addEventListener("change", async () => {
  const file = importInput.files[0];
  if (!file) return;
  const text = await file.text();
  importInput.value = "";

  const { addedKeys, collided } = await importAliases(text);
  statusEl.textContent = `Imported ${addedKeys.length} new alias(es).`;
  setTimeout(() => {
    statusEl.textContent = "";
  }, 3000);

  await render(searchInput.value);

  if (collided.length > 0) {
    collisionQueue = collided;
    processNextCollision();
  }
});

function processNextCollision() {
  if (collisionQueue.length === 0) {
    importCollisionWarning.style.display = "none";
    render(searchInput.value);
    return;
  }
  const item = collisionQueue[0];
  importCollisionMessage.textContent = `"${item.incoming.alias}" already points to ${item.existing.url}. Imported value: ${item.incoming.url}. Overwrite?`;
  importCollisionWarning.style.display = "block";
}

importConfirmOverwriteButton.addEventListener("click", async () => {
  const item = collisionQueue.shift();
  if (item) {
    await saveAlias(item.incoming);
  }
  processNextCollision();
});

importSkipButton.addEventListener("click", () => {
  collisionQueue.shift();
  processNextCollision();
});

async function prefillFromPendingAlias() {
  const pending = await takePendingAliasPrefill();
  if (pending) {
    aliasInput.value = pending;
    urlInput.focus();
  }
}

prefillFromPendingAlias();
render();
