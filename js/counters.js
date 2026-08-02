/**
 * TextTools - Real-time counters and text analysis engine
 */

/**
 * Calculates all text metrics for the input.
 * @param {string} text - The input text.
 * @returns {object} An object containing counters, reading time, speaking time, and metadata.
 */
export function analyzeText(text) {
  if (text === undefined || text === null) {
    text = '';
  }

  // Basic stats
  const totalChars = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;

  // Word count: split by spaces and filter empty strings
  const wordsArray = text.trim() ? text.trim().split(/\s+/) : [];
  const words = wordsArray.length;

  // Lines
  const lines = text ? text.split(/\r?\n/).length : 0;

  // Sentences: Count punctuation boundaries followed by spaces or end of text.
  const sentencesArray = text ? text.split(/[.!?]+(?:\s+|$)/).filter(s => s.trim().length > 0) : [];
  const sentences = sentencesArray.length;

  // Paragraphs: Separated by one or more blank lines
  const paragraphsArray = text ? text.split(/\n\s*\n/).filter(p => p.trim().length > 0) : [];
  const paragraphs = paragraphsArray.length;

  // Detailed Character Categories
  const letters = (text.match(/\p{L}/gu) || []).length;
  const digits = (text.match(/\d/g) || []).length;
  const spaces = (text.match(/\s/g) || []).length;

  // Symbols: any character that is not a letter, digit, space, or newline
  const symbols = totalChars - letters - digits - spaces;

  // Estimated reading/speaking speed calculations
  // Average reading speed: 200 words per minute
  // Average speaking speed: 130 words per minute
  const readingTimeMin = words / 200;
  const speakingTimeMin = words / 130;

  // Convert fractional minutes to a human-readable string (e.g. "1 min 15 s" or "5s")
  const formatTime = (minutes) => {
    if (minutes === 0) return '0 s';
    const totalSeconds = Math.round(minutes * 60);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    if (mins > 0) {
      return `${mins} min ${secs} s`;
    }
    return `${secs} s`;
  };

  // AI Tokens Estimation (rough estimate: ~1 token per 4 characters or ~0.75 words)
  const estimatedTokens = Math.round(totalChars / 4);

  // SEO Metrics check
  // Google Title tag length recommendation: 50-60 chars
  // Google Meta Description length recommendation: 150-160 chars
  const titleStatus = checkSEOLimits(totalChars, 50, 60);
  const metaStatus = checkSEOLimits(totalChars, 150, 160);

  return {
    counters: {
      characters: totalChars,
      charactersNoSpaces: charsNoSpaces,
      words: words,
      lines: lines,
      sentences: sentences,
      paragraphs: paragraphs
    },
    statistics: {
      letters: letters,
      digits: digits,
      spaces: spaces,
      symbols: symbols,
      readingTime: formatTime(readingTimeMin),
      speakingTime: formatTime(speakingTimeMin),
      tokens: estimatedTokens
    },
    seo: {
      title: titleStatus,
      meta: metaStatus
    }
  };
}

/**
 * Checks if length is within SEO limits.
 * Status can be: 'ideal', 'warning' (attention), 'exceeded'
 */
function checkSEOLimits(length, min, max) {
  if (length === 0) {
    return { status: 'empty', label: 'Vazio', percent: 0, class: 'info' };
  }

  const percent = Math.min((length / max) * 100, 100);

  if (length < min) {
    return {
      status: 'warning',
      label: 'Atenção (Curto)',
      percent: percent,
      class: 'warning'
    };
  } else if (length >= min && length <= max) {
    return {
      status: 'ideal',
      label: 'Ideal',
      percent: percent,
      class: 'ideal'
    };
  } else {
    return {
      status: 'exceeded',
      label: 'Excedido',
      percent: 100,
      class: 'exceeded'
    };
  }
}
