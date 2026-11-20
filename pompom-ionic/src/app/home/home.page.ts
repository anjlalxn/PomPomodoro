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

  // Real timestamps, so Android suspending the WebView can't make the timer drift
  private focusEndAt = 0;
  private breakEndAt = 0;
  private pausedAt = 0;
  private impatient = false;

  constructor() {
    this.loadTasks();
  }

  ngOnDestroy() {
    this.stopFocus();
    this.stopPause();
    this.stopBreak();
  }

  /** For Anjela: when the running focus session ends (ms timestamp), for scheduling a notification. */
  get focusEndsAt(): number {
    return this.focusEndAt;
  }

  // ================= Focus timer =================
  startTimer() {
    this.resetBreak();
    this.stopFocus();
    this.stopPause();
    this.time.set(FOCUS_SECONDS);
    this.focusEndAt = Date.now() + FOCUS_SECONDS * 1000;
    this.picture.set('2.jpg');
    this.message.set('PomPom is studying with you. Focus mode on!');
    this.phase.set('focus');
    this.showBreakPanel.set(false);
    this.focusTimer = setInterval(() => this.tick(), 250);
  }

  pauseOrResume() {
    if (this.phase() === 'focus') {
      this.time.set(this.secondsLeft(this.focusEndAt));
      this.stopFocus();
      this.pausedAt = Date.now();
      this.impatient = false;
      this.picture.set('1.jpg');
      this.message.set('PomPom will wait for you to come back.');
      this.phase.set('paused');
      this.pauseTimer = setInterval(() => this.pauseTick(), 250);
    } else if (this.phase() === 'paused') {
      this.stopPause();
      this.timePaused.set(0);
      this.focusEndAt = Date.now() + this.time() * 1000;
      this.picture.set('2.jpg');
      this.message.set('PomPom is studying with you. Focus mode on!');
      this.phase.set('focus');
      this.focusTimer = setInterval(() => this.tick(), 250);
    }
  }

  resetTimer() {
    this.stopFocus();
    this.stopPause();
    this.resetBreak(); // FIX: reset also cancels a running break
    this.showBreakPanel.set(false);
    this.impatient = false;
    this.time.set(FOCUS_SECONDS);
    this.timePaused.set(0);
    this.picture.set('4.jpg');
    this.phase.set('idle');
    this.message.set('PomPom noticed the timer reset. Do you want to start again?');
  }

  private tick() {
    const left = this.secondsLeft(this.focusEndAt);
    this.time.set(left);
    if (left > 0) return;

    this.stopFocus();
    this.stopPause();
    this.picture.set('3.jpg');
    this.message.set('Session complete! PomPom is proud of you.');
    this.phase.set('finished');
    this.showBreakPanel.set(true);
    this.time.set(FOCUS_SECONDS);
    this.timePaused.set(0);
    // TODO (Anjela): play alarm / fire "focus done" notification here
  }

  private pauseTick() {
    const gone = Math.floor((Date.now() - this.pausedAt) / 1000);
    this.timePaused.set(gone); // FIX: keeps counting past 10 min
    if (gone >= IMPATIENT_AFTER_SECONDS && !this.impatient) {
      this.impatient = true;
      this.picture.set('5.jpg');
      this.message.set('PomPom is getting impatient. Where did you go?');
    }
  }

  // ================= Breaks =================
  startBreak(kind: BreakKind) {
    this.stopBreak();
    const total = kind === 'short' ? SHORT_BREAK_SECONDS : LONG_BREAK_SECONDS;
    this.activeBreak.set(kind);
    this.breakPaused.set(false);
    this.breakTime.set(total);
    this.breakEndAt = Date.now() + total * 1000;
    this.breakTimer = setInterval(() => this.tickBreak(), 250);
  }

  pauseBreak() {
    if (!this.activeBreak()) return;
    if (!this.breakPaused()) {
      this.breakTime.set(this.secondsLeft(this.breakEndAt));
      this.stopBreak();
      this.breakPaused.set(true);
    } else {
      this.breakPaused.set(false);
      this.breakEndAt = Date.now() + this.breakTime() * 1000;
      this.breakTimer = setInterval(() => this.tickBreak(), 250);
    }
  }

  private tickBreak() {
    const left = this.secondsLeft(this.breakEndAt);
    this.breakTime.set(left);
    if (left > 0) return;

    this.resetBreak();
    this.showBreakPanel.set(false);
    // FIX: leave the "Session complete" state so the UI isn't stale after the break
    this.phase.set('idle');
    this.picture.set('4.jpg');
    this.message.set('Break over! Ready for another round?');
    // TODO (Anjela): play alarm / fire "break done" notification here
  }

  private resetBreak() {
    this.stopBreak();
    this.activeBreak.set(null);
    this.breakPaused.set(false);
    this.breakTime.set(SHORT_BREAK_SECONDS);
  }

  private secondsLeft(endAt: number): number {
    return Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
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