import { motion } from 'framer-motion';
import { ArrowDown, Sparkles, Infinity as InfinityIcon } from 'lucide-react';
import PiBackgroundAnimation from './PiBackgroundAnimation.jsx';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.1, duration: 0.7, ease: 'easeOut' },
  }),
};

export default function Hero({ digits, onCtaClick }) {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[100vh] items-center justify-center overflow-hidden"
    >
      <PiBackgroundAnimation digits={digits} />

      <div className="relative z-20 mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={0}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-md"
        >
          <Sparkles className="h-3.5 w-3.5 text-gold" />
          Pi Günü Etkileşimli Keşif Platformu
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={1}
          className="font-sans text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white"
        >
          Sonsuzluğun Sayısı
          <span className="block mt-2">
            <span className="pi-glow font-mono text-neon">π</span>{' '}
            <span className="text-slate-400 font-mono text-4xl sm:text-5xl md:text-6xl">
              = 3.14159…
            </span>
          </span>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={2}
          className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300"
        >
          Pi (π), bir çemberin çevresinin çapına oranıdır. İrrasyonel ve aşkın bir
          sayı olarak basamakları{' '}
          <span className="font-mono text-neon">sonsuza kadar tekrarsız</span>{' '}
          devam eder. Bu platformda Pi'yi arayacak, deneyle hesaplayacak ve
          basamaklarını ezberleyeceksin.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={3}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <button onClick={onCtaClick} className="btn-primary">
            <InfinityIcon className="h-4 w-4" />
            Keşfetmeye Başla
          </button>
          <a href="#about-pi" className="btn-secondary">
            Pi Hakkında
          </a>
        </motion.div>

        {/* Okul projesi künyesi */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={4}
          className="mx-auto mt-12 max-w-2xl"
        >
          <div className="glass-card glass-card-hover px-6 py-5 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold">
                  Matematik Projesi
                </div>
                <div className="mt-1 text-base sm:text-lg font-semibold text-white">
                  Selim Aras OLGUN{' '}
                  <span className="text-slate-500 font-normal">&</span>{' '}
                  Uygar CANPOLAT
                </div>
              </div>
              <div className="text-xs text-slate-400 sm:text-right">
                <div>
                  <span className="text-slate-500">Ders:</span> Matematik
                </div>
                <div>
                  <span className="text-slate-500">Konu:</span> π Hakkında
                  Bilgiler ve π'nin Tarihi
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={5}
          className="mt-10 flex justify-center"
        >
          <a
            href="#find-yourself"
            className="group flex flex-col items-center gap-2 text-slate-400 hover:text-neon transition-colors"
          >
            <span className="text-xs uppercase tracking-[0.3em]">Aşağı kaydır</span>
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
