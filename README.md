## How to Run

You need [Node.js](https://nodejs.org) (LTS version) installed.

```bash
cd pompom-ionic
npm install
npm start
```

Then open **http://localhost:4200** in your browser.

> If `npm start` doesn't work, use `npx ng serve` instead.
> If `npm install` shows an `ERESOLVE` error, use `npm install --legacy-peer-deps`.

**Do not open `home.page.html` directly in the browser.** It is an Angular template and will only show raw `{{ }}` text. Always run it with the commands above.

## Where to Find the Files

All the app code is inside `pompom-ionic/src/app/`.


## Folder Structure

```
PomPomodoro/
└── pompom-ionic/
    ├── package.json        (list of dependencies and scripts)
    └── src/
        ├── app/
        │   ├── home/       (the main Pomodoro page)
        │   ├── app.component.*
        │   └── app.routes.ts
        ├── assets/
        ├── theme/
        ├── global.scss
        ├── index.html
        └── main.ts
```

## Notes

- `node_modules` is not committed to Git. Run `npm install` once after cloning.
- Keep the terminal running while you edit. The page reloads automatically when you save.
- Don't commit package-lock.json changes unless you added a package (undo with git checkout package-lock.json).