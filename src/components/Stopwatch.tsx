import React, { useRef, useState } from 'react';
import { formatMMSS } from '../lib/pomodoro';

export default function Stopwatch() {
  const [sec, setSec] = useState(0);
  const [running, setRunning] = useState(false);
  const tickRef = useRef<number | null>(null);

  function start(){ if(running) return; setRunning(true); tickRef.current = window.setInterval(()=>setSec(s=>s+1), 1000); }
  function pause(){ if(!running) return; setRunning(false); if(tickRef.current){ clearInterval(tickRef.current); tickRef.current=null; } }
  function reset(){ pause(); setSec(0); }

  return (
    <div>
      <div className="timerHeadline">{formatMMSS(sec)}</div>
      <div className="center">
        {!running ? <button className="primary" onClick={start}>開始</button> : <button onClick={pause}>暫停</button>}
        <button className="ghost" onClick={reset}>重設</button>
      </div>
      <div className="quote">純手動的計時器，適合自由學習或運動。</div>
    </div>
  );
}
