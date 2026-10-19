# Raptor Gym · Workout Sender

A simple app for Coach Gavy to build a workout and send it to a member on WhatsApp.

## Folder

```
raptor-workout/
├── public/
│   ├── index.html    the whole app (HTML, CSS, JS in one file)
│   └── _headers      cache and security headers
├── wrangler.jsonc    Cloudflare settings
├── .gitignore
└── README.md
```

## Deploy on Cloudflare (Git)

1. Push this folder to GitHub as the repo root.
2. In Cloudflare: Workers & Pages → Create → Import a repository.
3. Build command: leave empty. Deploy command: `npx wrangler deploy`.
4. Deploy. Every push to `main` redeploys.

## Run locally

Open `public/index.html` in a browser, or run `npx wrangler dev` and open the local address.

## Notes

- Members, plans and history are saved in the browser of the device in use (localStorage).
  Clearing browser data removes them.
- "Share image" opens the phone share sheet (choose WhatsApp). On a laptop it downloads a PNG.
- Exercise videos are YouTube search links unless the coach adds their own link to a custom exercise.
