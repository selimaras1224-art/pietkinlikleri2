# Pi Explorer · Sonsuzluğun Sayısı

Pi (π) sayısını etkileşimli olarak keşfetmeye yönelik modern, responsive bir web uygulaması.

## Özellikler

- **Hero** — Akıcı animasyonlu Pi basamakları arka planı
- **Pi Nedir?** — Pi hakkında kısa, akademik bir tanışma bölümü
- **Pi'de Kendini Bul** — Doğum tarihini veya sayını Pi'nin ilk 10.000 basamağında arar
- **Yağmur Damlaları ile Pi'yi Hesapla** — Canvas tabanlı Monte Carlo simülasyonu
- **Pi Hafıza Oyunu** — Simon Says tarzı, basamakları sırayla ezberleme oyunu (rekor `localStorage`'ta saklanır)

## Teknoloji Yığını

- **React 18** + **Vite**
- **Tailwind CSS** (özelleştirilmiş koyu tema, neon mavi & altın sarısı vurgular)
- **Framer Motion** (geçişler ve görünürlük animasyonları)
- **Lucide React** (ikonlar)
- **BigInt** ile **Machin formülü** kullanılarak Pi basamakları tarayıcıda hesaplanır

## Kurulum

```bash
npm install
npm run dev
```

Tarayıcı otomatik olarak `http://localhost:5173` adresinde açılır.

Üretim derlemesi:

```bash
npm run build
npm run preview
```

## Klasör Yapısı

```
selim aras pi/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── components/
    │   ├── Navbar.jsx
    │   ├── Hero.jsx
    │   ├── PiBackgroundAnimation.jsx
    │   ├── AboutPi.jsx
    │   ├── FindYourselfInPi.jsx
    │   ├── MonteCarloSimulation.jsx
    │   ├── MemoryGame.jsx
    │   ├── Section.jsx
    │   └── Footer.jsx
    └── utils/
        └── computePi.js
```

## Notlar

- Pi basamakları açılışta `BigInt` ile **Machin formülü** kullanılarak hesaplanır (tipik olarak <2 sn). Basamak sayısı `src/App.jsx` içinde `PI_DIGIT_COUNT` sabitiyle ayarlanır.
- Monte Carlo simülasyonu `requestAnimationFrame` döngüsü ile çalışır; nokta sayısı arttıkça π tahmini gerçek değere yaklaşır.
- Hafıza oyunu rekoru tarayıcının `localStorage`'ında `pi-memory-high-score` anahtarı altında tutulur.
