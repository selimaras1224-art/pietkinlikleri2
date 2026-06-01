import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import AboutPi from './components/AboutPi.jsx';
import FindYourselfInPi from './components/FindYourselfInPi.jsx';
import MonteCarloSimulation from './components/MonteCarloSimulation.jsx';
import MemoryGame from './components/MemoryGame.jsx';
import Footer from './components/Footer.jsx';

import { computePiDigits } from './utils/computePi.js';

/**
 * Pi basamaklarını uygulama açılışında bir kere hesaplar.
 * Arama (FindYourselfInPi) ve hafıza oyunu (MemoryGame) bu basamakları paylaşır.
 *
 * Varsayılan: 10.000 basamak (tarayıcıda < 2 sn).
 * Bu sayı kullanıcı isterse artırılabilir — performans/UX dengesi için
 * burayı bir sabit olarak tuttuk.
 */
const PI_DIGIT_COUNT = 10_000;

export default function App() {
  const [digits, setDigits] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // BigInt aritmetiği ile küçük bir gecikme — UI'ı bloklamamak için setTimeout
    const t = setTimeout(() => {
      try {
        const result = computePiDigits(PI_DIGIT_COUNT);
        setDigits(result);
      } catch (e) {
        console.error(e);
        setError('Pi basamakları hesaplanamadı.');
      }
    }, 50);
    return () => clearTimeout(t);
  }, []);

  const handleScrollToFirst = () => {
    document
      .getElementById('find-yourself')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 max-w-md text-center">
          <p className="text-amber-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!digits) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-8 w-8 text-neon animate-spin" />
          <div>
            <div className="font-mono text-3xl text-neon pi-glow">π</div>
            <p className="mt-2 text-slate-400 text-sm">
              İlk {PI_DIGIT_COUNT.toLocaleString('tr-TR')} basamak hesaplanıyor…
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero digits={digits} onCtaClick={handleScrollToFirst} />
        <AboutPi />
        <FindYourselfInPi digits={digits} />
        <MonteCarloSimulation />
        <MemoryGame digits={digits} />
      </main>
      <Footer />
    </div>
  );
}
