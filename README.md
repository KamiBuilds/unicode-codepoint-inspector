# Unicode Codepoint Inspector

A privacy-friendly browser tool for examining Unicode text one code point at a time. It makes zero-width and directional characters visible, distinguishes grapheme clusters from code points and UTF-16 units, and handles supplementary-plane symbols correctly.

Everything runs locally in the browser. There are no uploads, analytics, cookies, external fonts, or runtime dependencies.

## Why this is useful

Text that looks identical can be encoded differently. Hidden formatting marks can also appear in copied source code, usernames, configuration, and documents. This inspector helps with:

- finding zero-width, directional, and whitespace characters;
- comparing precomposed text with combining sequences;
- understanding why emoji may contain several code points;
- checking JavaScript UTF-16 length against user-perceived characters;
- diagnosing suspicious pasted text without sending it to a third party.

It is an inspection aid, not a complete Unicode security scanner. It does not assign every official Unicode character name or determine whether a string is safe.

## Download

Clone the repository on Linux, macOS, or Windows:

```bash
git clone https://github.com/KamiBuilds/unicode-codepoint-inspector.git
cd unicode-codepoint-inspector
```

You can also use GitHub's **Code → Download ZIP** option, but cloning makes future updates available through `git pull`.

## Run locally

Requirements: a modern browser and Python 3 (or any static file server).

Linux/macOS:

```bash
python3 -m http.server 8000
```

Windows PowerShell:

```powershell
py -m http.server 8000
```

Open <http://localhost:8000>, paste text, or select one of the built-in examples.

No build step or package installation is required to run the app.

## Tests and checks

Node.js 20 or newer is required for the automated checks.

```bash
npm install
npm test
npm run check
```

`npm test` covers supplementary-plane symbols, labeled invisible characters, and grapheme-cluster counting. `npm run check` validates both JavaScript modules.

## How counts differ

- **Grapheme clusters** approximate the characters a person perceives, using `Intl.Segmenter`.
- **Code points** are the numeric values represented by the string, such as `U+1F642`. JavaScript strings can also contain an unpaired surrogate, which the inspector labels as malformed rather than calling it a Unicode scalar value.
- **UTF-16 units** are the units counted by JavaScript string `.length`.

For example, a family emoji is one grapheme made from multiple code points, several of which use two UTF-16 units.

## Examples

See [`examples/README.md`](examples/README.md) for copyable strings. The app also includes buttons for a combining mark, an emoji sequence, and a zero-width-space example.

## Privacy and accessibility

The app performs no network requests after its static files load. It uses semantic headings, a labeled text area, native buttons and table markup, keyboard-visible focus states, responsive layouts, live statistics, and reduced-motion preferences.

## License

MIT
