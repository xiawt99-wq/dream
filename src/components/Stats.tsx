import React, { useContext, useMemo, useRef } from 'react';
import { AppContext } from '../App';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title } from 'chart.js';
import { sumTodayFocusMinutes } from '../lib/pomodoro';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

function fmt(d: Date) {
  const m = d.getMonth()+1; const day = d.getDate();
  return `${m}/${day}`;
}

export default function Stats() {
  const { sessions, current } = useContext(AppContext)!;
  const chartRef = useRef<any>(null);

  const data7 = useMemo(()=>{
    const days: string[] = [];
    const values: number[] = [];
    const today = new Date();
    for (let i=6;i>=0;i--) {
      const d = new Date(today); d.setDate(d.getDate()-i);
      const key = d.toISOString().slice(0,10);
      days.push(fmt(d));
      const minutes = sessions
        .filter(s => s.phase==='focus' && new Date(s.startedAt).toISOString().slice(0,10) === key)
        .reduce((acc, s)=> acc + s.minutes, 0);
      values.push(Math.round(minutes));
    }
    return { days, values };
  }, [sessions]);

  const data = { labels: data7.days, datasets: [{ label: '專注（分鐘）', data: data7.values }] };
  const options = { responsive: true, plugins: { legend: { display: true }, title: { display: true, text: '近 7 天專注' } } };

  function downloadPNG() {
    const chart = chartRef.current;
    if (!chart) return;

    const url = chart.toBase64Image();
    const img = new Image();
    img.onload = () => {
      const W = img.width, H = img.height;
      const extraH = 120;
      const canvas = document.createElement('canvas');
      canvas.width = W; canvas.height = H + extraH;
      const ctx = canvas.getContext('2d')!;

      const bg = getComputedStyle(document.documentElement).getPropertyValue('--card') || '#fff';
      const fg = getComputedStyle(document.documentElement).getPropertyValue('--text') || '#111';
      ctx.fillStyle = bg; ctx.fillRect(0,0,canvas.width,canvas.height);

      ctx.drawImage(img, 0, 0);

      const todayMinutes = sumTodayFocusMinutes(sessions);
      const name = current?.name ?? '夢角';
      const title = `今天（${name}）陪你專注 ${todayMinutes} 分鐘`;

      ctx.fillStyle = fg;
      ctx.font = 'bold 28px ui-sans-serif, system-ui, -apple-system';
      ctx.fillText(title, 24, H + 52);

      ctx.font = '14px ui-sans-serif, system-ui, -apple-system';
      ctx.fillText(new Date().toLocaleDateString(), 24, H + 82);

      const finalURL = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = finalURL;
      a.download = `focus-stats-${new Date().toISOString().slice(0,10)}.png`;
      a.click();
    };
    img.src = url;
  }

  return (
    <div>
      <h2>統計圖</h2>
      <div className="card" style={{padding:8}}>
        {/* @ts-ignore */}
        <Bar ref={chartRef} data={data} options={options}/>
      </div>
      <div style={{display:'flex', gap:8, marginTop:8}}>
        <button onClick={downloadPNG}>下載統計圖 (PNG)</button>
      </div>
      <p className="hint" style={{marginTop:8}}>註：統計來自已完成的「專注」階段。</p>
    </div>
  );
}
