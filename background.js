// Address-bar ("aa <alias>") navigation. Requires storage.js to be loaded first.

const MAX_SUGGESTIONS = 8;
// Reserved content prefix for the "add this as a new alias" suggestion, used
// to tell it apart in onInputEntered from raw typed text. A user is not
// realistically going to type this exact sequence as the start of a real
// alias lookup, so it is safe as a marker.
const ADD_ALIAS_PREFIX = "➕ goalias-add: ";

function escapeXml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function matchAliases(aliases, normalizedText) {
  const matches = Object.keys(aliases)
    .filter((key) => key.startsWith(normalizedText))
    .map((key) => aliases[key]);

  matches.sort((a, b) => {
    const aExact = normalizeAliasKey(a.alias) === normalizedText;
    const bExact = normalizeAliasKey(b.alias) === normalizedText;
    if (aExact !== bExact) return aExact ? -1 : 1;
    return normalizeAliasKey(a.alias).localeCompare(normalizeAliasKey(b.alias));
  });

  return matches.slice(0, MAX_SUGGESTIONS);
}

browser.omnibox.setDefaultSuggestion({
  description: "Type an alias to jump straight to its saved page",
});

browser.omnibox.onInputChanged.addListener(async (text, suggest) => {
  const normalizedText = normalizeAliasKey(text);
  if (!normalizedText) {
    suggest([]);
    return;
  }

  const aliases = await getAllAliases();
  const matches = matchAliases(aliases, normalizedText);

  if (matches.length === 0) {
    suggest([
      {
        content: ADD_ALIAS_PREFIX + text,
        description: `Add "${escapeXml(text)}" as a new alias`,
      },
    ]);
    return;
  }

  suggest(
    matches.map((entry) => ({
      content: entry.alias,
      description: `${escapeXml(entry.alias)} → ${escapeXml(entry.url)}`,
    }))
  );
});

browser.omnibox.onInputEntered.addListener(async (text, disposition) => {
  if (text.startsWith(ADD_ALIAS_PREFIX)) {
    const typed = text.slice(ADD_ALIAS_PREFIX.length);
    await setPendingAliasPrefill(typed);
    browser.runtime.openOptionsPage();
    return;
  }

  const normalizedText = normalizeAliasKey(text);
  const match = await getAlias(normalizedText);
  if (!match) {
    // Plain Enter with no exact match and no suggestion selected: no-op,
    // no navigation and no fallback web search.
    return;
  }

  if (disposition === "currentTab") {
    await browser.tabs.update({ url: match.url });
  } else {
    await browser.tabs.create({
      url: match.url,
      active: disposition === "newForegroundTab",
    });
  }
});
