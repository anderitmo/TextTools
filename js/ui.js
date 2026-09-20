import * as transform from './transformations.js';
import { analyzeText } from './counters.js';
import * as storage from './storage.js';
import * as utils from './utils.js';

// Configuration of all operations supported by the app
export const OPERATIONS = [
  // --- CONVERSÃO DE TEXTO ---
  {
    id: 'lowercase',
    category: 'Conversão',
    name: 'Converter para lowercase',
    description: 'Transforma todas as letras do texto em minúsculas.',
    icon: 'case-lower',
    fn: transform.lowercase
  },
  {
    id: 'uppercase',
    category: 'Conversão',
    name: 'Converter para UPPERCASE',
    description: 'Transforma todas as letras do texto em maiúsculas.',
    icon: 'case-upper',
    fn: transform.uppercase
  },
  {
    id: 'capitalizeWords',
    category: 'Conversão',
    name: 'Capitalizar Palavras',
    description: 'Coloca a primeira letra de cada palavra em maiúscula.',
    icon: 'case-sensitive',
    fn: transform.capitalizeWords
  },
  {
    id: 'sentenceCase',
    category: 'Conversão',
    name: 'Sentence Case',
    description: 'Deixa a primeira letra de cada frase em maiúscula e o resto em minúscula.',
    icon: 'type',
    fn: transform.sentenceCase
  },
  {
    id: 'toggleCase',
    category: 'Conversão',
    name: 'InVeRsO',
    description: 'Inverte o padrão de maiúsculas/minúsculas de cada caractere.',
    icon: 'refresh-cw',
    fn: transform.toggleCase
  },
  {
    id: 'capitalizeFirst',
    category: 'Conversão',
    name: 'Primeira letra maiúscula',
    description: 'Coloca apenas a primeiríssima letra do texto em maiúscula.',
    icon: 'arrow-up-to-line',
    fn: transform.capitalizeFirst
  },
  {
    id: 'lowercaseFirst',
    category: 'Conversão',
    name: 'Primeira letra minúscula',
    description: 'Coloca apenas a primeiríssima letra do texto em minúscula.',
    icon: 'arrow-down-to-line',
    fn: transform.lowercaseFirst
  },

  // --- LIMPEZA ---
  {
    id: 'removeDuplicateSpaces',
    category: 'Limpeza',
    name: 'Remover espaços duplicados',
    description: 'Substitui espaços e tabulações múltiplas por um único espaço.',
    icon: 'sparkles',
    fn: transform.removeDuplicateSpaces
  },
  {
    id: 'removeEmptyLines',
    category: 'Limpeza',
    name: 'Remover linhas vazias',
    description: 'Exclui todas as linhas que estão totalmente vazias.',
    icon: 'wrap-text',
    fn: transform.removeEmptyLines
  },
  {
    id: 'removeTabs',
    category: 'Limpeza',
    name: 'Remover tabulações',
    description: 'Apaga todos os caracteres de tabulação (Tab).',
    icon: 'indent-decrease',
    fn: transform.removeTabs
  },
  {
    id: 'removeAccents',
    category: 'Limpeza',
    name: 'Remover acentos',
    description: 'Normaliza o texto removendo acentos e diacríticos.',
    icon: 'languages',
    fn: transform.removeAccents
  },
  {
    id: 'removeEmojis',
    category: 'Limpeza',
    name: 'Remover emojis',
    description: 'Filtra e apaga emoticons e emojis.',
    icon: 'smile',
    fn: transform.removeEmojis
  },
  {
    id: 'removeSpecialChars',
    category: 'Limpeza',
    name: 'Remover caracteres especiais',
    description: 'Mantém apenas letras, números e espaços básicos.',
    icon: 'slash-by-subtraction',
    fn: transform.removeSpecialChars
  },
  {
    id: 'removeNumbers',
    category: 'Limpeza',
    name: 'Remover números',
    description: 'Apaga todos os dígitos numéricos (0-9).',
    icon: 'binary',
    fn: transform.removeNumbers
  },
  {
    id: 'removeLetters',
    category: 'Limpeza',
    name: 'Remover letras',
    description: 'Apaga qualquer letra do alfabeto do texto.',
    icon: 'whole-word',
    fn: transform.removeLetters
  },
  {
    id: 'removePunctuation',
    category: 'Limpeza',
    name: 'Remover pontuação',
    description: 'Remove símbolos de pontuação e caracteres de sintaxe.',
    icon: 'help-circle',
    fn: transform.removePunctuation
  },

  // --- ORGANIZAÇÃO ---
  {
    id: 'sortLinesAsc',
    category: 'Organização',
    name: 'Ordenar A → Z',
    description: 'Ordena as linhas do texto em ordem alfabética ascendente.',
    icon: 'sort-asc',
    fn: transform.sortLinesAsc
  },
  {
    id: 'sortLinesDesc',
    category: 'Organização',
    name: 'Ordenar Z → A',
    description: 'Ordena as linhas do texto em ordem alfabética descendente.',
    icon: 'sort-desc',
    fn: transform.sortLinesDesc
  },
  {
    id: 'removeDuplicateLines',
    category: 'Organização',
    name: 'Remover linhas duplicadas',
    description: 'Remove linhas repetidas, mantendo apenas a primeira ocorrência.',
    icon: 'copy-minus',
    fn: transform.removeDuplicateLines
  },
  {
    id: 'shuffleLines',
    category: 'Organização',
    name: 'Embaralhar linhas',
    description: 'Randomiza a ordem de todas as linhas.',
    icon: 'shuffle',
    fn: transform.shuffleLines
  },
  {
    id: 'reverseLines',
    category: 'Organização',
    name: 'Inverter ordem das linhas',
    description: 'Inverte a sequência de linhas do texto (de trás para frente).',
    icon: 'move-vertical',
    fn: transform.reverseLines
  },
  {
    id: 'numberLines',
    category: 'Organização',
    name: 'Numerar linhas',
    description: 'Adiciona número sequencial no início de cada linha.',
    icon: 'list-ordered',
    fn: transform.numberLines
  },
  {
    id: 'removeLineNumbers',
    category: 'Organização',
    name: 'Remover numeração existente',
    description: 'Remove números sequenciais do início de cada linha.',
    icon: 'list-todo',
    fn: transform.removeLineNumbers
  },

  // --- CONVERSÕES ---
  {
    id: 'linesToCommas',
    category: 'Conversões',
    name: 'Linhas → Vírgulas',
    description: 'Junta as linhas separando-as por uma vírgula.',
    icon: 'arrow-right-left',
    fn: transform.linesToCommas
  },
  {
    id: 'linesToPipes',
    category: 'Conversões',
    name: 'Linhas → Pipe',
    description: 'Junta as linhas separando-as por uma barra vertical (|).',
    icon: 'arrow-right-left',
    fn: transform.linesToPipes
  },
  {
    id: 'linesToSemicolons',
    category: 'Conversões',
    name: 'Linhas → Ponto e vírgula',
    description: 'Junta as linhas separando-as por ponto e vírgula (;).',
    icon: 'arrow-right-left',
    fn: transform.linesToSemicolons
  },
  {
    id: 'commasToLines',
    category: 'Conversões',
    name: 'Vírgulas → Linhas',
    description: 'Separa itens separados por vírgula em linhas individuais.',
    icon: 'arrow-down-up',
    fn: transform.commasToLines
  },
  {
    id: 'joinLines',
    category: 'Conversões',
    name: 'Juntar linhas',
    description: 'Junta todas as linhas em uma única linha contínua.',
    icon: 'link',
    fn: transform.joinLines
  },
  {
    id: 'splitByDelimiter',
    category: 'Conversões',
    name: 'Dividir texto por delimitador',
    description: 'Divide o texto por um caractere delimitador personalizado para criar linhas.',
    icon: 'scissors',
    hasPrompt: true,
    promptMsg: 'Digite o delimitador a ser usado para a divisão:',
    defaultPromptVal: ',',
    fn: (text, delim) => transform.splitByDelimiter(text, delim)
  },

  // --- DESENVOLVEDORES ---
  {
    id: 'base64Encode',
    category: 'Desenvolvedor',
    name: 'Base64 Encode',
    description: 'Codifica o texto no formato padrão Base64 (compatível com Unicode).',
    icon: 'lock',
    fn: transform.base64Encode
  },
  {
    id: 'base64Decode',
    category: 'Desenvolvedor',
    name: 'Base64 Decode',
    description: 'Decodifica uma string Base64 de volta para texto legível.',
    icon: 'unlock',
    fn: transform.base64Decode
  },
  {
    id: 'urlEncode',
    category: 'Desenvolvedor',
    name: 'URL Encode',
    description: 'Substitui caracteres especiais do texto para uso seguro em URLs.',
    icon: 'globe',
    fn: transform.urlEncode
  },
  {
    id: 'urlDecode',
    category: 'Desenvolvedor',
    name: 'URL Decode',
    description: 'Decodifica uma URL codificada de volta para texto normal.',
    icon: 'map',
    fn: transform.urlDecode
  },
  {
    id: 'escapeHtml',
    category: 'Desenvolvedor',
    name: 'Escape HTML',
    description: 'Escapa tags HTML transformando-as em entidades seguras.',
    icon: 'code',
    fn: transform.escapeHtml
  },
  {
    id: 'unescapeHtml',
    category: 'Desenvolvedor',
    name: 'Unescape HTML',
    description: 'Restaura entidades HTML de volta para código ou texto legível.',
    icon: 'terminal',
    fn: transform.unescapeHtml
  },
  {
    id: 'jsonPretty',
    category: 'Desenvolvedor',
    name: 'JSON Pretty Print',
    description: 'Formata uma string JSON crua com espaçamento legível e identação.',
    icon: 'file-json-2',
    fn: transform.jsonPretty
  },
  {
    id: 'jsonMinify',
    category: 'Desenvolvedor',
    name: 'JSON Minify',
    description: 'Remove espaços extras, comentários e quebras de linha de um JSON.',
    icon: 'file-json',
    fn: transform.jsonMinify
  },

  // --- MARKDOWN ---
  {
    id: 'importDocxToMarkdown',
    category: 'Markdown',
    name: 'Converter Word (.docx) → MD',
    description: 'Abre o seletor de arquivo para converter um documento Word (.docx) para Markdown.',
    icon: 'file-type-2',
    fn: () => {
      document.getElementById('file-loader')?.click();
      return document.getElementById('editor-output')?.value || document.getElementById('editor-input')?.value || '';
    }
  },
  {
    id: 'importPdfToMarkdown',
    category: 'Markdown',
    name: 'Converter PDF → MD',
    description: 'Abre o seletor de arquivo para extrair e converter o texto de um PDF para Markdown.',
    icon: 'file-text',
    fn: () => {
      document.getElementById('file-loader')?.click();
      return document.getElementById('editor-output')?.value || document.getElementById('editor-input')?.value || '';
    }
  },
  {
    id: 'generateMarkdownList',
    category: 'Markdown',
    name: 'Gerar lista',
    description: 'Insere marcadores de lista não ordenada (-) em todas as linhas.',
    icon: 'list',
    fn: transform.generateMarkdownList
  },
  {
    id: 'generateMarkdownChecklist',
    category: 'Markdown',
    name: 'Gerar checklist',
    description: 'Transforma linhas em uma lista de tarefas interativa (- [ ]).',
    icon: 'list-checks',
    fn: transform.generateMarkdownChecklist
  },
  {
    id: 'removeMarkdown',
    category: 'Markdown',
    name: 'Remover Markdown',
    description: 'Limpa formatações como títulos, negritos, links e listas, preservando o texto puro.',
    icon: 'file-text',
    fn: transform.removeMarkdown
  },

  // --- SQL ---
  {
    id: 'convertToSqlIn',
    category: 'SQL',
    name: "Converter para IN ('A','B','C')",
    description: 'Transforma uma lista de linhas em uma instrução SQL IN bem formatada.',
    icon: 'database',
    fn: transform.convertToSqlIn
  },
  {
    id: 'addQuotes',
    category: 'SQL',
    name: 'Adicionar aspas',
    description: 'Envolve cada linha do texto entre aspas simples.',
    icon: 'quote',
    hasPrompt: true,
    promptMsg: 'Digite o caractere de aspas desejado (\' ou "):',
    defaultPromptVal: "'",
    fn: (text, q) => transform.addQuotes(text, q)
  },
  {
    id: 'addCommas',
    category: 'SQL',
    name: 'Adicionar vírgulas',
    description: 'Adiciona uma vírgula no final de cada linha.',
    icon: 'plus',
    fn: transform.addCommas
  },
  {
    id: 'addParentheses',
    category: 'SQL',
    name: 'Adicionar parênteses',
    description: 'Envolve o texto de cada linha individual entre parênteses ().',
    icon: 'parentheses',
    fn: transform.addParentheses
  },
  {
    id: 'addPrefix',
    category: 'SQL',
    name: 'Adicionar prefixos',
    description: 'Insere um prefixo personalizado no começo de cada linha.',
    icon: 'chevron-right',
    hasPrompt: true,
    promptMsg: 'Digite o prefixo que deseja adicionar:',
    defaultPromptVal: '',
    fn: (text, prefix) => transform.addPrefix(text, prefix)
  },
  {
    id: 'addSuffix',
    category: 'SQL',
    name: 'Adicionar sufixos',
    description: 'Insere um sufixo personalizado no fim de cada linha.',
    icon: 'chevron-left',
    hasPrompt: true,
    promptMsg: 'Digite o sufixo que deseja adicionar:',
    defaultPromptVal: '',
    fn: (text, suffix) => transform.addSuffix(text, suffix)
  },

  // --- CSV ---
  {
    id: 'listToCSV',
    category: 'CSV',
    name: 'Converter Lista para CSV',
    description: 'Agrupa as linhas em uma única sequência de strings cercadas por aspas e separadas por vírgula.',
    icon: 'table-properties',
    fn: transform.listToCSV
  },
  {
    id: 'csvToList',
    category: 'CSV',
    name: 'Converter CSV para Lista',
    description: 'Quebra uma linha formatada em CSV de volta em linhas individuais correspondentes.',
    icon: 'table-2',
    fn: transform.csvToList
  },

  // --- SEO ---
  {
    id: 'seoTitleCounter',
    category: 'SEO',
    name: 'Contador de Título (Title)',
    description: 'Avalia o tamanho do texto atual e mostra se ele está no padrão aceitável do Google Title (50-60 caracteres).',
    icon: 'search-code',
    fn: (text) => text // directly updates visual state
  },
  {
    id: 'seoMetaCounter',
    category: 'SEO',
    name: 'Contador de Meta Description',
    description: 'Mede o texto atual para verificar conformidade com o limite ideal de Meta Description (150-160 caracteres).',
    icon: 'search-check',
    fn: (text) => text
  },

  // --- IA ---
  {
    id: 'removeLineBreaks',
    category: 'IA',
    name: 'Remover quebras de linha',
    description: 'Remove todas as quebras de linha e concatena em um parágrafo único, ideal para tradutores e IAs.',
    icon: 'bot',
    fn: transform.removeLineBreaks
  },
  {
    id: 'compactPrompt',
    category: 'IA',
    name: 'Compactar prompt',
    description: 'Encolhe o prompt limpando excessos de espaço e linhas vazias redundantes.',
    icon: 'brain-circuit',
    fn: transform.compactPrompt
  },
  {
    id: 'cleanSpacesAI',
    category: 'IA',
    name: 'Limpeza de espaços',
    description: 'Reorganiza e unifica múltiplos espaços ou quebras para economizar tokens.',
    icon: 'wand-2',
    fn: transform.cleanSpaces
  },

  // --- ACADÊMICO ---
  {
    id: 'sortReferences',
    category: 'Acadêmico',
    name: 'Ordenar referências',
    description: 'Organiza em ordem alfabética referências bibliográficas do tipo ABNT ou APA.',
    icon: 'book-open',
    fn: transform.sortReferences
  },
  {
    id: 'removeDuplicateReferences',
    category: 'Acadêmico',
    name: 'Remover referências duplicadas',
    description: 'Identifica e remove referências bibliográficas idênticas ou muito semelhantes.',
    icon: 'library',
    fn: transform.removeDuplicateReferences
  },
  {
    id: 'normalizeAcademicSpacing',
    category: 'Acadêmico',
    name: 'Normalizar espaçamentos',
    description: 'Ajusta espaços em branco e ajusta a pontuação em conformidade com normas científicas.',
    icon: 'pen-tool',
    fn: transform.normalizeAcademicSpacing
  }
];

