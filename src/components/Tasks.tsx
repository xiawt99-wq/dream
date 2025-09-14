import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import type { Task } from '../types';

export default function Tasks() {
  const { tasks, setTasks } = useContext(AppContext)!;
  const [title, setTitle] = useState('');

  function addTask() {
    const t = title.trim();
    if (!t) return;
    const task: Task = { id: crypto.randomUUID(), title: t, done: false };
    setTasks(prev => [task, ...prev]);
    setTitle('');
  }
  function toggle(id: string) {
    setTasks(prev => prev.map(t => t.id===id? {...t, done:!t.done} : t));
  }
  function remove(id: string) {
    setTasks(prev => prev.filter(t => t.id!==id));
  }

  return (
    <div>
      <h2>今天的任務清單</h2>
      <div style={{display:'flex', gap:8, marginBottom:8}}>
        <input placeholder="輸入任務…" value={title} onChange={e=>setTitle(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') addTask(); }}/>
        <button className="primary" onClick={addTask}>加入</button>
      </div>
      <ul className="list">
        {tasks.map(t => (
          <li key={t.id}>
            <label style={{display:'flex', alignItems:'center', gap:8}}>
              <input type="checkbox" checked={t.done} onChange={()=>toggle(t.id)}/>
              <span style={{textDecoration: t.done ? 'line-through' : 'none', opacity: t.done ? .6 : 1}}>{t.title}</span>
            </label>
            <button className="danger" onClick={()=>remove(t.id)}>刪除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
