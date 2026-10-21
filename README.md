# Coach Gavy · Workout Sender

A mobile-first app for a coach to build a workout and send it to a member on WhatsApp,
as a formatted message or as an image with real exercise photos.

## Folder

```
public/
├── index.html            the app (HTML, CSS, JS in one file)
├── manifest.webmanifest  PWA install settings
├── sw.js                 service worker (offline + install)
├── _headers              cache and content-type headers
├── icons/                app icons (home screen, splash)
└── ex/                   exercise photos, start and finish (one .jpg per exercise)
wrangler.jsonc            Cloudflare settings
```

## Deploy on Cloudflare (Git)

1. Push this folder to GitHub as the repo root.
2. Build command: leave empty. Deploy command: `npx wrangler deploy`.
3. Every push to `main` redeploys.

## Install as an app (PWA)

- Android (Chrome): tap **Install** in the app header, then confirm.
- iPhone (Safari): tap **Install** in the app header and follow the steps (Share → Add to Home Screen).

Installing needs HTTPS, which Cloudflare provides.

## Notes

- Members, plans and history are saved on the device in use (browser storage).
- Exercise photos come from Free Exercise DB (github.com/yuhonas/free-exercise-db), released under the Unlicense (public domain).
- Custom exercises have no photo, so the shared image shows a simple illustration for them.
- To change the coach name, edit `COACH` and `ROLE` at the top of the script in `index.html`, plus the name in the hero and in `manifest.webmanifest`.
