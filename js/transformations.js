/**
 * TextTools - Core text transformation functions
 * Implements all string manipulation operations.
 */

// --- 1. CONVERSÃO DE TEXTO (Case Conversions) ---

/**
 * Converts text to lowercase.
 */
export function lowercase(text) {
  return text.toLowerCase();
}

/**
 * Converts text to UPPERCASE.
 */
export function uppercase(text) {
  return text.toUpperCase();
}

/**
 * Capitalizes the first letter of each word.
 */
export function capitalizeWords(text) {
  return text.replace(/\b\p{L}/gu, char => char.toUpperCase());
}

/**
 * Converts text to Sentence Case (first letter of sentences capitalized).
 */
export function sentenceCase(text) {
  if (!text) return '';
  // Capitalizes first letter, and any letter after a punctuation (. ! ?) followed by whitespace
  let result = text.toLowerCase();
  result = result.replace(/(^\s*|\.[\s\n]*|![\s\n]*|\?[\s\n]*)(\p{L})/gu, (match, separator, char) => {
    return separator + char.toUpperCase();
  });
  return result;
}

/**
 * Inverts the casing of each character (InVeRsO).
 */
export function toggleCase(text) {
  return text
    .split('')
    .map(char => {
      const upper = char.toUpperCase();
      const lower = char.toLowerCase();
      return char === upper ? lower : upper;
    })
    .join('');
}

/**
 * Capitalizes only the first letter of the entire text.
 */
export function capitalizeFirst(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Lowercases only the first letter of the entire text.
 */
export function lowercaseFirst(text) {
  if (!text) return '';
  return text.charAt(0).toLowerCase() + text.slice(1);
}


// --- 2. LIMPEZA (Cleaning) ---

/**
 * Removes duplicate spaces (consecutive spaces/tabs, reducing them to a single space).
 */
export function removeDuplicateSpaces(text) {
  return text.replace(/[ \t]+/g, ' ').trim();
}

/**
 * Removes all completely empty or whitespace-only lines.
 */
export function removeEmptyLines(text) {
  return text
    .split(/\r?\n/)
    .filter(line => line.trim() !== '')
    .join('\n');
}

/**
 * Removes tab characters.
 */
export function removeTabs(text) {
  return text.replace(/\t/g, '');
}

/**
 * Removes accents and diacritics from text (e.g. "café" -> "cafe").
 */
export function removeAccents(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Removes emojis from text.
 */
export function removeEmojis(text) {
  // Broad emoji/symbol regex
  return text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F0F5}\u{1F004}\u{1F100}-\u{1F1AD}\u{1F200}-\u{1F2FF}\u{2600}-\u{26FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2000}-\u{3300}]/gu, '');
}

/**
 * Removes special characters (keeping only letters, numbers, spaces, and line breaks).
 */
export function removeSpecialChars(text) {
  // Retains unicode letters, numbers, spaces, tabs, and newlines
  return text.replace(/[^\p{L}\p{N}\s]/gu, '');
}

/**
 * Removes all numeric digits from text.
 */
export function removeNumbers(text) {
  return text.replace(/\d/g, '');
}

/**
 * Removes all letters (Unicode-aware) from text.
 */
export function removeLetters(text) {
  return text.replace(/\p{L}/gu, '');
}

/**
 * Removes common punctuation characters from text.
 */
export function removePunctuation(text) {
  // Retains word characters and whitespace, removes punctuation
  return text.replace(/[\p{P}\p{S}]/gu, '');
}


// --- 3. ORGANIZAÇÃO (Organization) ---

/**
 * Sorts lines from A to Z (case insensitive, respects accents if possible).
 */
export function sortLinesAsc(text) {
  return text
    .split(/\r?\n/)
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
    .join('\n');
}

/**
 * Sorts lines from Z to A (case insensitive).
 */
