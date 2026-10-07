import { inspectText } from './inspect.js';

const input = document.querySelector('#text-input');
const tbody = document.querySelector('#codepoint-rows');
const empty = document.querySelector('#empty-state');
const stats = {
  graphemes: document.querySelector('#grapheme-count'),
  codePoints: document.querySelector('#codepoint-count'),
  units: document.querySelector('#unit-count'),
  hidden: document.querySelector('#hidden-count'),
};

function visibleCharacter(entry) {
  if (entry.label) return `⟦${entry.label}⟧`;
  return entry.character;
}

function render() {
  const report = inspectText(input.value);
  stats.graphemes.textContent = report.graphemeCount;
  stats.codePoints.textContent = report.codePointCount;
  stats.units.textContent = report.utf16UnitCount;
  stats.hidden.textContent = report.codePoints.filter(({ invisible }) => invisible).length;
  tbody.replaceChildren();
  empty.hidden = report.codePoints.length > 0;

  for (const entry of report.codePoints) {
    const row = document.createElement('tr');
    if (entry.invisible) row.classList.add('is-invisible');

    const values = [entry.index + 1, visibleCharacter(entry), entry.value, entry.label || 'Visible character'];
    for (const value of values) {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.append(cell);
    }
    tbody.append(row);
  }
}

for (const button of document.querySelectorAll('[data-sample]')) {
  button.addEventListener('click', () => {
    input.value = button.dataset.sample;
    render();
    input.focus();
  });
}

input.addEventListener('input', render);
render();