/**
 * Renders the operations sidebar based on standard categories, favorites, and search query.
 */
export function renderSidebar(query = '', favoritesOnly = false) {
  const sidebarContainer = document.getElementById('sidebar-tools');
  if (!sidebarContainer) return;

  sidebarContainer.innerHTML = '';
  const favorites = storage.getFavorites();

  // Categorize or filter operations
  let filtered = OPERATIONS.filter(op => {
    const matchesQuery = op.name.toLowerCase().includes(query.toLowerCase()) ||
                         op.description.toLowerCase().includes(query.toLowerCase()) ||
                         op.category.toLowerCase().includes(query.toLowerCase());
    const matchesFavorite = !favoritesOnly || favorites.includes(op.id);
    return matchesQuery && matchesFavorite;
  });

  if (filtered.length === 0) {
    sidebarContainer.innerHTML = '<p class="no-results">Nenhuma ferramenta encontrada.</p>';
    return;
  }

  // Group by Category
  const groups = {};
  filtered.forEach(op => {
    if (!groups[op.category]) {
      groups[op.category] = [];
    }
    groups[op.category].push(op);
  });

  // Render HTML structure
  Object.keys(groups).forEach(category => {
    const section = document.createElement('div');
    section.className = 'sidebar-category-group';

    const header = document.createElement('h3');
    header.className = 'category-header';
    header.textContent = category;
    section.appendChild(header);

    const list = document.createElement('ul');
    list.className = 'category-tools-list';

    groups[category].forEach(op => {
      const isFav = favorites.includes(op.id);
      const li = document.createElement('li');
      li.className = 'tool-item-li';
      li.dataset.id = op.id;

      li.innerHTML = `
        <button class="tool-btn" title="${op.description}">
          <span class="tool-icon"><i data-lucide="${op.icon}"></i></span>
          <span class="tool-name">${op.name}</span>
        </button>
        <button class="fav-star-btn" aria-label="Favoritar ferramenta" title="${isFav ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}">
          <i data-lucide="${isFav ? 'star' : 'star'}" class="${isFav ? 'star-filled' : 'star-empty'}"></i>
        </button>
      `;

      // Event listener for Tool triggers
      li.querySelector('.tool-btn').addEventListener('click', () => {
        triggerOperation(op.id);
      });

      // Event listener for favorite stars
      li.querySelector('.fav-star-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        const favorited = storage.toggleFavorite(op.id);
        // Re-render sidebar to preserve accurate state
        const currentSearchVal = document.getElementById('sidebar-search')?.value || '';
        const favoritesFilterActive = document.getElementById('btn-favorites-only')?.classList.contains('active') || false;
        renderSidebar(currentSearchVal, favoritesFilterActive);
      });

      list.appendChild(li);
    });

    section.appendChild(list);
    sidebarContainer.appendChild(section);
  });

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

