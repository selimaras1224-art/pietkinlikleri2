import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const links = [
  { href: '#hero', label: 'Ana Sayfa' },
  { href: '#about-pi', label: 'Pi Nedir?' },
  { href: '#find-yourself', label: "Pi'de Kendini Bul" },
  { href: '#monte-carlo', label: 'Monte Carlo' },
  { href: '#memory-game', label: 'Hafıza Oyunu' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-space/80 backdrop-blur-lg border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <a href="#hero" className="flex items-center gap-2 group">
          <span className="font-mono text-2xl font-bold text-neon pi-glow group-hover:scale-110 transition-transform">
            π
          </span>
          <span className="font-semibold tracking-tight text-white">
            Pi Explorer
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:text-neon hover:bg-white/5 transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="md:hidden text-slate-200"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menü"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-space/95 backdrop-blur-lg">
          <ul className="px-6 py-3 space-y-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm text-slate-300 hover:text-neon hover:bg-white/5"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