export function sortLinesDesc(text) {
  return text
    .split(/\r?\n/)
    .sort((a, b) => b.localeCompare(a, undefined, { sensitivity: 'base' }))
    .join('\n');
}

/**
 * Removes duplicate lines, preserving their original order.
 */
export function removeDuplicateLines(text) {
  const lines = text.split(/\r?\n/);
  const uniqueLines = [...new Set(lines)];
  return uniqueLines.join('\n');
}

/**
 * Shuffles the lines of text randomly.
 */
export function shuffleLines(text) {
  const lines = text.split(/\r?\n/);
  for (let i = lines.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lines[i], lines[j]] = [lines[j], lines[i]];
  }
  return lines.join('\n');
}

/**
 * Reverses the order of lines in the text.
 */
export function reverseLines(text) {
  return text.split(/\r?\n/).reverse().join('\n');
}

/**
 * Prefixes each line with its line number (e.g. "1. First line").
 */
export function numberLines(text) {
  if (!text) return '';
  return text
    .split(/\r?\n/)
    .map((line, idx) => `${idx + 1}. ${line}`)
    .join('\n');
}

/**
 * Removes line numbers and common delimiters (like "1. ", "1 - ", "[1] ") from the start of each line.
 */
export function removeLineNumbers(text) {
  return text
    .split(/\r?\n/)
    .map(line => line.replace(/^\s*(?:\[?\d+\]?|[a-zA-Z\d]+)\s*[\.\-\:\)\s]\s*/, ''))
    .join('\n');
}


// --- 4. CONVERSÕES (Conversions) ---

/**
 * Converts lines into a comma-separated list.
 */
export function linesToCommas(text) {
  return text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line !== '')
    .join(', ');
}

/**
 * Converts lines into a pipe (|) separated list.
 */
export function linesToPipes(text) {
  return text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line !== '')
    .join(' | ');
}

/**
 * Converts lines into a semicolon (;) separated list.
 */
export function linesToSemicolons(text) {
  return text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line !== '')
    .join('; ');
}

/**
 * Converts a comma-separated list into lines.
 */
export function commasToLines(text) {
  return text
    .split(',')
    .map(part => part.trim())
    .join('\n');
}

/**
 * Joins all lines into a single line separated by a single space.
 */
export function joinLines(text) {
  return text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line !== '')
    .join(' ');
}

/**
 * Splits the text by a custom delimiter and joins elements with a newline.
 */
export function splitByDelimiter(text, delimiter = ',') {
  if (!delimiter) return text;
  // Escapes regex special characters
  const escapedDelim = delimiter.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(escapedDelim, 'g');
  return text
    .split(regex)
    .map(part => part.trim())
    .join('\n');
}


// --- 5. FERRAMENTAS PARA DESENVOLVEDORES (Developer Tools) ---

/**
 * Encodes text to Base64 (supporting Unicode characters via UTF-8 encoder).
 */
export function base64Encode(text) {
  try {
    const bytes = new TextEncoder().encode(text);
    const binString = Array.from(bytes, byte => String.fromCharCode(byte)).join('');
    return btoa(binString);
  } catch (err) {
    return 'Erro ao codificar para Base64: ' + err.message;
  }
}

/**
 * Decodes text from Base64 (supporting Unicode characters safely).
 */
