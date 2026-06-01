import { motion } from 'framer-motion';

/**
 * Tüm etkinlik bölümleri için ortak shell.
 * Eyebrow (üst yazı), başlık, açıklama ve içerik slot'u sunar.
 */
export default function Section({
  id,
  eyebrow,
  title,
  description,
  icon: Icon,
  accent = 'neon', // 'neon' | 'gold'
  children,
}) {
  const accentClass =
    accent === 'gold'
      ? 'text-gold gold-glow'
      : 'text-neon pi-glow';

  return (
    <section id={id} className="relative py-20 sm:py-28 scroll-mt-20">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-10 text-center"
        >
          <div className="section-eyebrow inline-flex items-center gap-2">
            {Icon && <Icon className={`h-4 w-4 ${accentClass}`} />}
            {eyebrow}
          </div>
          <h2 className="section-title mt-3">{title}</h2>
          {description && (
            <p className="mx-auto mt-4 max-w-2xl text-slate-400 leading-relaxed">
              {description}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
