import React, { createContext, useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Settings, Session, Task, Character } from './types';
import Timer from './components/Timer';
import Tasks from './components/Tasks';
import SettingsPanel from './components/Settings';
import Stats from './components/Stats';
import Stopwatch from './components/Stopwatch';
import CharacterPicker from './components/characters/CharacterPicker';

type Ctx = {
  settings: Settings; setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  sessions: Session[]; setSessions: React.Dispatch<React.SetStateAction<Session[]>>;
  tasks: Task[]; setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  characters: Character[]; setCharacters: React.Dispatch<React.SetStateAction<Character[]>>;
  currentId: string; setCurrentId: React.Dispatch<React.SetStateAction<string>>;
  current?: Character;
};
export const AppContext = createContext<Ctx | null>(null);

const defaultSettings: Settings = {
  theme: 'light',
  durations: { focus: 25, short: 5, long: 15, longInterval: 4 },
  lines: {
    onStart: ['出發囉，這一回合保持專注！'],
    onFocusComplete: ['收工！伸展一下再繼續。'],
    onBreakStart: ['喝口水、動動肩頸～'],
    onBreakComplete: ['回到軌道，下一輪開始。'],
    onEncourage: ['一步一步就好，我在。'],
  },
  greeting: '',
};

const seedChar: Character = { id: 'c-default', name: '小夥伴', honorific: '隊長' };

export default function App() {
  const [settings, setSettings] = useLocalStorage<Settings>('dc:settings', defaultSettings);
  const [sessions, setSessions] = useLocalStorage<Session[]>('dc:sessions', []);
  const [tasks, setTasks] = useLocalStorage<Task[]>('dc:tasks', []);
  const [characters, setCharacters] = useLocalStorage<Character[]>('dc:chars', [seedChar]);
  const [currentId, setCurrentId] = useLocalStorage<string>('dc:currentChar', seedChar.id);
  const [tab, setTab] = useState<'pomodoro' | 'stopwatch'>('pomodoro');

  const current = characters.find(c => c.id === currentId);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme === 'dark' ? 'dark' : 'light');
  }, [settings.theme]);

  const ctx = useMemo(() => ({
    settings, setSettings, sessions, setSessions, tasks, setTasks,
    characters, setCharacters, currentId, setCurrentId, current
  }), [settings, sessions, tasks, characters, currentId, current]);

  return (
    <AppContext.Provider value={ctx}>
      <div className="container">
        <header className="header">
          <div className="center">
            {current?.avatarUrl ? <img className="avatar" src={current.avatarUrl} alt="avatar"/> : <div className="avatar" style={{background:'#ddd'}}/>}
            <div>
              <h1>{current?.name ?? '夢角'} 計時器</h1>
              <div className="hint">{settings.greeting || '願你今天也向前一小步。'}</div>
            </div>
          </div>
          <div className="center">
            <button className="ghost" onClick={() => setSettings(s => ({ ...s, theme: s.theme === 'dark' ? 'light' : 'dark' }))}>
              {settings.theme==='dark'?'🌙 深色':'☀️ 淺色'}
            </button>
            <CharacterPicker/>
          </div>
        </header>

        <div className="card" style={{marginBottom:12}}>
          <div className="center" style={{justifyContent:'space-between'}}>
            <div className="tabbar">
              <button className={tab==='pomodoro'?'active':''} onClick={()=>setTab('pomodoro')}>番茄鐘</button>
              <button className={tab==='stopwatch'?'active':''} onClick={()=>setTab('stopwatch')}>正計時</button>
            </div>
            <span className="badge">當前任務：{tasks.find(t=>!t.done)?.title ?? '（尚未設定）'}</span>
          </div>
          {tab==='pomodoro' ? <Timer/> : <Stopwatch/>}
        </div>

        <div className="row">
          <div className="col"><div className="card"><Tasks/></div></div>
          <div className="col"><div className="card"><Stats/></div></div>
        </div>

        <div className="row" style={{marginTop:16}}>
          <div className="col"><div className="card"><SettingsPanel/></div></div>
        </div>
        <p className="hint" style={{marginTop:12}}>資料僅存於本機（localStorage）。</p>
      </div>
    </AppContext.Provider>
  );
}
