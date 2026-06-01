import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Play, Pause, RotateCcw, Zap } from 'lucide-react';
import Section from './Section.jsx';

/**
 * Monte Carlo yöntemi ile Pi yaklaşımı
 * ------------------------------------
 * Kenarı 2r olan bir kare içine, yarıçapı r olan bir daire çizilir.
 *
 *   Daire alanı / Kare alanı = πr² / (2r)² = π / 4
 *
 * Kare içine N adet rastgele nokta atarsak, bunların M tanesi daireye düşer:
 *
 *   M / N  ≈  π / 4   ⇒   π ≈ 4 · M / N
 *
 * N büyüdükçe yaklaşım gerçek π değerine yaklaşır (Büyük Sayılar Yasası).
 *
 * Çizim: HTML Canvas üzerinde daire içine düşen noktalar neon mavisi, dışına
 * düşenler altın sarısı olarak boyanır. Performans için canvas tamamen yeniden
 * çizilmez — yalnızca yeni noktalar üst üste eklenir.
 */
export default function MonteCarloSimulation() {
  const canvasRef = useRef(null);
  const [inside, setInside] = useState(0);
  const [total, setTotal] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(50); // her tick'te kaç nokta
  const animRef = useRef(null);

  // Canvas boyutu (responsive: konteynerin genişliğine sığar)
  const CANVAS_SIZE = 480;

  /** Kare ve dairenin başlangıç çizimi */
  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Temizle
    ctx.clearRect(0, 0, w, h);

    // Hafif grid arka plan (akademik his)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    const step = w / 10;
    for (let i = 1; i < 10; i++) {
      ctx.beginPath();
      ctx.moveTo(i * step, 0);
      ctx.lineTo(i * step, h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * step);
      ctx.lineTo(w, i * step);
      ctx.stroke();
    }

    // Kare
    ctx.strokeStyle = 'rgba(245, 200, 75, 0.6)';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, w - 2, h - 2);

    // Daire (içe çizili)
    ctx.strokeStyle = 'rgba(56, 225, 255, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w / 2 - 1, 0, Math.PI * 2);
    ctx.stroke();
  }, []);

  /** Canvas'ı sıfırla ve sayaçları temizle */
  const handleReset = useCallback(() => {
    setIsRunning(false);
    setInside(0);
    setTotal(0);
    drawFrame();
  }, [drawFrame]);

  // İlk açılışta çerçeveyi çiz
  useEffect(() => {
    drawFrame();
  }, [drawFrame]);

  /**
   * Rastgele bir grup nokta at ve canvas'a çiz.
   * Daireye düşenleri ayrı say.
   */
  const throwPoints = useCallback(
    (count) => {
      const canvas = canvasRef.current;
      if (!canvas) return { newInside: 0, newTotal: 0 };
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const r = w / 2 - 1;
      const rSq = r * r;

      let localInside = 0;

      for (let i = 0; i < count; i++) {
        // [0, w) × [0, h) aralığında uniform rastgele nokta
        const x = Math.random() * w;
        const y = Math.random() * h;

        const dx = x - cx;
        const dy = y - cy;
        const inCircle = dx * dx + dy * dy <= rSq;

        if (inCircle) {
          localInside++;
          ctx.fillStyle = 'rgba(56, 225, 255, 0.85)';
        } else {
          ctx.fillStyle = 'rgba(245, 200, 75, 0.85)';
        }
        ctx.beginPath();
        ctx.arc(x, y, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }

      return { newInside: localInside, newTotal: count };
    },
    []
  );

  /** Tek el atış: butona bir tıkta `speed` kadar nokta düşür */
  const handleDrop = useCallback(() => {
    const { newInside, newTotal } = throwPoints(speed);
    setInside((prev) => prev + newInside);
    setTotal((prev) => prev + newTotal);
  }, [throwPoints, speed]);

  /** Otomatik akış: requestAnimationFrame ile sürekli atış */
  useEffect(() => {
    if (!isRunning) return;
    const tick = () => {
      const { newInside, newTotal } = throwPoints(speed);
      setInside((prev) => prev + newInside);
      setTotal((prev) => prev + newTotal);
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [isRunning, speed, throwPoints]);

  const piEstimate = total > 0 ? (4 * inside) / total : 0;
  const realPi = Math.PI;
  const error = total > 0 ? Math.abs(piEstimate - realPi) : 0;
  const errorPct = total > 0 ? (error / realPi) * 100 : 0;

  return (
    <Section
      id="monte-carlo"
      eyebrow="Etkinlik 02"
      title="Yağmur Damlaları ile Pi'yi Hesapla"
      description="Kare içindeki daireye rastgele noktalar at. Daireye düşenlerin oranı, π'nin değerini kendiliğinden ortaya çıkarır. Bu, Monte Carlo yönteminin en zarif örneklerinden biridir."
      icon={Droplets}
      accent="gold"
    >
      <div className="grid lg:grid-cols-[1fr,360px] gap-6">
        {/* Canvas */}
        <div className="glass-card p-4 sm:p-6">
          <div className="relative mx-auto" style={{ maxWidth: CANVAS_SIZE }}>
            <canvas
              ref={canvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              className="w-full h-auto rounded-xl bg-slate-950/60 border border-white/5"
            />
            {total === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="rounded-xl bg-slate-950/70 border border-white/10 px-4 py-2 text-sm text-slate-400">
                  "Nokta At" ile başla
                </div>
              </div>
            )}
          </div>

          {/* Kontroller */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button onClick={handleDrop} className="btn-gold">
              <Droplets className="h-4 w-4" />
              Nokta At ({speed})
            </button>
            <button
              onClick={() => setIsRunning((v) => !v)}
              className="btn-secondary"
            >
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4" /> Duraklat
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" /> Otomatik
                </>
              )}
            </button>
            <button onClick={handleReset} className="btn-secondary">
              <RotateCcw className="h-4 w-4" /> Sıfırla
            </button>
          </div>

          <div className="mt-4 flex items-center gap-3 justify-center text-xs text-slate-400">
            <Zap className="h-3.5 w-3.5 text-neon" />
            <span>Tık başına nokta:</span>
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="accent-neon w-40"
            />
            <span className="font-mono text-slate-300 w-10 text-right">
              {speed}
            </span>
          </div>
        </div>

        {/* Sonuç paneli */}
        <div className="glass-card p-6 flex flex-col">
          <div className="section-eyebrow">Canlı Tahmin</div>

          <motion.div
            key={piEstimate.toFixed(6)}
            initial={{ opacity: 0.5, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 font-mono text-5xl font-bold text-neon pi-glow break-all"
          >
            {total > 0 ? piEstimate.toFixed(6) : '—'}
          </motion.div>
          <div className="mt-1 text-xs text-slate-500 font-mono">
            Gerçek π = {realPi.toFixed(10)}
          </div>

          <div className="mt-6 space-y-3 text-sm">
            <Stat
              label="Toplam nokta"
              value={total.toLocaleString('tr-TR')}
              accent="text-slate-200"
            />
            <Stat
              label="Daire içine düşen"
              value={inside.toLocaleString('tr-TR')}
              accent="text-neon"
            />
            <Stat
              label="Daire dışına düşen"
              value={(total - inside).toLocaleString('tr-TR')}
              accent="text-gold"
            />
            <Stat
              label="Mutlak hata"
              value={total > 0 ? error.toFixed(6) : '—'}
              accent="text-slate-300"
            />
            <Stat
              label="Hata %"
              value={total > 0 ? `${errorPct.toFixed(3)}%` : '—'}
              accent="text-slate-300"
            />
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-slate-950/60 p-4 font-mono text-xs text-slate-300 leading-relaxed">
            <div className="text-slate-500 mb-1">// formül</div>
            π ≈ 4 · (
            <span className="text-neon">{inside.toLocaleString('tr-TR')}</span> /{' '}
            <span className="text-gold">{total.toLocaleString('tr-TR') || '0'}</span>
            )
            <div className="mt-2 text-slate-500">
              {total > 0 && (
                <>
                  = {(4 * inside).toLocaleString('tr-TR')} ÷{' '}
                  {total.toLocaleString('tr-TR')} ={' '}
                  <span className="text-slate-100">{piEstimate.toFixed(6)}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-2">
      <span className="text-slate-400">{label}</span>
      <span className={`font-mono font-semibold ${accent}`}>{value}</span>
    </div>
  );
}
