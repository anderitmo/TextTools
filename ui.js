/**
 * TextTools - Core Application Bootstrap & Event Router
 */

import { renderSidebar, updateMetrics, renderHistory, showToast, OPERATIONS, triggerOperation } from './ui.js';
import * as storage from './storage.js';
import * as utils from './utils.js';

// Global application states
window.editorUndoRedo = new utils.UndoRedoManager('');

document.addEventListener('DOMContentLoaded', () => {
  // 1. Storage initialization
  storage.initStorage();

  // 2. Load shared text if referenced via URL hash or load the last active text
  const sharedText = utils.getSharedText();
  const inputEl = document.getElementById('editor-input');
  const outputEl = document.getElementById('editor-output');

  if (sharedText !== null) {
    inputEl.value = sharedText;
    showToast('Texto compartilhado carregado!');
    // Clear hash so page doesn't reload the same text continually on manual change
    window.location.hash = '';
  } else {
    inputEl.value = storage.getLastText();
  }

  // Set initial state for undo-redo
  window.editorUndoRedo.reset(inputEl.value);

  // 3. Perform initial real-time text parsing
  updateMetrics(inputEl.value);

  // 4. Render categories list and user logs
  renderSidebar();
  renderHistory();

  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 5. Initialize active visual theme
  initTheme();

  // 6. Bind UI control listeners
  setupEventListeners(inputEl, outputEl);
});

/**
 * Orchestrates all interactive events, buttons, and inputs.
 */
