# 夢角計時器（React + Vite + TS）

- 番茄鐘 / 正計時
- 黑/白主題
- 夢角卡池（自訂名字、上傳頭像、稱呼）
- 今日任務清單
- 近 7 天統計圖，可下載 PNG，並自動印上「今天（夢角）陪你專注 N 分鐘」與日期

## 開發
```bash
npm i
npm run dev
```

## 佈署 GitHub Pages
若你的 Pages 路徑為 `/<repo>/`，將 `vite.config.ts` 的 `base` 改為 `'/<repo>/'` 再：
```bash
npm run build
```
把 `dist/` 發佈即可（或用 GitHub Actions）。
