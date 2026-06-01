import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Calendar, Hash, X } from 'lucide-react';
import Section from './Section.jsx';

/**
 * Kullanıcının doğum tarihi veya sayısını Pi basamakları içinde arar.
 *
 * Pi basamakları parametresi "3.14159..." değil yalnızca "314159..."
 * (yani ondalık nokta yok) şeklinde gelir; biz baştaki "3"i atlayıp
 * sadece ondalık kısmı arıyoruz, böylece "1.kez geçtiği konum" doğal anlamına
 * sahip olur (ondalıktan sonraki N'inci basamak).
 */
export default function FindYourselfInPi({ digits }) {
  const [rawInput, setRawInput] = useState('');
  const [mode, setMode] = useState('date'); // 'date' | 'number'
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState(null);

  // "3" başlangıç basamağını ayırıyoruz; arama sadece ondalık kısımda
  const decimalPart = useMemo(() => (digits ? digits.slice(1) : ''), [digits]);
  const totalDigits = decimalPart.length;

  const normalized = useMemo(() => {
    // Sadece rakamları al
    return rawInput.replace(/\D/g, '');
  }, [rawInput]);

  const placeholderForMode =
    mode === 'date' ? 'GG/AA/YYYY  (örn. 21/03/1990)' : 'Şanslı sayın  (örn. 42)';

  /**
   * Pi'de arama stratejisi:
   *  1) Önce TAM eşleşme dene
   *  2) Bulunamazsa, girdinin Pi'de geçen EN UZUN alt-dizisini bul
   *
   * Neden? 10.000 basamakta 8 haneli bir sayının bulunma olasılığı ~%0.01'dir
   * (gerçek pi-search siteleri milyarlarca basamak kullanır). Bu yüzden
   * "21031990" gibi tam tarihler nadiren bulunur ama yıl ("1990") çoğu zaman
   * bulunur. Kullanıcıya boş dönmek yerine en iyi kısmi eşleşmeyi gösteriyoruz.
   */
  const findBestMatch = (input, pool) => {
    const fullIdx = pool.indexOf(input);
    if (fullIdx !== -1) {
      return { exact: true, sub: input, index: fullIdx, subStart: 0 };
    }
    for (let len = input.length - 1; len >= 2; len--) {
      for (let s = 0; s + len <= input.length; s++) {
        const sub = input.slice(s, s + len);
        const idx = pool.indexOf(sub);
        if (idx !== -1) {
          return { exact: false, sub, index: idx, subStart: s };
        }
      }
    }
    return null;
  };

  const handleSearch = () => {
    if (!normalized || !decimalPart) return;
    setSearching(true);
    setResult(null);

    setTimeout(() => {
      const match = findBestMatch(normalized, decimalPart);
      if (!match) {
        setResult({ found: false, query: normalized });
      } else {
        const { exact, sub, index, subStart } = match;
        setResult({
          found: true,
          exact,
          query: normalized,
          sub,
          subStart,
          position: index + 1,
          contextBefore: decimalPart.slice(Math.max(0, index - 30), index),
          match: decimalPart.slice(index, index + sub.length),
          contextAfter: decimalPart.slice(index + sub.length, index + sub.length + 30),
        });
      }
      setSearching(false);
    }, 450);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <Section
      id="find-yourself"
      eyebrow="Etkinlik 01"
      title="Pi'de Kendini Bul"
      description={`Doğum tarihin ya da şanslı sayın, Pi'nin ilk ${totalDigits.toLocaleString('tr-TR')} basamağı içinde nerede gizleniyor? Sayını gir ve sonsuzlukta kendi imzanı keşfet.`}
      icon={Search}
    >
      <div className="glass-card glass-card-hover p-6 sm:p-8">
        {/* Mode seçici */}
        <div className="mb-5 inline-flex rounded-xl border border-white/10 bg-slate-950/50 p-1 text-sm">
          <button
            onClick={() => setMode('date')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 transition-all ${
              mode === 'date'
                ? 'bg-neon/20 text-neon'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="h-4 w-4" /> Tarih
          </button>
          <button
            onClick={() => setMode('number')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 transition-all ${
              mode === 'number'
                ? 'bg-neon/20 text-neon'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Hash className="h-4 w-4" /> Sayı
          </button>
        </div>

        {/* Input alanı */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              inputMode="numeric"
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={placeholderForMode}
              className="input-base pr-10"
              maxLength={20}
            />
            {rawInput && (
              <button
                onClick={() => {
                  setRawInput('');
                  setResult(null);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200"
                aria-label="Temizle"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            disabled={!normalized || searching || !digits}
            className="btn-primary whitespace-nowrap"
          >
            {searching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            {searching ? 'Aranıyor…' : "Pi'de Ara"}
          </button>
        </div>

        {normalized && (
          <div className="mt-3 text-xs text-slate-400 font-mono">
            Aranan dizi: <span className="text-neon">{normalized}</span>{' '}
            ({normalized.length} basamak)
          </div>
        )}

        {/* Sonuç */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key={result.found ? 'found' : 'not-found'}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="mt-6"
            >
              {result.found ? (
                <div
                  className={`rounded-2xl border p-5 sm:p-6 ${
                    result.exact
                      ? 'border-neon/30 bg-neon/5'
                      : 'border-gold/30 bg-gold/5'
                  }`}
                >
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-mono text-3xl sm:text-4xl text-gold gold-glow">
                      #{result.position.toLocaleString('tr-TR')}
                    </span>
                    <span className="text-slate-300">
                      basamak ile ondalıktan sonra
                      {result.exact ? ' ilk kez' : ''} geçiyor.
                    </span>
                  </div>

                  {result.exact ? (
                    <p className="mt-2 text-sm text-slate-400">
                      Pi'nin sonsuz akışında senin imzan tam burada gizliydi.
                    </p>
                  ) : (
                    <div className="mt-3 text-sm text-slate-300">
                      <p>
                        Tam dizi{' '}
                        <span className="font-mono text-amber-200">
                          {result.query}
                        </span>{' '}
                        ilk {totalDigits.toLocaleString('tr-TR')} basamakta
                        bulunamadı —{' '}
                        <span className="text-slate-400 text-xs">
                          (8 haneli bir sayı için beklenen bir durum: gerçek
                          "Pi-search" siteleri milyarlarca basamak kullanır.)
                        </span>
                      </p>
                      <p className="mt-2">
                        Ama girdinin{' '}
                        <span className="font-mono text-gold">
                          "{result.sub}"
                        </span>{' '}
                        ({result.sub.length} basamak) parçası burada geçiyor!
                      </p>
                    </div>
                  )}

                  <div className="mt-5 rounded-xl bg-slate-950/70 border border-white/10 p-4 font-mono text-sm sm:text-base leading-relaxed break-all">
                    <span className="text-slate-500">…{result.contextBefore}</span>
                    <span
                      className={`mx-0.5 rounded-md px-1 py-0.5 font-bold ${
                        result.exact
                          ? 'bg-neon/20 text-neon'
                          : 'bg-gold/20 text-gold'
                      }`}
                    >
                      {result.match}
                    </span>
                    <span className="text-slate-500">{result.contextAfter}…</span>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-5">
                  <p className="text-amber-200">
                    İlk{' '}
                    <span className="font-mono">
                      {totalDigits.toLocaleString('tr-TR')}
                    </span>{' '}
                    basamak içinde{' '}
                    <span className="font-mono text-amber-100">
                      {result.query}
                    </span>{' '}
                    veya herhangi bir alt-dizisi bulunamadı. Çok özel bir sayı
                    olabilir.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bilgi şeridi */}
        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
          <span className="chip">π · ilk {totalDigits.toLocaleString('tr-TR')} basamak</span>
          <span className="chip">Tarayıcıda BigInt ile hesaplandı</span>
          <span className="chip">Yerel arama · veri kaydedilmez</span>
        </div>
      </div>
    </Section>
  );
}
