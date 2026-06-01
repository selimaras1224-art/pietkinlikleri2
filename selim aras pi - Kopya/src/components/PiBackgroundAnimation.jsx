import { useMemo } from 'react';

/**
 * Hero arka planında yavaşça kayan, hafif saydam Pi basamakları sütunları.
 * Salt CSS animasyonu (Tailwind keyframes) ile çalışır.
 */
export default function PiBackgroundAnimation({ digits }) {
  // Basamakları çok uzun bir string'e bölmek yerine, dikey kayan sütunlar üretiyoruz.
  const columns = useMemo(() => {
    if (!digits) return [];
    const colCount = 12;
    const chunkSize = Math.max(120, Math.floor(digits.length / colCount));
    return Array.from({ length: colCount }, (_, i) => {
      const start = (i * chunkSize) % Math.max(1, digits.length - chunkSize);
      const slice = digits.slice(start, start + chunkSize);
      // Sonsuz görünmesi için kendi içinde tekrar et
      return slice + slice;
    });
  }, [digits]);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Üst ve alt gradient maskeleri, kenarların yumuşaması için */}
      <div className="absolute inset-0 bg-gradient-to-b from-space via-transparent to-space z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-space via-transparent to-space z-10" />

      <div className="absolute inset-0 grid grid-cols-6 md:grid-cols-12 gap-2 px-2 opacity-[0.10]">
        {columns.map((col, idx) => (
          <div key={idx} className="overflow-hidden h-full">
            <div
              className="font-mono text-[11px] md:text-sm leading-relaxed text-neon whitespace-pre-wrap break-all animate-scroll-digits"
              style={{
                animationDuration: `${40 + (idx % 5) * 12}s`,
                animationDelay: `${idx * -3}s`,
              }}
            >
              {col.split('').map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
