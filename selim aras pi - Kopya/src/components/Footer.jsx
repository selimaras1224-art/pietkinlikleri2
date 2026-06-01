import { Github, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 mt-10">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span className="font-mono text-neon pi-glow">π</span>
          <span>Pi Explorer · Sonsuzluğun Sayısı</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Heart className="h-3.5 w-3.5 text-gold" />
          Eğitim amaçlı, açık kaynaklı bir keşif uygulaması
        </div>
        <a
          href="https://github.com/"
          target="_blank"
          rel="noreferrer"
          className="text-slate-400 hover:text-neon transition-colors"
          aria-label="GitHub"
        >
          <Github className="h-5 w-5" />
        </a>
      </div>
    </footer>
  );
}
