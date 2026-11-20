import { Component, OnDestroy, computed, signal } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonInput,
  IonCheckbox,
} from '@ionic/angular';

interface Task {
  id: number;
  text: string;
  done: boolean;
}

type Phase = 'idle' | 'focus' | 'paused' | 'finished';
type BreakKind = 'short' | 'long';
type Timer = ReturnType<typeof setInterval> | null;

const FOCUS_SECONDS = 25 * 60;
const SHORT_BREAK_SECONDS = 5 * 60;
const LONG_BREAK_SECONDS = 15 * 60;
const IMPATIENT_AFTER_SECONDS = 10 * 60;
const TASKS_KEY = 'pompom-tasks';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonCheckbox],
})
export class HomePage implements OnDestroy {
  // ---- Focus timer state ----
  time = signal(FOCUS_SECONDS);
  timePaused = signal(0);
  picture = signal('3.jpg');
  message = signal('PomPom is waiting to study with you.');
  phase = signal<Phase>('idle');

  // ---- Break state ----
  showBreakPanel = signal(false);
  activeBreak = signal<BreakKind | null>(null);
  breakPaused = signal(false);
  breakTime = signal(SHORT_BREAK_SECONDS);

  // ---- Display text ----
  timeText = computed(() => this.fmt(this.time()));
  pausedText = computed(() => this.fmt(this.timePaused()));
  breakText = computed(() => this.fmt(this.breakTime()));

  // ---- To-do list ----
  tasks = signal<Task[]>([]);
  newTask = signal('');
  remaining = computed(() => this.tasks().filter((t) => !t.done).length);

  private focusTimer: Timer = null;
  private pauseTimer: Timer = null;
  private breakTimer: Timer = null;

  constructor() {
    this.loadTasks();
  }

  ngOnDestroy() {
    this.stopFocus();
    this.stopPause();
    this.stopBreak();
  }

  // ================= Focus timer =================
  startTimer() {
    this.resetBreak();
    this.stopFocus();
    this.stopPause();
    this.picture.set('2.jpg');
    this.message.set('PomPom is studying with you. Focus mode on!');
    this.phase.set('focus');
    this.showBreakPanel.set(false);
    this.focusTimer = setInterval(() => this.tick(), 1000);
  }

  pauseOrResume() {
    if (this.phase() === 'focus') {
      this.stopFocus();
      this.picture.set('1.jpg');
      this.message.set('PomPom will wait for you to come back.');
      this.phase.set('paused');
      this.pauseTimer = setInterval(() => this.pauseTick(), 1000);
    } else if (this.phase() === 'paused') {
      this.stopPause();
      this.timePaused.set(0);
      this.picture.set('2.jpg');
      this.message.set('PomPom is studying with you. Focus mode on!');
      this.phase.set('focus');
      this.focusTimer = setInterval(() => this.tick(), 1000);
    }
  }

  resetTimer() {
    this.stopFocus();
    this.stopPause();
    this.time.set(FOCUS_SECONDS);
    this.timePaused.set(0);
    this.picture.set('4.jpg');
    this.phase.set('idle');
    this.message.set('PomPom noticed the timer reset. Do you want to start again?');
  }

  private tick() {
    this.time.update((t) => t - 1);
    if (this.time() <= 0) {
      this.stopFocus();
      this.stopPause();
      this.picture.set('3.jpg');
      this.message.set('Session complete! PomPom is proud of you.');
      this.phase.set('finished');
      this.showBreakPanel.set(true);
      this.time.set(FOCUS_SECONDS);
      this.timePaused.set(0);
    }
  }

  private pauseTick() {
    this.timePaused.update((t) => t + 1);
    if (this.timePaused() >= IMPATIENT_AFTER_SECONDS) {
      this.stopPause();
      this.picture.set('5.jpg');
      this.message.set('PomPom is getting impatient. Where did you go?');
    }
  }

  // ================= Breaks =================
  startBreak(kind: BreakKind) {
    this.stopBreak();
    this.activeBreak.set(kind);
    this.breakPaused.set(false);
    this.breakTime.set(kind === 'short' ? SHORT_BREAK_SECONDS : LONG_BREAK_SECONDS);
    this.breakTimer = setInterval(() => this.tickBreak(), 1000);
  }

  pauseBreak() {
    if (!this.activeBreak()) return;
    if (!this.breakPaused()) {
      this.stopBreak();
      this.breakPaused.set(true);
    } else {
      this.breakPaused.set(false);
      this.breakTimer = setInterval(() => this.tickBreak(), 1000);
    }
  }

  private tickBreak() {
    this.breakTime.update((t) => t - 1);
    if (this.breakTime() <= 0) {
      this.resetBreak();
      this.showBreakPanel.set(false);
    }
  }

  private resetBreak() {
    this.stopBreak();
    this.activeBreak.set(null);
    this.breakPaused.set(false);
    this.breakTime.set(SHORT_BREAK_SECONDS);
  }

  // ================= To-do list =================
  onTaskInput(ev: CustomEvent) {
    this.newTask.set(ev.detail.value ?? '');
  }

  addTask() {
    const text = this.newTask().trim();
    if (!text) return;
    this.tasks.update((list) => [...list, { id: Date.now(), text, done: false }]);
    this.newTask.set('');
    this.saveTasks();
  }

  toggleTask(id: number) {
    this.tasks.update((list) => list.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    this.saveTasks();
  }

  deleteTask(id: number) {
    this.tasks.update((list) => list.filter((t) => t.id !== id));
    this.saveTasks();
  }

  clearDone() {
    this.tasks.update((list) => list.filter((t) => !t.done));
    this.saveTasks();
  }

  private saveTasks() {
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(this.tasks()));
    } catch {}
  }

  private loadTasks() {
    try {
      const raw = localStorage.getItem(TASKS_KEY);
      if (raw) this.tasks.set(JSON.parse(raw));
    } catch {}
  }

  // ================= Helpers =================
  private fmt(totalSeconds: number): string {
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  }

  private stopFocus() {
    if (this.focusTimer) clearInterval(this.focusTimer);
    this.focusTimer = null;
  }

  private stopPause() {
    if (this.pauseTimer) clearInterval(this.pauseTimer);
    this.pauseTimer = null;
  }

  private stopBreak() {
    if (this.breakTimer) clearInterval(this.breakTimer);
    this.breakTimer = null;
  }
}