/**
 * Triggers the string operation on the current editor content.
 */
export function triggerOperation(operationId) {
  const op = OPERATIONS.find(o => o.id === operationId);
  if (!op) return;

  const inputEl = document.getElementById('editor-input');
  const outputEl = document.getElementById('editor-output');
  if (!inputEl || !outputEl) return;

  // Encadeamento: se o output já tiver algum resultado, usamos ele como base para a próxima operação.
  // Caso contrário, usamos o conteúdo do input.
  const textBefore = outputEl.value || inputEl.value;
  let textAfter = '';

  if (op.hasPrompt) {
    const userVal = prompt(op.promptMsg, op.defaultPromptVal);
    if (userVal === null) return; // cancelled
    textAfter = op.fn(textBefore, userVal);
  } else {
    textAfter = op.fn(textBefore);
  }

  // Update output value
  outputEl.value = textAfter;

  // Update metrics for the current result
  updateMetrics(textAfter);

  // Push changes to undo stack of App state
  if (window.editorUndoRedo) {
    window.editorUndoRedo.pushState(textAfter);
  }

  // Add entry to history
  storage.addHistoryEntry(op.name, textBefore, textAfter);
  renderHistory();

  // Copy clean text automatically for IA tools if requested
  if (op.category === 'IA' || op.id === 'cleanSpacesAI') {
    utils.copyToClipboard(textAfter);
    showToast('Resultado gerado e copiado automaticamente para a área de transferência!');
  } else {
    showToast(`Operação "${op.name}" aplicada com sucesso!`);
  }
}

