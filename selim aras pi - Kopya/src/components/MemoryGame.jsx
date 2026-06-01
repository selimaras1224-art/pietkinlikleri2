import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Trophy, RotateCcw, Eye, EyeOff, Send } from 'lucide-react';
import Section from './Section.jsx';

/**
 * Pi Hafıza Oyunu (Simon Says tarzı)
 * -----------------------------------
 * Sistem π'nin basamaklarını adım adım açar:
 *   tur 1 → "3.1"
 *   tur 2 → "3.14"
 *   tur 3 → "3.141"
 *   …
 *
 * Her tur kullanıcıya kısa süre gösterilir (preview), sonra gizlenir ve
 * kullanıcı basamakları sırayla girer. Tüm girişler doğru olursa bir
 * sonraki tura geçilir. Yanlış girişte oyun biter ve skor en yüksek
 * skor olabilir (localStorage'a kaydedilir).
 */

const HIGH_SCORE_KEY = 'pi-memory-high-score';

export default function MemoryGame({ digits }) {
  // Tur (round) = oyuncunun şu an ezberlemesi gereken ondalık basamak sayısı
  // Tur 1 → "3.1" (1 ondalık), Tur 2 → "3.14", ...
  const [round, setRound] = useState(0); // 0 → henüz başlamadı
  const [phase, setPhase] = useState('idle'); // idle | preview | input | success | fail
  const [userInput, setUserInput] = useState('');
  const [highScore, setHighScore] = useState(0);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const saved = Number(localStorage.getItem(HIGH_SCORE_KEY) || 0);
    if (!Number.isNaN(saved)) setHighScore(saved);
  }, []);

  // O an gösterilmesi/girilmesi gereken hedef dizi: "3.14159..."
  const targetSequence = useMemo(() => {
    if (!digits || round === 0) return '';
    // digits = "31415..." ; ilk karakter tam sayı kısmı (3)
    const intPart = digits[0];
    const decimalPart = digits.slice(1, 1 + round);
    return `${intPart}.${decimalPart}`;
  }, [digits, round]);

  // Kullanıcıdan beklenen "sadece basamak" string'i (nokta yok)
  const expectedDigits = useMemo(() => targetSequence.replace('.', ''), [
    targetSequence,
  ]);

  const startGame = () => {
    setRound(1);
    setUserInput('');
    setPhase('preview');
  };

  const handleReset = () => {
    setRound(0);
    setUserInput('');
    setPhase('idle');
  };

  // Preview → input geçişi: 1.5 sn diziyi göster, sonra gizle
  useEffect(() => {
    if (phase !== 'preview') return;
    // Tur büyüdükçe biraz daha uzun göster (her ek basamak için +180ms)
    const visibleMs = 1200 + round * 180;
    const t = setTimeout(() => {
      setPhase('input');
      setUserInput('');
    }, visibleMs);
    return () => clearTimeout(t);
  }, [phase, round]);

  // Cevap kontrolü
  const submitAnswer = () => {
    const clean = userInput.replace(/\D/g, '');
    if (clean === expectedDigits) {
      setPhase('success');
      // Skoru kaydet
      if (round > highScore) {
        setHighScore(round);
        localStorage.setItem(HIGH_SCORE_KEY, String(round));
      }
      // Sonraki tura geç
      setTimeout(() => {
        setRound((r) => r + 1);
        setPhase('preview');
      }, 900);
    } else {
      setPhase('fail');
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') submitAnswer();
  };

  return (
    <Section
      id="memory-game"
      eyebrow="Etkinlik 03"
      title="Pi Hafıza Oyunu"
      description="Pi'nin basamakları her turda bir uzar. Sistem diziyi kısa bir an gösterir, sonra gizler — sıra sende. Kaç basamağı ezberleyebileceksin?"
      icon={Brain}
    >
      <div className="grid lg:grid-cols-[1fr,320px] gap-6">
        {/* Oyun alanı */}
        <div className="glass-card p-6 sm:p-8 flex flex-col min-h-[360px]">
          {phase === 'idle' && (
            <div className="flex flex-1 flex-col items-center justify-center text-center gap-4">
              <Brain className="h-12 w-12 text-neon" />
              <p className="text-slate-300 max-w-md">
                Hazır olduğunda başlat. Her turda π'nin bir basamağı daha eklenecek.
              </p>
              <button onClick={startGame} className="btn-primary">
                <Brain className="h-4 w-4" /> Oyuna Başla
              </button>
            </div>
          )}

          {phase !== 'idle' && (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Tur {round}
                </div>
                <button
                  onClick={() => setShowHint((v) => !v)}
                  className="text-xs text-slate-400 hover:text-neon flex items-center gap-1.5"
                >
                  {showHint ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5" /> İpucunu gizle
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5" /> İpucu göster
                    </>
                  )}
                </button>
              </div>

              {/* Dizi gösterim / giriş alanı */}
              <div className="flex-1 flex flex-col items-center justify-center gap-6">
                <AnimatePresence mode="wait">
                  {phase === 'preview' && (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="text-center"
                    >
                      <div className="text-xs uppercase tracking-[0.3em] text-neon mb-3">
                        Ezberle
                      </div>
                      <div className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold text-white pi-glow break-all">
                        {targetSequence}
                      </div>
                    </motion.div>
                  )}

                  {phase === 'input' && (
                    <motion.div
                      key="input"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="w-full max-w-md text-center"
                    >
                      <div className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-3">
                        Şimdi sıra sende
                      </div>
                      <input
                        autoFocus
                        type="text"
                        inputMode="numeric"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={handleKey}
                        placeholder={`örn. ${expectedDigits[0]}.${'•'.repeat(round)}`}
                        className="input-base text-center text-2xl sm:text-3xl"
                        maxLength={expectedDigits.length + 4}
                      />
                      <button
                        onClick={submitAnswer}
                        disabled={!userInput}
                        className="btn-primary mt-4"
                      >
                        <Send className="h-4 w-4" /> Onayla
                      </button>
                      {showHint && (
                        <div className="mt-4 font-mono text-sm text-slate-500">
                          ipucu: {targetSequence}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {phase === 'success' && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center"
                    >
                      <div className="font-mono text-4xl sm:text-5xl font-bold text-neon pi-glow">
                        ✓ {targetSequence}
                      </div>
                      <div className="mt-2 text-slate-400">Mükemmel — sıradaki tur geliyor…</div>
                    </motion.div>
                  )}

                  {phase === 'fail' && (
                    <motion.div
                      key="fail"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center"
                    >
                      <div className="text-xs uppercase tracking-[0.3em] text-amber-300 mb-2">
                        Tur sona erdi
                      </div>
                      <div className="font-mono text-2xl sm:text-3xl text-slate-200 break-all">
                        Doğru cevap:{' '}
                        <span className="text-gold gold-glow">{targetSequence}</span>
                      </div>
                      <div className="mt-1 text-sm text-slate-400 font-mono">
                        Senin cevabın:{' '}
                        <span className="text-amber-300">
                          {userInput || '(boş)'}
                        </span>
                      </div>
                      <div className="mt-4 text-slate-300">
                        Ulaştığın seviye:{' '}
                        <span className="font-mono text-neon">{round - 1}</span> basamak
                      </div>
                      <button onClick={handleReset} className="btn-primary mt-5">
                        <RotateCcw className="h-4 w-4" /> Yeniden Dene
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>

        {/* Skor paneli */}
        <div className="glass-card p-6 space-y-5">
          <div>
            <div className="section-eyebrow">Şu anki tur</div>
            <div className="mt-1 font-mono text-3xl text-white">{round || '—'}</div>
            <div className="text-xs text-slate-500">
              {round > 0 ? `${round} basamak ezberlemen gerekiyor` : 'Henüz başlanmadı'}
            </div>
          </div>

          <div className="border-t border-white/10 pt-5">
            <div className="section-eyebrow flex items-center gap-2">
              <Trophy className="h-4 w-4 text-gold" /> Rekor
            </div>
            <div className="mt-1 font-mono text-3xl text-gold gold-glow">
              {highScore}
            </div>
            <div className="text-xs text-slate-500">
              {highScore > 0
                ? `${highScore} basamağı doğru hatırladın`
                : 'Henüz rekor yok'}
            </div>
          </div>

          <div className="border-t border-white/10 pt-5 space-y-2 text-sm text-slate-400 leading-relaxed">
            <p>
              <span className="text-slate-200 font-medium">Nasıl oynanır?</span>
            </p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Dizi bir an gösterilir.</li>
              <li>Dizi gizlenir, basamakları sırayla yaz.</li>
              <li>Doğruysa bir basamak daha eklenir.</li>
              <li>Yanlışsa oyun biter — rekorun kaydedilir.</li>
            </ol>
          </div>

          {round > 0 && (
            <button onClick={handleReset} className="btn-secondary w-full">
              <RotateCcw className="h-4 w-4" /> Oyunu Sıfırla
            </button>
          )}
        </div>
      </div>
    </Section>
  );
}