function setupEventListeners(inputEl, outputEl) {
  // Input keyups / inputs: update metrics in real time, clear Output to preserve flow, & save session
  inputEl.addEventListener('input', () => {
    const text = inputEl.value;
    outputEl.value = ''; // Limpar o output ao editar o input de forma a reiniciar a cadeia
    updateMetrics(text);
    storage.saveLastText(text);
  });

  // Sidebar Filter (Search input)
  const searchInput = document.getElementById('sidebar-search');
  const favFilterBtn = document.getElementById('btn-favorites-only');

  const onFilterChange = () => {
    const query = searchInput.value;
    const favoritesOnly = favFilterBtn.classList.contains('active');
    renderSidebar(query, favoritesOnly);
  };

  if (searchInput) {
    searchInput.addEventListener('input', onFilterChange);
  }

  if (favFilterBtn) {
    favFilterBtn.addEventListener('click', () => {
      favFilterBtn.classList.toggle('active');
      onFilterChange();
    });
  }

  // --- TOPBAR/TOOLBAR CONTROLS ---

  // Clear inputs/outputs
  const btnClear = document.getElementById('tb-clear');
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      inputEl.value = '';
      outputEl.value = '';
      window.editorUndoRedo.reset('');
      storage.saveLastText('');
      updateMetrics('');
      showToast('Área de texto limpa!');
    });
  }

  // Copy Output to clipboard
  const btnCopy = document.getElementById('tb-copy');
  if (btnCopy) {
    btnCopy.addEventListener('click', async () => {
      const textToCopy = outputEl.value || inputEl.value;
      if (!textToCopy) {
        showToast('Nada para copiar!');
        return;
      }
      const success = await utils.copyToClipboard(textToCopy);
      if (success) {
        showToast('Texto copiado com sucesso!');
      } else {
        showToast('Erro ao copiar para a área de transferência.');
      }
    });
  }

  // Paste into Input
  const btnPaste = document.getElementById('tb-paste');
  if (btnPaste) {
    btnPaste.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.readText) {
          const text = await navigator.clipboard.readText();
          inputEl.value = text;
          updateMetrics(text);
          storage.saveLastText(text);
          window.editorUndoRedo.pushState(text);
          showToast('Texto colado no Input!');
        } else {
          showToast('Permissão para colar negada ou não suportada pelo navegador.');
        }
      } catch (err) {
        showToast('Permissão para colar negada.');
      }
    });
  }

  // Undo (Desfazer)
  const btnUndo = document.getElementById('tb-undo');
  if (btnUndo) {
    btnUndo.addEventListener('click', () => {
      const prev = window.editorUndoRedo.undo();
      if (prev !== null) {
        outputEl.value = prev;
        updateMetrics(prev || inputEl.value);
        showToast('Desfeito!');
      } else {
        showToast('Nada para desfazer.');
      }
    });
  }

  // Redo (Refazer)
  const btnRedo = document.getElementById('tb-redo');
  if (btnRedo) {
    btnRedo.addEventListener('click', () => {
      const next = window.editorUndoRedo.redo();
      if (next !== null) {
        outputEl.value = next;
        updateMetrics(next);
        showToast('Reffeito!');
      } else {
        showToast('Nada para refazer.');
      }
    });
  }

  // Upload File (.txt, .docx, .pdf, etc.)
  const btnUpload = document.getElementById('tb-upload');
  const fileInput = document.getElementById('file-loader');
  if (btnUpload && fileInput) {
    btnUpload.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const filename = file.name.toLowerCase();

      const importMode = window.pendingImportMode || 'md';
      window.pendingImportMode = null; // reset

      try {
        if (filename.endsWith('.docx')) {
          const arrayBuffer = await file.arrayBuffer();
          let resultText = '';
          if (importMode === 'txt') {
            showToast('Extraindo texto puro do Word (.docx)...');
            resultText = await utils.convertDocxToTxt(arrayBuffer);
            showToast('Arquivo Word (.docx) convertido para TXT com sucesso!');
          } else {
            showToast('Convertendo Word (.docx) para Markdown...');
            resultText = await utils.convertDocxToMarkdown(arrayBuffer);
            showToast('Arquivo Word (.docx) convertido para Markdown com sucesso!');
          }
          inputEl.value = resultText;
          outputEl.value = ''; // Limpa o output anterior para reiniciar a cadeia de transformações no novo texto do Input
          updateMetrics(resultText);
          storage.saveLastText(resultText);
          window.editorUndoRedo.reset(resultText);
        } else if (filename.endsWith('.pdf')) {
          const arrayBuffer = await file.arrayBuffer();
          let resultText = '';
          if (importMode === 'txt') {
            showToast('Extraindo texto puro do PDF...');
            resultText = await utils.convertPdfToTxt(arrayBuffer);
            showToast('Arquivo PDF convertido para TXT com sucesso!');
          } else {
            showToast('Convertendo PDF para Markdown...');
            resultText = await utils.convertPdfToMarkdown(arrayBuffer);
            showToast('Arquivo PDF convertido para Markdown com sucesso!');
          }
          inputEl.value = resultText;
          outputEl.value = ''; // Limpa o output anterior para reiniciar a cadeia de transformações no novo texto do Input
          updateMetrics(resultText);
          storage.saveLastText(resultText);
          window.editorUndoRedo.reset(resultText);
        } else {
          // Plain text files (.txt, .md, .csv, .json, .sql, etc.)
          const reader = new FileReader();
          reader.onload = (evt) => {
            const text = evt.target.result;
            inputEl.value = text;
            outputEl.value = ''; // Limpa o output anterior para reiniciar a cadeia de transformações
            updateMetrics(text);
            storage.saveLastText(text);
            window.editorUndoRedo.reset(text);
            showToast('Arquivo carregado com sucesso!');
          };
          reader.readAsText(file);
        }
      } catch (err) {
        console.error('Erro ao processar arquivo:', err);
        showToast(`Erro ao processar o arquivo: ${err.message || err}`);
      } finally {
        fileInput.value = ''; // clear
      }
    });
  }

  // Download Output Text File
  const btnDownload = document.getElementById('tb-download');
  if (btnDownload) {
    btnDownload.addEventListener('click', () => {
      const textToSave = outputEl.value || inputEl.value;
      if (!textToSave) {
        showToast('Texto vazio para exportação!');
        return;
      }
      utils.downloadTextFile(textToSave, 'texttools_output.txt');
      showToast('Arquivo baixado!');
    });
  }

  // Preview Markdown Modal
  const btnPreviewMd = document.getElementById('tb-preview-md');
  const modalPreviewMd = document.getElementById('modal-preview-md');
  const btnClosePreviewMd = document.getElementById('btn-close-preview-md');
  const mdRenderedContainer = document.getElementById('markdown-rendered-content');

  const openPreviewModal = () => {
    const textToPreview = outputEl.value || inputEl.value;
    if (!textToPreview) {
      showToast('Nenhum texto/Markdown para visualizar!');
      return;
    }
    if (typeof marked !== 'undefined') {
      mdRenderedContainer.innerHTML = marked.parse(textToPreview);
    } else {
      mdRenderedContainer.innerText = textToPreview;
    }
    modalPreviewMd?.classList.add('visible');
  };

  if (btnPreviewMd) {
    btnPreviewMd.addEventListener('click', openPreviewModal);
  }

  if (btnClosePreviewMd && modalPreviewMd) {
    btnClosePreviewMd.addEventListener('click', () => {
      modalPreviewMd.classList.remove('visible');
    });
  }

  // Export to External Visualizer (visualizador-md-com-post)
  const btnExportExternalMd = document.getElementById('tb-export-external-md');
  const btnOpenExternalFromModal = document.getElementById('btn-open-external-from-modal');

  const handleExternalExport = () => {
    const textToExport = outputEl.value || inputEl.value;
    if (!textToExport) {
      showToast('Nenhum texto para enviar ao visualizador externo!');
      return;
    }
    utils.sendToExternalMdViewer(textToExport);
    showToast('Abrindo visualizador externo de Markdown...');
  };

  if (btnExportExternalMd) {
    btnExportExternalMd.addEventListener('click', handleExternalExport);
  }

  if (btnOpenExternalFromModal) {
    btnOpenExternalFromModal.addEventListener('click', handleExternalExport);
  }

  // Share URL with encoded state
  const btnShare = document.getElementById('tb-share');
  if (btnShare) {
    btnShare.addEventListener('click', () => {
      const textToShare = outputEl.value || inputEl.value;
      if (!textToShare) {
        showToast('Texto vazio para compartilhamento!');
        return;
      }
      const url = utils.generateShareUrl(textToShare);
      utils.copyToClipboard(url).then(success => {
        if (success) {
          showToast('Link de compartilhamento copiado para área de transferência!');
        } else {
          showToast('Erro ao copiar link.');
        }
      });
    });
  }

  // Toggle FullScreen workspace
  const btnFullScreen = document.getElementById('tb-fullscreen');
  const workspaceArea = document.querySelector('.workspace-wrapper');
  if (btnFullScreen && workspaceArea) {
    btnFullScreen.addEventListener('click', () => {
      const isFull = utils.toggleFullScreen(workspaceArea);
      btnFullScreen.classList.toggle('active', isFull);
    });
  }

  // --- MODAL / DIALOG CONTROLS ---

  // History dialog openers/closers
  const btnOpenHistory = document.getElementById('btn-open-history');
  const modalHistory = document.getElementById('modal-history');
  const btnCloseHistory = document.getElementById('btn-close-history');
  const btnClearHistory = document.getElementById('btn-clear-history');

  if (btnOpenHistory && modalHistory) {
    btnOpenHistory.addEventListener('click', () => {
      renderHistory();
      modalHistory.classList.add('visible');
    });
  }

  if (btnCloseHistory && modalHistory) {
    btnCloseHistory.addEventListener('click', () => {
      modalHistory.classList.remove('visible');
    });
  }

  if (btnClearHistory) {
    btnClearHistory.addEventListener('click', () => {
      if (confirm('Tem certeza de que deseja limpar todo o histórico?')) {
        storage.clearHistory();
        renderHistory();
        showToast('Histórico limpo!');
      }
    });
  }

  // Info / About modal
  const btnOpenAbout = document.getElementById('btn-open-about');
  const modalAbout = document.getElementById('modal-about');
  const btnCloseAbout = document.getElementById('btn-close-about');

  if (btnOpenAbout && modalAbout) {
    btnOpenAbout.addEventListener('click', () => {
      modalAbout.classList.add('visible');
    });
  }

  if (btnCloseAbout && modalAbout) {
    btnCloseAbout.addEventListener('click', () => {
      modalAbout.classList.remove('visible');
    });
  }

  // Escape key closes active modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalHistory?.classList.remove('visible');
      modalAbout?.classList.remove('visible');
      document.getElementById('modal-preview-md')?.classList.remove('visible');
    }
  });

  // --- KEYBOARD SHORTCUTS ---
  // Ctrl + Shift + U -> UPPERCASE
  // Ctrl + Shift + L -> lowercase
  // Ctrl + Shift + C -> Capitalizar
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey) {
      const key = e.key.toUpperCase();
      if (key === 'U') {
        e.preventDefault();
        triggerOperation('uppercase');
      } else if (key === 'L') {
        e.preventDefault();
        triggerOperation('lowercase');
      } else if (key === 'C') {
        e.preventDefault();
        triggerOperation('capitalizeWords');
      }
    }
  });
}

/**
 * Initializes visual theme choice
 */
function initTheme() {
  const selectTheme = document.getElementById('theme-select');
  if (!selectTheme) return;

  const currentTheme = storage.getTheme();
  selectTheme.value = currentTheme;
  applyTheme(currentTheme);

  selectTheme.addEventListener('change', (e) => {
    const val = e.target.value;
    storage.saveTheme(val);
    applyTheme(val);
  });
}

/**
 * Applies CSS class rules on HTML root for dark/light themes.
 */
function applyTheme(theme) {
  const root = document.documentElement;
  root.removeAttribute('data-theme');

  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else if (theme === 'light') {
    root.setAttribute('data-theme', 'light');
  } else if (theme === 'auto') {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (systemPrefersDark) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
    }
  }
}

// Watch system theme change dynamically if 'auto' is selected
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (storage.getTheme() === 'auto') {
    applyTheme('auto');
  }
});
