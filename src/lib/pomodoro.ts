import type { Phase, Session } from '../types';

export function formatMMSS(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function todayKey(d = new Date()) {
  return d.toISOString().slice(0,10);
}

export function sumTodayFocusMinutes(sessions: Session[]) {
  const key = todayKey();
  return Math.round(
    sessions
      .filter(s => s.phase === 'focus' && new Date(s.startedAt).toISOString().slice(0,10) === key)
      .reduce((acc, s) => acc + s.minutes, 0)
  );
}

export function nextPhase(current: Phase, completedFocusCount: number, longInterval: number): Phase {
  if (current === 'focus') {
    return (completedFocusCount % longInterval === 0) ? 'long' : 'short';
  } else {
    return 'focus';
  }
}
