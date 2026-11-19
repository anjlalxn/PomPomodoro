const countdown_text = document.getElementById('time-stamp');
const countdown_text_pause = document.getElementById('time-stamp-pause');
const countdown_text_bt = document.getElementById('time-stamp-break');

const ShortBreakTimeBtn= document.getElementById('sb');
const LongBreakTimeBtn=document.getElementById('lb');
const PauseBreakTimeBtn=document.getElementById('pb');
const BreakNow=document.getElementById('break-now');

const timerPic = document.getElementById('sypic');
const message = document.getElementById('msg');
const pauseBtn= document.getElementById('pause-btn')
const startBtn= document.getElementById('start-btn')


let time = 25 * 60;
let timePaused=0;
let countdown = null;
let countdownPause=null;

let resumeAt=null;
let resumeBreakAt=null;



let ShortBreakTime=5*60;
let LongBreakTime=15*60;
let Scountdown = null;
let Lcountdown = null;

let activeBreak = null;
let breakPaused = false;




updateDisplay();

function resetBreak(){
 clearInterval(Scountdown);
 clearInterval(Lcountdown);
 Scountdown=null;
 Lcountdown=null;
 activeBreak=null;
 breakPaused=false;
 ShortBreakTime=5*60;
 LongBreakTime=15*60;
 PauseBreakTimeBtn.textContent='Pause';
 ShortBreakTimeBtn.style.display='block'
 LongBreakTimeBtn.style.display='block'
 PauseBreakTimeBtn.style.display='none'
 countdown_text_bt.textContent='5:00';
}

function startTimer() {
    resetBreak();
    timerPic.style.backgroundImage = "url('2.jpg')";
    message.textContent = "PomPom is studying with you. Focus mode on!";
    countdown = setInterval(tick, 1000);
    startBtn.style.display='none'
    pauseBtn.style.display='block'
    BreakNow.style.display='none'

}

function pauseCountdownTime(){

if (pauseBtn.textContent === "Pause") {
    clearInterval(countdown);
    resumeAt=time;
    timerPic.style.backgroundImage = "url('1.jpg')";
    message.textContent = "PomPom will wait for you to come back.";
    countdownPause = setInterval(pauseTick, 1000);
    pauseBtn.textContent = "Resume";
} else {
    pauseBtn.textContent = "Pause";
    clearInterval(countdownPause);
    countdownPause = null;
    timePaused=0;
    time = resumeAt; 
    timerPic.style.backgroundImage = "url('2.jpg')"; 
    message.textContent = "PomPom is studying with you. Focus mode on!";
    countdown = setInterval(tick, 1000);

}
}



function start5min(){
 clearInterval(Scountdown);
 clearInterval(Lcountdown);
 activeBreak='short';
 breakPaused=false;
 PauseBreakTimeBtn.textContent='Pause';
 Scountdown = setInterval(tick5, 1000);
 ShortBreakTimeBtn.style.display='none'
 LongBreakTimeBtn.style.display='none'
 PauseBreakTimeBtn.style.display='block'
}

function start10min(){
 clearInterval(Scountdown);
 clearInterval(Lcountdown);
 activeBreak='long';
 breakPaused=false;
 PauseBreakTimeBtn.textContent='Pause';
 Lcountdown = setInterval(tick10, 1000);
 ShortBreakTimeBtn.style.display='none'
 LongBreakTimeBtn.style.display='none'
 PauseBreakTimeBtn.style.display='block'
}

function pauseBreak(){
 if(!activeBreak) return;
 if(!breakPaused){
  clearInterval(Scountdown);
  clearInterval(Lcountdown);
  breakPaused=true;
  PauseBreakTimeBtn.textContent='Resume';
 } else {
  breakPaused=false;
  PauseBreakTimeBtn.textContent='Pause';
  if(activeBreak==='short') Scountdown = setInterval(tick5, 1000);
  else Lcountdown = setInterval(tick10, 1000);
 }
}

function tick() {
    time--;
    updateDisplay();
    if (time <= 0) {
        clearInterval(countdown);
        countdown = null;
        timerPic.style.backgroundImage = "url('3.jpg')";
        startBtn.style.display='block'
        pauseBtn.style.display='none'
        BreakNow.style.display='flex'

        clearInterval(countdownPause);
        countdownPause = null;
        time=25*60;
        timePaused=0;
        let min = Math.floor(time / 60);
        let sec = time % 60;
        if (sec < 10) sec = '0' + sec; 
        countdown_text.textContent = `${min}:${sec}`;
    }
}

function tick5() {
    ShortBreakTime--;
    updateSBDisplay();
    if (ShortBreakTime <= 0) {
        ShortBreakTimeBtn.style.display='block'
        LongBreakTimeBtn.style.display='block'
        PauseBreakTimeBtn.style.display='none'
        BreakNow.style.display='none'
        clearInterval(Scountdown);
        Scountdown = null;
        activeBreak=null;
        breakPaused=false;
        ShortBreakTime=5*60;
        let min = Math.floor(ShortBreakTime / 60);
        let sec = ShortBreakTime % 60;
        if (sec < 10) sec = '0' + sec; 
        countdown_text_bt.textContent = `${min}:${sec}`;
    }
}

function tick10() {
    LongBreakTime--;
    updateLBDisplay();
    if (LongBreakTime <= 0) {
        ShortBreakTimeBtn.style.display='block'
        LongBreakTimeBtn.style.display='block'
        PauseBreakTimeBtn.style.display='none'
        BreakNow.style.display='none'
        clearInterval(Lcountdown);
        Lcountdown = null;
        activeBreak=null;
        breakPaused=false;
        LongBreakTime=15*60;
        let min = Math.floor(LongBreakTime / 60);
        let sec = LongBreakTime % 60;
        if (sec < 10) sec = '0' + sec; 
        countdown_text_bt.textContent = `${min}:${sec}`;
    }
}



function pauseTick() {
    timePaused++;
    howLongGone();
    if (timePaused >= 600) {
        clearInterval(countdownPause);
        countdownPause = null;
        timerPic.style.backgroundImage = "url('5.jpg')";
        message.textContent = "PomPom is getting impatient. Where did you go?";
    }
}

function updateDisplay() {
    let min = Math.floor(time / 60);
    let sec = time % 60;
    if (sec < 10) sec = '0' + sec; 
    countdown_text.textContent = `${min}:${sec}`;
}

function howLongGone(){
    let min = Math.floor(timePaused / 60);
    let sec = timePaused % 60;
    if (sec < 10) sec = '0' + sec; 
    countdown_text_pause.textContent = `${min}:${sec}`;
}


function updateSBDisplay() {
    let min = Math.floor(ShortBreakTime / 60);
    let sec = ShortBreakTime % 60;
    if (sec < 10) sec = '0' + sec; 
    countdown_text_bt.textContent = `${min}:${sec}`;
}

function updateLBDisplay() {
    let min = Math.floor(LongBreakTime / 60);
    let sec = LongBreakTime % 60;
    if (sec < 10) sec = '0' + sec; 
    countdown_text_bt.textContent = `${min}:${sec}`;
}






function resetTimer(){
clearInterval(countdownPause);
countdownPause = null;
clearInterval(countdown);
countdown = null;
time=25*60;
timePaused=0;
let min = Math.floor(time / 60);
let sec = time % 60;
if (sec < 10) sec = '0' + sec; 
countdown_text.textContent = `${min}:${sec}`;

timerPic.style.backgroundImage = "url('4.jpg')";
startBtn.style.display='block'
pauseBtn.style.display='none'
 message.textContent = "PomPom noticed the timer reset. Do you want to start again?";
}