export function base64Decode(text) {
  try {
    const binString = atob(text.trim());
    const bytes = Uint8Array.from(binString, char => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch (err) {
    return 'Erro ao decodificar Base64: Formato inválido.';
  }
}

/**
 * URL-encodes the text.
 */
export function urlEncode(text) {
  return encodeURIComponent(text);
}

/**
 * URL-decodes the text.
 */
export function urlDecode(text) {
  try {
    return decodeURIComponent(text);
  } catch (err) {
    return 'Erro ao decodificar URL: Formato inválido.';
  }
}

/**
 * Escapes HTML characters (e.g. < to &lt;).
 */
export function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Unescapes HTML entities back to characters.
 */
export function unescapeHtml(text) {
  const doc = new DOMParser().parseFromString(text, 'text/html');
  return doc.documentElement.textContent || text;
}

/**
 * Formats (pretty prints) JSON text.
 */
export function jsonPretty(text) {
  try {
    if (!text.trim()) return '';
    const parsed = JSON.parse(text);
    return JSON.stringify(parsed, null, 2);
  } catch (err) {
    return 'Erro ao formatar JSON: ' + err.message;
  }
}

/**
 * Minifies JSON text (removes all whitespace and formatting).
 */
export function jsonMinify(text) {
  try {
    if (!text.trim()) return '';
    const parsed = JSON.parse(text);
    return JSON.stringify(parsed);
  } catch (err) {
    return 'Erro ao minificar JSON: ' + err.message;
  }
}


// --- 6. FERRAMENTAS MARKDOWN ---

/**
 * Prepend a Markdown list bullet (-) to each line.
 */
export function generateMarkdownList(text) {
  if (!text) return '';
  return text
    .split(/\r?\n/)
    .map(line => line.trim() ? `- ${line.trim()}` : '')
    .join('\n');
}

/**
 * Prepend a Markdown checklist bullet (- [ ]) to each line.
 */
export function generateMarkdownChecklist(text) {
  if (!text) return '';
  return text
    .split(/\r?\n/)
    .map(line => line.trim() ? `- [ ] ${line.trim()}` : '')
    .join('\n');
}

/**
 * Removes common Markdown syntax from the text.
 */
export function removeMarkdown(text) {
  let output = text;
  try {
    output = output
      // Remove HTML tags
      .replace(/<[^>]*>/g, '')
      // Remove headers (## Header)
      .replace(/^#{1,6}\s+/gm, '')
      // Remove bold and italics
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      // Remove inline code
      .replace(/`([^`]+)`/g, '$1')
      // Remove blockquotes
      .replace(/^\s*>\s+/gm, '')
      // Remove horizontal rules
      .replace(/^[-\*_]{3,}\s*$/gm, '')
      // Remove images
      .replace(/!\[([^\]]*)\]\([^\)]*\)/g, '$1')
      // Remove links
      .replace(/\[([^\]]*)\]\([^\)]*\)/g, '$1')
      // Remove bullet lists
      .replace(/^\s*[\-\*\+]\s+/gm, '')
      // Remove numbered lists
      .replace(/^\s*\d+\.\s+/gm, '');
  } catch (e) {
    // Fail-safe
  }
  return output;
}


// --- 7. FERRAMENTAS SQL ---

/**
 * Converts a list of lines into a SQL IN clause statement: IN ('A','B','C').
 */
export function convertToSqlIn(text) {
  const items = text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line !== '');
  if (items.length === 0) return "IN ()";
  const formatted = items.map(item => `'${item.replace(/'/g, "''")}'`).join(',');
  return `IN (${formatted})`;
}

/**
 * Wraps each non-empty line in single quotes.
 */
export function addQuotes(text, quoteType = "'") {
  return text
    .split(/\r?\n/)
    .map(line => line ? `${quoteType}${line}${quoteType}` : '')
    .join('\n');
}

/**
 * Appends a comma to each line.
 */
export function addCommas(text) {
  return text
    .split(/\r?\n/)
    .map(line => line ? `${line},` : '')
    .join('\n');
}

/**
 * Wraps each line in parentheses.
 */
export function addParentheses(text) {
  return text
    .split(/\r?\n/)
    .map(line => line ? `(${line})` : '')
    .join('\n');
}

/**
 * Prepends a prefix to each line.
 */
export function addPrefix(text, prefix = '') {
  return text
    .split(/\r?\n/)
    .map(line => line ? `${prefix}${line}` : '')
    .join('\n');
}

/**
 * Appends a suffix to each line.
 */
export function addSuffix(text, suffix = '') {
  return text
    .split(/\r?\n/)
    .map(line => line ? `${line}${suffix}` : '')
    .join('\n');
}


// --- 8. FERRAMENTAS CSV ---

/**
 * Converts standard list of lines to a CSV quote-enclosed single line list.
 * e.g.
 * A
 * B
 * C
 * to
 * "A","B","C"
 */
export function listToCSV(text) {
  const lines = text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line !== '');
  return lines.map(line => `"${line.replace(/"/g, '""')}"`).join(',');
}

