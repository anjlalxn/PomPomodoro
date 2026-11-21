## Clone inside an empty folder in VsCode and switch to final branch first

```bash
git clone https://github.com/anjlalxn/PomPomodoro.git
cd PomPomodoro
git checkout final-branch
```

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

All the app code is inside `pompom-ionic/src/app/home`.


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

# Final Steps 

Run these in `pompom-ionic`, in this order.

**1. Get the code and install packages if you haven't yet**
```bash
cd pompom-ionic
npm install
npm start
```

**2. Check `ionic.config.json`.** The `"capacitor": {}` line must be removed, or every `ionic cordova` command will refuse to run. It should list only `cordova`.

**3. Add the Android platform** (skip if a `platforms/android` folder already exists)
```bash
ionic cordova platform add android
```

**4. Install the plugins listed in `config.xml`**
```bash
ionic cordova prepare android
ionic cordova plugin ls
```
The list should show these 8 plugins:
- `cordova-plugin-statusbar`
- `cordova-plugin-device`
- `cordova-plugin-splashscreen`
- `cordova-plugin-ionic-webview`
- `cordova-plugin-ionic-keyboard`
- `cordova-plugin-foreground-service`
- `cordova-plugin-local-notification`
- `cordova-plugin-android-permissions`

If any are missing, add them with `ionic cordova plugin add <name> --save`.

**5. Regenerate the icons and splash** (only needed if the committed ones in `resources/android` and `resources/ios` are missing)
```bash
npx cordova-res --skip-config --copy
```
Type **y** if it asks to install. The 10 "Error occurred while copying" warnings for `foreground` and `background` files are harmless.

**6. Build the APK**
```bash
ionic cordova build android
```
This needs Android Studio, the Android SDK and JDK installed.

**7. Get the APK**
The APK is created by the build command in step 6. It is not in the repo. Find it here (inside `pompom-ionic`):
```
platforms/android/app/build/outputs/apk/debug/app-debug.apk
```
If your Cordova version is older, the path may be `platforms/android/build/outputs/apk/debug/android-debug.apk`. The build output prints the exact location at the end.

- Do **not** commit the APK to the repo. Share it by Google Drive
- The debug APK is enough for the school project. `ionic cordova build android --release` makes an **unsigned** APK that phones won't install until it is signed with a keystore.

**8. Push to the repo once everything works**
```bash
git status
git add .
git commit -m "Add icons, splash, plugins and Android build setup"
git pull origin final-branch
git push origin final-branch
```
- Run `git status` first. `platforms/`, `plugins/`, `node_modules/` and any `.apk` file should **not** appear. If they do, don't commit them.
- Make sure the fixed `ionic.config.json` (without `capacitor`), `config.xml` and the `resources/` folder are included.
- If `git pull` shows a conflict, fix it in VS Code before pushing.
