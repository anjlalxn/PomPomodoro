# PomPom Pomodoro
This is a non-commercial educational project. Pompompurin and all related
characters are trademarks and copyrights of Sanrio Co., Ltd. This project is
not affiliated with or endorsed by Sanrio. The character images were sourced from Pinterest and edited by the author (facial expressions). The original artists are unknown, and all rights to the original artwork belong to their respective owners. No ownership is claimed over these images.


A discipline-based Pomodoro timer built with plain HTML, CSS, and JavaScript.

- 25-minute focus session
- 5 or 15-minute break
- Pause, resume, and reset
- PomPom reacts to how you use the timer

## Clone (needs email for collaboration)

```bash
git clone https://github.com/anjlalxn/PomPomodoro.git
cd PomPomodoro
```

Or...Click **Code → Download ZIP** on the repo page and extract it.

## Run

No install or build step is needed.

1. Open the project folder.
2. Double-click `main.html` to open it in your browser.

Or, with VS Code, install the **Live Server** extension, right-click `main.html`, and choose **Open with Live Server**.

## Project Structure

```
Pomodoro-main/
├── main.html     page layout
├── style.css     styling
├── script.js     timer logic
└── 1.jpg - 6.jpg PomPom images
```

## Requirements

- Any modern browser (Chrome, Edge, Firefox)
- Internet connection for Google Fonts (unless fonts are stored locally)
- Git (only if you clone instead of downloading the ZIP)

## Build the Android APK (optional)

Requires Node.js, JDK 17, and Android Studio.

```bash
npm i -g cordova
cordova create pomodoro com.pochi.pomodoro Pomodoro
```

Copy the project files into the new `pomodoro/www/` folder, then:

```bash
cd pomodoro
cordova platform add android
cordova plugin add cordova-plugin-local-notification
cordova build android
```

The debug APK is at `platforms/android/app/build/outputs/apk/debug/`.

## Notice

WMA 3 Case Study. 
