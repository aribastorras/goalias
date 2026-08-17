// Shared alias storage helpers, used by background.js, popup.js, and options.js.
// All aliases live under a single browser.storage.local key: "aliases".

const ALIASES_KEY = "aliases";

function normalizeAliasKey(alias) {
  return alias.trim().toLowerCase();
}

async function getAllAliases() {
  const result = await browser.storage.local.get(ALIASES_KEY);
  return result[ALIASES_KEY] || {};
}

async function getAlias(normalizedKey) {
  const aliases = await getAllAliases();
  return aliases[normalizedKey] || null;
}

async function saveAlias({ alias, url, title }) {
  const normalizedKey = normalizeAliasKey(alias);
  const aliases = await getAllAliases();
  aliases[normalizedKey] = { alias, url, title: title || "" };
  await browser.storage.local.set({ [ALIASES_KEY]: aliases });
}

async function deleteAlias(normalizedKey) {
  const aliases = await getAllAliases();
  delete aliases[normalizedKey];
  await browser.storage.local.set({ [ALIASES_KEY]: aliases });
}

async function exportAliases() {
  const aliases = await getAllAliases();
  return JSON.stringify(Object.values(aliases), null, 2);
}

// Imports non-colliding aliases immediately. Colliding entries are NOT written -
// they are returned so the caller can run the same duplicate-confirmation UI
// used for manual saves before overwriting each one (via saveAlias).
async function importAliases(json) {
  const incoming = JSON.parse(json);
  if (!Array.isArray(incoming)) {
    throw new Error("Import file must contain a JSON array of aliases.");
  }

  const aliases = await getAllAliases();
  const addedKeys = [];
  const collided = [];

  for (const entry of incoming) {
    if (!entry || typeof entry.alias !== "string" || typeof entry.url !== "string") {
      continue;
    }
    const normalizedKey = normalizeAliasKey(entry.alias);
    const existing = aliases[normalizedKey];
    const incomingRecord = { alias: entry.alias, url: entry.url, title: entry.title || "" };

    if (existing) {
      collided.push({ normalizedKey, incoming: incomingRecord, existing });
    } else {
      aliases[normalizedKey] = incomingRecord;
      addedKeys.push(normalizedKey);
    }
  }

  await browser.storage.local.set({ [ALIASES_KEY]: aliases });
  return { addedKeys, collided };
}

// Hand-off used by the "no alias found - add one?" omnibox suggestion: the
// background script stashes the typed text here, and the options page picks
// it up (and clears it) on load to pre-fill the add-alias form.
const PENDING_PREFILL_KEY = "pendingAliasPrefill";

async function setPendingAliasPrefill(text) {
  await browser.storage.local.set({ [PENDING_PREFILL_KEY]: text });
}

async function takePendingAliasPrefill() {
  const result = await browser.storage.local.get(PENDING_PREFILL_KEY);
  const value = result[PENDING_PREFILL_KEY];
  if (value !== undefined) {
    await browser.storage.local.remove(PENDING_PREFILL_KEY);
  }
  return value || null;
}
