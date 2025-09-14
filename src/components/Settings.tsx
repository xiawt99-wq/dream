import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import type { Settings } from '../types';

export default function SettingsPanel() {
  const { settings, setSettings } = useContext(AppContext)!;
  const [draft, setDraft] = useState<Settings>(settings);

  function save(){ setSettings(draft); }
  function onNum(key: keyof Settings['durations'], v: string){
    const n = Math.max(1, Math.min(180, parseInt(v || '0', 10)));
    setDraft(s => ({ ...s, durations: { ...s.durations, [key]: n }}));
  }
  function addLine(bucket: keyof Settings['lines']) {
    const v = prompt('新增一句台詞（例：先完成第一小步）');
    if (!v) return;
    setDraft(s => ({ ...s, lines: { ...s.lines, [bucket]: [...s.lines[bucket], v] }}));
  }

  return (
    <div>
      <h2>夢角設定</h2>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
        <label>自訂問候語
          <input value={draft.greeting || ''} onChange={e=>setDraft(s=>({...s, greeting: e.target.value}))}/>
        </label>
        <label>主題
          <select value={draft.theme} onChange={e=>setDraft(s=>({...s, theme: e.target.value as any}))}>
            <option value="light">淺色</option><option value="dark">深色</option>
          </select>
        </label>

        <label>專注（分鐘）<input type="number" value={draft.durations.focus} onChange={e=>onNum('focus', e.target.value)}/></label>
        <label>短休（分鐘）<input type="number" value={draft.durations.short} onChange={e=>onNum('short', e.target.value)}/></label>
        <label>長休（分鐘）<input type="number" value={draft.durations.long} onChange={e=>onNum('long', e.target.value)}/></label>
        <label>長休間隔（每幾次專注）<input type="number" value={draft.durations.longInterval} onChange={e=>onNum('longInterval', e.target.value)}/></label>
      </div>

      {/* 台詞庫（玩家自行設定） */}
      <div style={{marginTop:12, display:'grid', gap:8}}>
        <Bucket name="開始台詞" onAdd={()=>addLine('onStart')} items={draft.lines.onStart}/>
        <Bucket name="專注結束" onAdd={()=>addLine('onFocusComplete')} items={draft.lines.onFocusComplete}/>
        <Bucket name="休息開始" onAdd={()=>addLine('onBreakStart')} items={draft.lines.onBreakStart}/>
        <Bucket name="休息結束" onAdd={()=>addLine('onBreakComplete')} items={draft.lines.onBreakComplete}/>
        <Bucket name="鼓勵" onAdd={()=>addLine('onEncourage')} items={draft.lines.onEncourage}/>
      </div>

      <div style={{display:'flex', gap:8, marginTop:12}}>
        <button className="success" onClick={save}>儲存設定</button>
        <button className="ghost" onClick={()=>setDraft(settings)}>還原</button>
      </div>
      <p className="hint">所有句子都由玩家自訂；不含預設鼓勵風格。</p>
    </div>
  );
}

function Bucket({name, items, onAdd}:{name:string;items:string[];onAdd:()=>void}) {
  return (
    <div className="card">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6}}>
        <b>{name}</b><button onClick={onAdd}>+ 新增</button>
      </div>
      <ul className="list">{items.map((t,i)=>(<li key={i}><span style={{whiteSpace:'pre-wrap'}}>{t}</span></li>))}</ul>
    </div>
  )
}
