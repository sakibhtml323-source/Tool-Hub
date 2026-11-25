# Tool Hub

A free client-side toolkit. No backend, database or paid API. Everything works inside the browser.

Live site: https://sakibhtml323-source.github.io/Tool-Hub/

## Tools

- QR Code generator (with PNG download)
- ZIP Compressor (custom ZIP writer, no external library)
- JSON formatter / minifier / validator
- Password checker and secure password generator
- UUID v4 generator
- Base64 encoder / decoder
- URL encoder / decoder
- HTML minifier
- Character, word and sentence counter
- Color converter (HEX / RGB / HSL / color names)
- Image compressor (canvas, JPEG)
- Hash generator (SHA-256 / SHA-384 / SHA-512 / SHA-1 / MD5)
- Text case converter

## Features

- 100% client-side: data never leaves the browser
- No server, database, account, cookies or analytics
- Strict Content-Security-Policy (scripts run only from the site's own files)
- Mobile-friendly responsive design
- SEO: meta tags, Open Graph, Twitter Card, canonical, sitemap, robots, manifest

## Running locally

There is no build step. Serve the folder with any static server:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploying to GitHub Pages

1. Create a repo (named `Tool-Hub`) and push all files to the `main` branch.
2. Go to Settings → Pages → Source: select `main` / root.
3. The site will go live at https://sakibhtml323-source.github.io/Tool-Hub/.

If the repo name is different, in `index.html`, `tools/*.html`, `sitemap.xml`, `robots.txt` and `404.html`, replace the `/Tool-Hub/` part.

## Author

- GitHub: https://github.com/sakibhtml323-source
- Email: sakibsheikho69252@gmail.com

## License

MIT License. See the `LICENSE` file for details.

## Third-party code

- `assets/js/qrcode.min.js`: [QRCode.js](https://github.com/davidshimjs/qrcodejs) (MIT License)

All other code is original to this project.