/**
 * Converts CSV-style single line "A","B","C" back to:
 * A
 * B
 * C
 */
export function csvToList(text) {
  if (!text.trim()) return '';
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        // Toggle quotes state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());

  return result.filter(item => item !== '').join('\n');
}


// --- 9. FERRAMENTAS PARA IA ---

/**
 * Removes all line breaks, replacing them with a single space.
 */
export function removeLineBreaks(text) {
  return text.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Compacts a prompt for AI by removing double spaces, empty lines, and trimming.
 */
export function compactPrompt(text) {
  return text
    .split(/\r?\n/)
    .map(line => line.replace(/\s+/g, ' ').trim())
    .filter(line => line !== '')
    .join('\n');
}

/**
 * Cleans spaces: replaces all whitespace sequences (including tabs/newlines) with single spaces, trims.
 */
export function cleanSpaces(text) {
  return text.replace(/\s+/g, ' ').trim();
}


// --- 10. FERRAMENTAS ACADÊMICAS ---

/**
 * Normalizes academic references by sorting them, taking care to ignore citation prefixes like "[1] ", "1. ", or "Smith (2020)".
 * If references are numbered, it sorts them. If they are alphabetical, it sorts by author.
 */
export function sortReferences(text) {
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');

  const extractSortKey = (line) => {
    // Remove leading brackets/numbers and spaces
    let key = line.replace(/^\s*(?:\[?\d+\]?|\d+[\.\-\:\)\s])\s*/, '');
    // Remove common starting quotes/styles
    key = key.replace(/^["'“‘]/, '');
    return key.toLowerCase().trim();
  };

  return lines
    .sort((a, b) => extractSortKey(a).localeCompare(extractSortKey(b), undefined, { sensitivity: 'base' }))
    .join('\n\n');
}

/**
 * Removes duplicate academic references based on content similarity (ignoring starting citation prefixes).
 */
export function removeDuplicateReferences(text) {
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
  const seen = new Set();
  const uniqueLines = [];

  const extractNormKey = (line) => {
    // Strip numbers, punctuation, spaces, accents, and casing to compare actual content
    let key = line.replace(/^\s*(?:\[?\d+\]?|\d+[\.\-\:\)\s])\s*/, '');
    key = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    key = key.replace(/[^\p{L}\p{N}]/gu, '');
    return key.toLowerCase().trim();
  };

  for (const line of lines) {
    const norm = extractNormKey(line);
    if (!norm) continue;
    if (!seen.has(norm)) {
      seen.add(norm);
      uniqueLines.push(line);
    }
  }

  return uniqueLines.join('\n\n');
}

/**
 * Normalizes spacing for academic text. Removes double spaces, ensures space after punctuation (. , ; : ? !),
 * but not before. Standardizes paragraph endings.
 */
export function normalizeAcademicSpacing(text) {
  if (!text) return '';
  let output = text;
  // Ensure exactly one space after punctuation marks followed by a letter/number
  output = output.replace(/([.,;:?!])([^\s\d.,;:?!])/g, '$1 $2');
  // Ensure no space before punctuation marks
  output = output.replace(/\s+([.,;:?!])/g, '$1');
  // Remove consecutive spaces
  output = output.replace(/[ \t]+/g, ' ');
  // Normalize consecutive line breaks to two (paragraphs) or one (lines)
  output = output.split(/\r?\n/)
    .map(line => line.trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');
  return output.trim();
}
