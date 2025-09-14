export type Phase = 'focus' | 'short' | 'long';

export interface Character {
  id: string;
  name: string;           // 夢角名字
  avatarUrl?: string;     // 頭像
  honorific: string;      // 對你的稱呼
}

export interface Settings {
  theme: 'light' | 'dark';
  durations: { focus: number; short: number; long: number; longInterval: number; };
  lines: {
    onStart: string[];
    onFocusComplete: string[];
    onBreakStart: string[];
    onBreakComplete: string[];
    onEncourage: string[];
  };
  greeting?: string;      // 自訂問候語
}

export interface Task { id: string; title: string; done: boolean; }

export interface Session {
  id: string; phase: 'focus' | 'break';
  startedAt: number; endedAt: number; minutes: number;
}
