# Third-party notices

TaxCalculator.bd uses these open-source assets. None of the font files are committed to
this repository: they are installed from npm and copied into `dist/` by `npm run build`.

## Fonts (SIL Open Font License 1.1)

- **Plus Jakarta Sans**, via `@fontsource-variable/plus-jakarta-sans`.
- **Noto Sans Bengali**, via `@fontsource-variable/noto-sans-bengali`.

The taka sign (৳) and the Latin wordmark/headline outlines embedded as vector paths in
`src/site/brand.mjs` (logo, favicons and social card) were derived from these two fonts, as
the OFL permits.

OFL 1.1: <https://openfontlicense.org>

## Icons (ISC licence)

The path data in `src/site/icons.mjs` comes from [Lucide](https://lucide.dev).

```
ISC License

Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT).
All other copyright (c) for Lucide are held by Lucide Contributors 2022.

Permission to use, copy, modify, and/or distribute this software for any purpose with or
without fee is hereby granted, provided that the above copyright notice and this permission
notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS
SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE
AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT,
NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE
OF THIS SOFTWARE.
```

## Build tooling (MIT)

[esbuild](https://esbuild.github.io) bundles and minifies CSS/JS. [resvg-js](https://github.com/yisibl/resvg-js)
renders the PNG icons and social-share card from SVG at build time.
