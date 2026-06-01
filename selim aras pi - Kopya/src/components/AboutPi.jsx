import { BookOpen, Infinity as InfinityIcon, Sigma, Compass } from 'lucide-react';
import Section from './Section.jsx';

const facts = [
  {
    icon: Compass,
    title: 'Geometrik Anlamı',
    text: 'Bir çemberin çevresinin çapına oranıdır: π = C / d. Bu oran, çemberin büyüklüğüne göre değişmez — evrensel bir sabittir.',
  },
  {
    icon: InfinityIcon,
    title: 'İrrasyonel ve Aşkın',
    text: 'İki tam sayının oranı olarak yazılamaz. Basamakları sonsuza kadar devam eder, hiçbir periyodik tekrar göstermez.',
  },
  {
    icon: Sigma,
    title: 'Matematiğin Her Yerinde',
    text: 'Trigonometri, olasılık, fizik ve karmaşık analizden Fourier dönüşümüne kadar pek çok denklemde karşımıza çıkar.',
  },
  {
    icon: BookOpen,
    title: 'Binlerce Yıllık Hikâye',
    text: 'Antik Babil ve Mısır\'dan Arşimet\'e, oradan Ramanujan\'a — Pi, matematik tarihinin en eski ve en zarif sorularından biri.',
  },
];

export default function AboutPi() {
  return (
    <Section
      id="about-pi"
      eyebrow="Tanışma"
      title="Pi (π) Nedir?"
      description="Pi sayısı, sadece bir oran değil; sonsuzluğun, evrensel düzenin ve matematiğin sembolüdür. İşte neden 4.000 yıldır insanları büyülüyor."
      icon={BookOpen}
    >
      <div className="grid sm:grid-cols-2 gap-4">
        {facts.map((f) => (
          <div
            key={f.title}
            className="glass-card glass-card-hover p-6 flex gap-4"
          >
            <div className="shrink-0">
              <div className="h-10 w-10 rounded-xl bg-neon/10 border border-neon/30 flex items-center justify-center">
                <f.icon className="h-5 w-5 text-neon" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-1 text-sm text-slate-400 leading-relaxed">
                {f.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
