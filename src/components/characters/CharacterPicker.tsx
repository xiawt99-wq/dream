import React, { useContext, useRef, useState } from 'react';
import { AppContext } from '../../App';
import type { Character } from '../../types';

export default function CharacterPicker() {
  const { characters, setCharacters, currentId, setCurrentId } = useContext(AppContext)!;
  const [open, setOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function addCharacter() {
    const name = prompt('新夢角名字');
    if (!name) return;
    const c: Character = { id: crypto.randomUUID(), name, honorific: '夥伴' };
    setCharacters(prev => [c, ...prev]); setCurrentId(c.id);
  }

  function onSelect(id: string) { setCurrentId(id); setOpen(false); }

  function uploadAvatar(c: Character) {
    fileRef.current?.click();
    const handler = (e: Event) => {
      const f = (e.target as HTMLInputElement).files?.[0]; if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        const url = String(reader.result);
        setCharacters(prev => prev.map(x => x.id===c.id ? {...x, avatarUrl: url} : x));
      };
      reader.readAsDataURL(f);
      fileRef.current?.removeEventListener('change', handler);
    };
    fileRef.current?.addEventListener('change', handler, { once:true });
  }

  return (
    <>
      <button className="ghost" onClick={()=>setOpen(true)}>夢角卡池</button>
      {open && (
        <div className="card" style={{position:'fixed', inset:'10% 50% auto 10%', zIndex:10, maxWidth:920}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <b>你的夢角卡池</b>
            <div style={{display:'flex', gap:8}}>
              <button onClick={addCharacter}>+ 建立新夢角</button>
              <button onClick={()=>setOpen(false)}>關閉</button>
            </div>
          </div>
          <div className="row" style={{marginTop:12}}>
            {characters.map(c=>(
              <div key={c.id} className="col">
                <div className="card" style={{textAlign:'center'}}>
                  <img className="avatar" src={c.avatarUrl || 'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23ddd%22/></svg>'} alt="av"/>
                  <h3 style={{margin:'8px 0 4px'}}>{c.name}</h3>
                  <div className="hint">{c.honorific ? `你的${c.honorific}` : ' '}</div>
                  <div className="center" style={{marginTop:8}}>
                    <button className="primary" onClick={()=>onSelect(c.id)}>{c.id===currentId?'已選用':'選用'}</button>
                    <button onClick={()=>uploadAvatar(c)}>更換頭像</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <input ref={fileRef} type="file" accept="image/*" hidden />
        </div>
      )}
    </>
  );
}