/**
 * Renders the operations history modal/panel content from LocalStorage.
 */
export function renderHistory() {
  const historyContainer = document.getElementById('history-list');
  if (!historyContainer) return;

  const history = storage.getHistory();
  if (history.length === 0) {
    historyContainer.innerHTML = '<p class="no-history">O histórico está vazio.</p>';
    return;
  }

  historyContainer.innerHTML = '';
  history.forEach(entry => {
    const div = document.createElement('div');
    div.className = 'history-item';

    const time = new Date(entry.timestamp).toLocaleTimeString();

    div.innerHTML = `
      <div class="history-meta">
        <span class="history-op-name">${entry.operation}</span>
        <span class="history-time">${time}</span>
      </div>
      <div class="history-preview">
        <div><strong>De:</strong> <span class="text-preview-code">${escapeTextPreview(entry.textBefore)}</span></div>
        <div><strong>Para:</strong> <span class="text-preview-code">${escapeTextPreview(entry.textAfter)}</span></div>
      </div>
      <button class="history-restore-btn" title="Restaurar este resultado no Output">
        <i data-lucide="rotate-ccw" style="width:12px;height:12px;display:inline-block;vertical-align:middle;margin-right:4px;"></i> Restaurar no Output
      </button>
    `;

    div.querySelector('.history-restore-btn').addEventListener('click', () => {
      const outputEl = document.getElementById('editor-output');
      if (outputEl) {
        outputEl.value = entry.fullTextAfter;
        if (window.editorUndoRedo) {
          window.editorUndoRedo.pushState(entry.fullTextAfter);
        }
        showToast('Texto restaurado no Output!');
      }
    });

    historyContainer.appendChild(div);
  });

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function escapeTextPreview(text) {
  if (!text) return '(vazio)';
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  return escaped.length > 80 ? escaped.substring(0, 80) + '...' : escaped;
}

/**
 * Triggers a temporarily visible visual toast message.
 */
export function showToast(msg) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = msg;
  container.appendChild(toast);

  // Trigger fade-in
  setTimeout(() => {
    toast.classList.add('visible');
  }, 10);

  // Trigger fade-out & destroy
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => {
      container.removeChild(toast);
    }, 300);
  }, 3000);
}

