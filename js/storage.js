/**
 * TextTools - LocalStorage Management for Favorites and History
 * 100% Client-side. No servers or remote logging.
 */

const HISTORY_KEY = 'texttools_history';
const FAVORITES_KEY = 'texttools_favorites';
const THEME_KEY = 'texttools_theme';
const LAST_TEXT_KEY = 'texttools_last_text';
const MAX_HISTORY_LEN = 50;

/**
 * Initializes localStorage items if they do not exist.
 */
export function initStorage() {
  if (!localStorage.getItem(HISTORY_KEY)) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(FAVORITES_KEY)) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([]));
  }
}

/**
 * Saves the active theme setting.
 * @param {'light'|'dark'|'auto'} theme
 */
export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

/**
 * Gets the stored theme setting (defaults to 'auto').
 */
export function getTheme() {
  return localStorage.getItem(THEME_KEY) || 'auto';
}

/**
 * Saves the last working text so user doesn't lose progress on page refresh.
 */
export function saveLastText(text) {
  localStorage.setItem(LAST_TEXT_KEY, text);
}

/**
 * Gets the last working text.
 */
export function getLastText() {
  return localStorage.getItem(LAST_TEXT_KEY) || '';
}

/**
 * Adds an operation entry to the history.
 * Each entry records: timestamp, operations name/description, preview of text.
 * @param {string} operationName - Name of operation performed (e.g. "Uppercase").
 * @param {string} textBefore - Text before operation.
 * @param {string} textAfter - Text after operation.
 */
export function addHistoryEntry(operationName, textBefore, textAfter) {
  try {
    const history = getHistory();
    const entry = {
      id: Date.now() + Math.random().toString(36).substr(2, 5),
      timestamp: new Date().toISOString(),
      operation: operationName,
      textBefore: textBefore.length > 500 ? textBefore.substring(0, 500) + '...' : textBefore,
      textAfter: textAfter.length > 500 ? textAfter.substring(0, 500) + '...' : textAfter,
      fullTextAfter: textAfter // save complete result to restore from history
    };

    history.unshift(entry);

    // Limit history length
    if (history.length > MAX_HISTORY_LEN) {
      history.pop();
    }

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (err) {
    console.error('Erro ao salvar histórico:', err);
  }
}

/**
 * Gets all history items.
 */
export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch (err) {
    return [];
  }
}

/**
 * Clears entire operations history.
 */
export function clearHistory() {
  localStorage.setItem(HISTORY_KEY, JSON.stringify([]));
}

/**
 * Toggles an operation name as favorite.
 * @param {string} operationId - Unique string identifier of the operation.
 * @returns {boolean} True if favorited, false if unfavorited.
 */
export function toggleFavorite(operationId) {
  try {
    const favorites = getFavorites();
    const index = favorites.indexOf(operationId);
    let favorited = false;

    if (index === -1) {
      favorites.push(operationId);
      favorited = true;
    } else {
      favorites.splice(index, 1);
    }

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return favorited;
  } catch (err) {
    console.error('Erro ao favoritar:', err);
    return false;
  }
}

/**
 * Gets list of favorited operation IDs.
 */
export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch (err) {
    return [];
  }
}

/**
 * Checks if a specific operation is favorited.
 */
export function isFavorite(operationId) {
  return getFavorites().includes(operationId);
}
