import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../App';
import { formatMMSS, nextPhase, sumTodayFocusMinutes } from '../lib/pomodoro';
import type { Phase, Session } from '../types';

export default function Timer() {
  const { settings, sessions, setSessions } = useContext(AppContext)!;

  const [phase, setPhase] = useState<Phase>('focus');
  const [secondsLeft, setSecondsLeft] = useState(settings.durations.focus * 60);
  const [running, setRunning] = useState(false);
  const startedAtRef = useRef<number | null>(null);
  const focusCountRef = useRef(0);
  const tickRef = useRef<number | null>(null);

  useEffect(()=>{ if(!running){
    const m = phase==='focus'?settings.durations.focus: phase==='short'?settings.durations.short:settings.durations.long;
    setSecondsLeft(m*60);
  } }, [settings.durations, phase, running]);

  function start(){ if(running) return; setRunning(true); startedAtRef.current = Date.now(); tickRef.current = window.setInterval(()=>setSecondsLeft(s=>s-1),1000); }
  function pause(){ if(!running) return; setRunning(false); if(tickRef.current){ clearInterval(tickRef.current); tickRef.current=null; } }
  function reset(to: Phase = phase){ pause(); const m = to==='focus'?settings.durations.focus: to==='short'?settings.durations.short:settings.durations.long; setSecondsLeft(m*60); }

  useEffect(()=>{ if(secondsLeft>=0) return; pause();
    const endedAt = Date.now(); const startedAt = startedAtRef.current ?? endedAt;
    const minutes = Math.round(((endedAt - startedAt) / 1000) / 60);
    const rec: Session = { id: crypto.randomUUID(), phase: phase==='focus'?'focus':'break', startedAt, endedAt, minutes };
    setSessions(p=>[...p, rec]);

    if(phase==='focus') focusCountRef.current++;
    const to = nextPhase(phase, focusCountRef.current, settings.durations.longInterval);
    setPhase(to); reset(to);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  const todayMinutes = sumTodayFocusMinutes(sessions);
  const total = (phase==='focus'?settings.durations.focus:phase==='short'?settings.durations.short:settings.durations.long)*60;
  const prog = Math.max(0, Math.min(1, 1 - secondsLeft/total));

  return (
    <>
      <div className="center" style={{margin:4, gap:8}}>
        <button className={phase==='focus'?'badge':''} onClick={()=>{setPhase('focus');reset('focus')}}>專注</button>
        <button className={phase==='short'?'badge':''} onClick={()=>{setPhase('short');reset('short')}}>短休</button>
        <button className={phase==='long'?'badge':''} onClick={()=>{setPhase('long');reset('long')}}>長休</button>
      </div>

      <div className="timerHeadline">{formatMMSS(Math.max(0, secondsLeft))}</div>

      <div style={{height:8, borderRadius:999, background:'rgba(124,92,255,.15)'}}>
        <div style={{
          width:`${prog*100}%`, height:'100%', borderRadius:999,
          background:'linear-gradient(90deg, var(--primary) 0%, var(--primary-2) 100%)',
          transition:'width .6s ease'
        }} />
      </div>

      <div className="center" style={{marginTop:12}}>
        {!running ? <button className="primary" onClick={start}>開始</button> : <button onClick={pause}>暫停</button>}
        <button className="ghost" onClick={()=>reset()}>重設</button>
      </div>

      <div className="quote">今日已專注 <b>{todayMinutes}</b> 分鐘。保持節奏最重要。</div>
    </>
  );
}