/**
 * Updates real-time counts, statistics metrics, reading speed, and SEO limits check.
 */
export function updateMetrics(text) {
  const analysis = analyzeText(text);

  // Bind primary text indicators
  bindMetricText('count-chars', analysis.counters.characters);
  bindMetricText('count-chars-nospace', analysis.counters.charactersNoSpaces);
  bindMetricText('count-words', analysis.counters.words);
  bindMetricText('count-lines', analysis.counters.lines);
  bindMetricText('count-sentences', analysis.counters.sentences);
  bindMetricText('count-paragraphs', analysis.counters.paragraphs);

  // Bind extra statistics
  bindMetricText('stat-reading-time', analysis.statistics.readingTime);
  bindMetricText('stat-speaking-time', analysis.statistics.speakingTime);
  bindMetricText('stat-letters', analysis.statistics.letters);
  bindMetricText('stat-digits', analysis.statistics.digits);
  bindMetricText('stat-spaces', analysis.statistics.spaces);
  bindMetricText('stat-symbols', analysis.statistics.symbols);
  bindMetricText('stat-tokens', analysis.statistics.tokens);

  // Bind SEO bars
  updateSEOProgressBar('seo-title-bar', 'seo-title-status', analysis.seo.title);
  updateSEOProgressBar('seo-meta-bar', 'seo-meta-status', analysis.seo.meta);
}

function bindMetricText(elementId, value) {
  const el = document.getElementById(elementId);
  if (el) el.textContent = value;
}

function updateSEOProgressBar(barId, statusId, seoData) {
  const bar = document.getElementById(barId);
  const statusEl = document.getElementById(statusId);
  if (!bar || !statusEl) return;

  // Clear previous SEO indicator classes
  bar.className = 'seo-progress-inner';
  bar.classList.add(seoData.class);
  bar.style.width = `${seoData.percent}%`;

  statusEl.textContent = seoData.label;
  statusEl.className = `seo-status-text ${seoData.class}`;
}
