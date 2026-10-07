const CHARACTER_LABELS = new Map([
  [0x0009, 'CHARACTER TABULATION'],
  [0x000A, 'LINE FEED'],
  [0x000D, 'CARRIAGE RETURN'],
  [0x0020, 'SPACE'],
  [0x00A0, 'NO-BREAK SPACE'],
  [0x00AD, 'SOFT HYPHEN'],
  [0x200B, 'ZERO WIDTH SPACE'],
  [0x200C, 'ZERO WIDTH NON-JOINER'],
  [0x200D, 'ZERO WIDTH JOINER'],
  [0x200E, 'LEFT-TO-RIGHT MARK'],
  [0x200F, 'RIGHT-TO-LEFT MARK'],
  [0x202A, 'LEFT-TO-RIGHT EMBEDDING'],
  [0x202B, 'RIGHT-TO-LEFT EMBEDDING'],
  [0x202C, 'POP DIRECTIONAL FORMATTING'],
  [0x202D, 'LEFT-TO-RIGHT OVERRIDE'],
  [0x202E, 'RIGHT-TO-LEFT OVERRIDE'],
  [0x2060, 'WORD JOINER'],
  [0xFEFF, 'ZERO WIDTH NO-BREAK SPACE'],
]);

function classifyCharacter(character, number) {
  const knownLabel = CHARACTER_LABELS.get(number);
  if (knownLabel) return { label: knownLabel, invisible: true };
  if ((number >= 0xFE00 && number <= 0xFE0F) || (number >= 0xE0100 && number <= 0xE01EF)) {
    return { label: 'VARIATION SELECTOR', invisible: true };
  }
  if (/\p{Cc}/u.test(character)) return { label: 'CONTROL CHARACTER', invisible: true };
  if (/\p{Cf}/u.test(character)) return { label: 'FORMAT CHARACTER', invisible: true };
  if (/\p{Zs}/u.test(character)) return { label: 'SPACE SEPARATOR', invisible: true };
  if (/\p{Zl}/u.test(character)) return { label: 'LINE SEPARATOR', invisible: true };
  if (/\p{Zp}/u.test(character)) return { label: 'PARAGRAPH SEPARATOR', invisible: true };
  if (/\p{Cs}/u.test(character)) return { label: 'UNPAIRED SURROGATE', invisible: true };
  return { label: '', invisible: false };
}

function formatCodePoint(character) {
  const hex = character.codePointAt(0).toString(16).toUpperCase();
  return `U+${hex.padStart(4, '0')}`;
}

export function inspectText(text) {
  const codePoints = Array.from(text, (character, index) => {
    const number = character.codePointAt(0);
    return {
      index,
      character,
      value: formatCodePoint(character),
      ...classifyCharacter(character, number),
    };
  });

  return {
    graphemeCount: Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text)).length,
    codePointCount: codePoints.length,
    utf16UnitCount: text.length,
    codePoints,
  };
}
