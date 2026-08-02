/**
 * TextTools - Core UI Utility Helper Functions
 * Includes Clipboard, File upload/download, share via URL hash, full screen, undo/redo stack.
 */

/**
 * Copies string content to the system clipboard.
 * Supports modern Clipboard API with a fallback.
 */
export async function copyToClipboard(text) {
  if (!text) return false;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (err) {
    console.error('Falha ao copiar:', err);
    return false;
  }
}

/**
 * Downloads a text file safely.
 */
export function downloadTextFile(text, filename = 'texttools_export.txt') {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates a sharable link by encoding the current text in the URL hash.
 * 100% Client-side.
 */
export function generateShareUrl(text) {
  try {
    const origin = window.location.origin + window.location.pathname;
    if (!text) return origin;
    // Compress or simple Base64/UTF-8 encode to avoid length issues
    const utf8Bytes = new TextEncoder().encode(text);
    const binString = Array.from(utf8Bytes, byte => String.fromCharCode(byte)).join('');
    const base64 = btoa(binString);
    return `${origin}#text=${encodeURIComponent(base64)}`;
  } catch (err) {
    console.error('Erro ao gerar URL de compartilhamento:', err);
    return window.location.href;
  }
}

/**
 * Retrieves initial text from sharing URL hash if present.
 */
export function getSharedText() {
  try {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#text=')) {
      const base64Escaped = hash.substring(6);
      const base64 = decodeURIComponent(base64Escaped);
      const binString = atob(base64);
      const bytes = Uint8Array.from(binString, char => char.charCodeAt(0));
      return new TextDecoder().decode(bytes);
    }
  } catch (err) {
    console.error('Erro ao decodificar texto compartilhado:', err);
  }
  return null;
}

/**
 * Manages full screen element toggle.
 */
export function toggleFullScreen(element) {
  if (!document.fullscreenElement) {
    element.requestFullscreen().catch(err => {
      console.error(`Erro ao ativar tela cheia: ${err.message}`);
    });
    return true;
  } else {
    document.exitFullscreen();
    return false;
  }
}


// --- UNDO / REDO MANAGER CLASS ---

export class UndoRedoManager {
  constructor(initialValue = '', maxHistory = 100) {
    this.maxHistory = maxHistory;
    this.undoStack = [];
    this.redoStack = [];
    this.current = initialValue;
  }

  /**
   * Sets new state. If it matches current, ignore.
   */
  pushState(newValue) {
    if (newValue === this.current) return;
    this.undoStack.push(this.current);
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
    this.current = newValue;
    this.redoStack = []; // Reset redo stack when a new action occurs
  }

  /**
   * Pops previous state. Returns null if empty.
   */
  undo() {
    if (this.undoStack.length === 0) return null;
    this.redoStack.push(this.current);
    this.current = this.undoStack.pop();
    return this.current;
  }

  /**
   * Redos state. Returns null if empty.
   */
  redo() {
    if (this.redoStack.length === 0) return null;
    this.undoStack.push(this.current);
    this.current = this.redoStack.pop();
    return this.current;
  }

  reset(newValue = '') {
    this.undoStack = [];
    this.redoStack = [];
    this.current = newValue;
  }
}
