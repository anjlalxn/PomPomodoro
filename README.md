# PomPom Pomodoro

A cute Pomodoro study timer built with Ionic and Angular, packaged for Android with Cordova. PomPom studies with you, rests with you, and gets impatient when you disappear.

Last Updated : November 21, 2026 11:51pm (README commit)

## Disclaimer
 
PomPom Pomodoro is a **school project made for educational purposes only**. It is not published on the Google Play Store or any other app store, and it is not sold or used for profit.
 
Pompompurin is a character owned by **Sanrio**. This project is not affiliated with, endorsed by, or sponsored by Sanrio. All rights to the character belong to their respective owners.
 
The artwork used in the app comes from Pinterest. Full credit goes to the original artists and owners of the art. I only changed the characters' facial expressions for this project. If you are an owner of any artwork used here and would like it credited differently or removed, please contact me.
 
 
## Screenshots
 
<p align="center">
  <img src="https://i.postimg.cc/905KhQR0/image.png" alt="PomPom screenshot 1" width="500" />
  <img src="https://i.postimg.cc/wBrnwV97/image.png" alt="PomPom screenshot 2" width="500" />
  <img src="https://i.postimg.cc/jjjrg2PS/image.png" alt="PomPom screenshot 3" width="500" />
  <img src="https://i.postimg.cc/s2b0YgJb/image.png" alt="PomPom screenshot 4" width="500" />
</p>


## Features

- **Pomodoro timer** with pause, resume and reset
- **Short break (5 min) and long break (15 min)**, switchable at any time from the tabs
- **PomPom reacts to what you do**: the picture and message change when you focus, pause, rest, reset, or stay away too long
- **Inactivity notification** if you pause and don't come back in time
- **Background-safe timers**: uses real timestamps, so Android suspending the app doesn't make the clock drift
- **Local notifications with sound** when a session or break is almost done and when it ends
- **Foreground service notification** while a timer runs and the app is in the background
- **Alarm sound** when a timer ends while the app is open
- **To-do list** saved on the device, with a remaining counter and "clear done"
- **PomPom AI tab for study assistance**

## Tech stack

- Ionic + Angular (standalone components, signals)
- Cordova (Android)
- Cordova plugins:
  - `cordova-plugin-local-notification`
  - `cordova-plugin-foreground-service`
  - `cordova-plugin-android-permissions`

## Getting started

### Requirements

- Node.js and npm
- JDK 17
- Android Studio with the Android SDK and platform-tools
- `ANDROID_HOME` and `JAVA_HOME` set, and `platform-tools` on your `PATH`

```bash
npm i -g @ionic/cli cordova
```

### Install

```bash
git clone https://github.com/anjlalxn/PomPomodoro
cd pompom-ionic
npm install
```
### Add your Groq API key
 
The PomPom AI study buddy uses the [Groq API](https://console.groq.com/keys). The key is not included in this repo, so you need your own (it's free to create).
 
1. Copy the example file:
```bash
cp src/app/secrets.example.ts src/app/secrets.ts
```
 
2. Open `src/app/secrets.ts` and paste your key:
```ts
export const GROQ_API_KEY = 'your-groq-api-key-here';
```
 
`secrets.ts` is listed in `.gitignore`, so it won't be committed. Never commit your key or share an APK built with it, because keys inside an app can be extracted.


### Run in the browser

```bash
ionic serve
```

The app opens at `http://localhost:4200`. Cordova plugins don't exist in the browser, so notifications and the foreground service are skipped quietly. Test those on a phone.

### Run on an Android phone

1. On the phone, enable **Developer options** and turn on **USB debugging**.
2. Plug it in and check it appears with `adb devices`.
3. Add the platform and plugins (first time only):

```bash
cordova platform add android
cordova plugin add cordova-plugin-local-notification
cordova plugin add cordova-plugin-foreground-service
cordova plugin add cordova-plugin-android-permissions
```

4. Build and run:

```bash
ionic build
cordova run android --device
```

After any code change, run both commands again.

### Build an APK

```bash
ionic build
cordova build android
```

The APK is at `platforms/android/app/build/outputs/apk/debug/app-debug.apk`.

## Configuration

Timer settings are constants at the top of `src/app/home/home.page.ts`:

| Constant | What it controls | Default |
| --- | --- | --- |
| `FOCUS_SECONDS` | Focus session length | `25` (test value, use `25 * 60` for real use) |
| `SHORT_BREAK_SECONDS` | Short break length | `5 * 60` |
| `LONG_BREAK_SECONDS` | Long break length | `15 * 60` |
| `IMPATIENT_AFTER_SECONDS` | How long you can stay paused before PomPom gets impatient and sends a notification | `10 * 60` |

Rebuild the app after changing them.

## Notifications

| Id | When it fires |
| --- | --- |
| 1 | Focus session complete |
| 2 | Break over |
| 3 | Paused for too long ("PomPom is getting impatient. Where did you go?") |

Notifications are scheduled with the OS when a timer starts, so they still arrive if the app is in the background. They are cancelled when you pause, reset or switch modes.

## Android notes

- **Android 13+:** accept the notification permission prompt on first launch.
- **Late or missing notifications:** set the app's battery usage to **Unrestricted** and allow **Alarms & reminders** in the app settings.
- **Blank screen after build:** check that `www/index.html` exists. If your Angular build outputs to `www/browser`, change `outputPath` in `angular.json`.

## Testing checklist

**Basics**

- Start, pause, resume and reset the focus timer
- Let a focus session finish and a break finish in the app (alarm plays, returns to the Pomodoro tab after a break)
- Switch tabs while a timer is running (the timer is cancelled and the clock resets)
- Add, tick, delete and clear tasks, then reopen the app and check they persist

**Notifications (on a phone)**

- Pause, press Home, wait: the impatient notification arrives
- Pause, then resume, reset or switch tabs quickly: no notification
- Start focus or a break, press Home: the end notification arrives
- First launch on Android 13+: the permission prompt appears

## Credits

This is a 6 member group work developed and quality tested by WMA 4A. 
