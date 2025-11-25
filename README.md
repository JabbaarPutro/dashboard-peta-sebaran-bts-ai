# Dashboard Peta Sebaran BTS

Dashboard interaktif untuk memvisualisasikan sebaran Base Transceiver Station (BTS) di Indonesia menggunakan React, Vite, Leaflet, dan Node.js Express API.

## Fitur
- Peta interaktif Indonesia dengan marker BTS
- Filter berdasarkan status, jaringan, dan layanan
- Visualisasi data per provinsi menggunakan choropleth map
- Statistik real-time jumlah BTS
- Responsive design

## Tech Stack
- **Frontend**: React 18, Vite, Leaflet, React-Leaflet
- **Backend**: Node.js, Express
- **Deployment**: Vercel (frontend + serverless API)

## Cara Menjalankan Lokal

### 1. Clone repository
```bash
git clone https://github.com/JabbaarPutro/dashboard-peta-sebaran-bts-ai.git
cd dashboard-peta-sebaran-bts-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Jalankan backend API
```bash
npm run dev-api
```

### 4. Jalankan frontend (terminal terpisah)
```bash
npm run dev
```

### 5. Buka browser
```
http://localhost:5173
```

## Deploy ke Vercel

1. Push repo ke GitHub
2. Import project di Vercel
3. Vercel akan otomatis mendeteksi Vite dan folder `/api` sebagai serverless functions
4. Deploy!

## Struktur Project
```
├── api/                  # Backend Express API
│   ├── index.js
│   ├── bts.js
│   └── bts-data.json
├── public/               # Static assets
│   └── IndonesiaProvinsi.geojson
├── src/
│   ├── App.jsx          # Main component
│   ├── main.jsx         # React entry point
│   └── index.css
├── index.html
└── package.json
```

## Kustomisasi Data

Edit file `api/bts-data.json` untuk mengubah data BTS sesuai kebutuhan Anda.

## Lisensi
Copyright © 2025 BAKTI KOMDIGI
