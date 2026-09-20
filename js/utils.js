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

/**
 * Converts Word (.docx) file ArrayBuffer to Markdown using Mammoth.js.
 */
export async function convertDocxToMarkdown(arrayBuffer) {
  if (typeof mammoth === 'undefined') {
    throw new Error('Biblioteca Mammoth.js não foi carregada.');
  }
  const result = await mammoth.convertToMarkdown({ arrayBuffer });
  return result.value || '';
}

/**
 * Converts Word (.docx) file ArrayBuffer to Plain Text using Mammoth.js.
 */
export async function convertDocxToTxt(arrayBuffer) {
  if (typeof mammoth === 'undefined') {
    throw new Error('Biblioteca Mammoth.js não foi carregada.');
  }
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value || '';
}

/**
 * Converts PDF file ArrayBuffer to Markdown using PDF.js.
 */
export async function convertPdfToMarkdown(arrayBuffer) {
  if (typeof pdfjsLib === 'undefined') {
    throw new Error('Biblioteca PDF.js não foi carregada.');
  }
  
  // Set worker source URL
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  let markdown = '';

  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();
    let lastY = null;
    let pageLines = [];
    let currentLine = '';

    for (const item of textContent.items) {
      if (!item.str && item.str !== '') continue;
      
      // If Y coordinate position changes significantly, consider it a new line
      if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
        if (currentLine.trim()) {
          pageLines.push(currentLine.trim());
        }
        currentLine = '';
      }
      currentLine += item.str + ' ';
      lastY = item.transform[5];
    }
    if (currentLine.trim()) {
      pageLines.push(currentLine.trim());
    }

    const pageContent = pageLines.join('\n');
    if (pdfDoc.numPages > 1) {
      markdown += `## Página ${pageNum}\n\n${pageContent}\n\n`;
    } else {
      markdown += `${pageContent}\n\n`;
    }
  }

  return markdown.trim();
}

/**
 * Converts PDF file ArrayBuffer to Plain Text using PDF.js.
 */
export async function convertPdfToTxt(arrayBuffer) {
  if (typeof pdfjsLib === 'undefined') {
    throw new Error('Biblioteca PDF.js não foi carregada.');
  }
  
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  let text = '';

  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();
    let pageText = textContent.items.map(item => item.str).join(' ');
    text += pageText + '\n\n';
  }

  return text.trim();
}

/**
 * Sends Markdown content to the external visualizer at https://anderitmo.github.io/visualizador-md-com-post/
 */
export function sendToExternalMdViewer(markdownText) {
  if (!markdownText) return false;

  // Encode text as Base64 to safely pass via URL or form
  const utf8Bytes = new TextEncoder().encode(markdownText);
  const binString = Array.from(utf8Bytes, byte => String.fromCharCode(byte)).join('');
  const base64 = btoa(binString);

  const targetUrl = `https://anderitmo.github.io/visualizador-md-com-post/#content=${encodeURIComponent(base64)}`;
  window.open(targetUrl, '_blank');
  return true;
}

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
