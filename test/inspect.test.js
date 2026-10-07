import assert from 'node:assert/strict';
import test from 'node:test';

import { inspectText } from '../src/inspect.js';

test('treats a supplementary-plane symbol as one code point', () => {
  const report = inspectText('A🙂');

  assert.equal(report.codePointCount, 2);
  assert.equal(report.utf16UnitCount, 3);
  assert.deepEqual(report.codePoints.map(({ value }) => value), ['U+0041', 'U+1F642']);
});

test('labels invisible and whitespace characters', () => {
  const report = inspectText('x\u200B\n');

  assert.deepEqual(report.codePoints.slice(1).map(({ value, label, invisible }) => ({ value, label, invisible })), [
    { value: 'U+200B', label: 'ZERO WIDTH SPACE', invisible: true },
    { value: 'U+000A', label: 'LINE FEED', invisible: true },
  ]);
});

test('counts user-perceived grapheme clusters', () => {
  const report = inspectText('e\u0301👨‍👩‍👧‍👦');

  assert.equal(report.graphemeCount, 2);
  assert.equal(report.codePointCount, 9);
});

test('classifies format, variation, and private-use characters accurately', () => {
  const report = inspectText('\u2066\uFE0F\uE000');

  assert.deepEqual(report.codePoints.map(({ label, invisible }) => ({ label, invisible })), [
    { label: 'FORMAT CHARACTER', invisible: true },
    { label: 'VARIATION SELECTOR', invisible: true },
    { label: '', invisible: false },
  ]);
});

test('distinguishes Unicode separator categories', () => {
  const report = inspectText('\u2009\u2028\u2029');

  assert.deepEqual(report.codePoints.map(({ label }) => label), [
    'SPACE SEPARATOR',
    'LINE SEPARATOR',
    'PARAGRAPH SEPARATOR',
  ]);
});
