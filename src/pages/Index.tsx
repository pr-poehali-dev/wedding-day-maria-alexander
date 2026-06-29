import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { toast } from '@/hooks/use-toast';

const RSVP_URL = 'https://functions.poehali.dev/a460a939-d04f-44b4-8430-eafecc41020f';

const PHOTO_HERO =
  'https://s6.iimage.su/s/29/gXZGA2yx6PhcbyR1SC04lz7OKokZ0gf6IBueRujkZ.jpg';
const PHOTO_TIMING =
  'https://s6.iimage.su/s/29/grqmSfex9THM8o6cqi7zDgGuYOGPmSYnIF3Lg1nNN.jpg';
const PHOTO_DRESS =
  'https://s6.iimage.su/s/29/gpJmjeUxN7MG8rvJOjuvRjRc2KeH2ZeTy74ySpLnK.jpg';
const PHOTO_GROOM =
  'https://i127.fastpic.org/thumb/2026/0630/5f/4e626b67d505e3cf5cc4e3f69fb66a5f.jpeg';
const PHOTO_BRIDE =
  'https://iili.io/C5VYQj9.md.jpg';

const WEDDING_DATE = new Date('2026-08-29T14:00:00');

const palette = [
  { name: 'Пудрово-розовый', color: '#E8C5C5' },
  { name: 'Нежный персиковый', color: '#F3D2BC' },
  { name: 'Нежно-розовый', color: '#F6DCDC' },
  { name: 'Кремовый', color: '#F7EEE2' },
  { name: 'Шампань', color: '#EAD9BE' },
  { name: 'Чайная роза', color: '#D9A38E' },
];

const timeline = [
  { time: '14:00', title: 'Сбор гостей и фуршет', note: 'Шампанское ждёт — знакомимся и улыбаемся' },
  { time: '15:00', title: 'Свадебная церемония', note: 'Две судьбы соединились навсегда' },
  { time: '15:30', title: 'Свадебный банкет', note: 'За стол! За любовь! За молодых!' },
  { time: '22:00', title: 'Окончание вечера', note: 'Вечер заканчивается, а счастье — никогда' },
];

const drinks = ['Белое вино', 'Красное вино', 'Виски', 'Водка'];

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in-view');
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function useCountdown(target: Date) {
  const [left, setLeft] = useState(() => target.getTime() - Date.now());
  useEffect(() => {
    const t = setInterval(() => setLeft(target.getTime() - Date.now()), 1000);
    return () => clearInterval(t);
  }, [target]);
  const clamp = Math.max(0, left);
  return {
    days: Math.floor(clamp / 86400000),
    hours: Math.floor((clamp / 3600000) % 24),
    minutes: Math.floor((clamp / 60000) % 60),
    seconds: Math.floor((clamp / 1000) % 60),
  };
}

const Index = () => {
  const [name, setName] = useState('');
  const [count, setCount] = useState('');
  const [drink, setDrink] = useState('');
  const cd = useCountdown(WEDDING_DATE);

  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !count || !drink) {
      toast({ title: 'Заполните все поля', description: 'Имя, количество гостей и напиток' });
      return;
    }
    setSending(true);
    try {
      const res = await fetch(RSVP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, count, drink }),
      });
      if (res.ok) {
        toast({ title: 'Спасибо!', description: 'Ваше присутствие подтверждено ❤' });
        setName('');
        setCount('');
        setDrink('');
      } else {
        toast({ title: 'Ошибка', description: 'Попробуйте ещё раз или свяжитесь с нами' });
      }
    } catch {
      toast({ title: 'Ошибка сети', description: 'Проверьте интернет-соединение' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6">
        <img
          src={PHOTO_HERO}
          alt="Александр и Мария"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-background" />
        <div className="relative z-10 text-white">
          <p className="font-sans tracking-luxe text-xs sm:text-sm uppercase mb-6 animate-fade-in">
            Свадьба
          </p>
          <h1 className="font-display font-light text-6xl sm:text-8xl md:text-[9rem] leading-none animate-scale-in">
            Александр
            <span className="block font-display italic text-4xl sm:text-6xl md:text-7xl my-2 opacity-90">
              &amp;
            </span>
            Мария
          </h1>
          <div className="w-24 h-px bg-white/70 mx-auto my-8" />
          <p className="font-display text-2xl sm:text-3xl tracking-wide">29 . 08 . 2026</p>
          <p className="font-sans text-sm sm:text-base mt-6 opacity-90 max-w-md mx-auto">
            Наш день. Наша любовь. Наша семья
          </p>
        </div>
        <div className="absolute bottom-8 z-10 text-white/80 animate-bounce">
          <Icon name="ChevronDown" size={28} />
        </div>
      </section>

      {/* ДЕТАЛИ */}
      <section className="py-24 sm:py-32 px-6 text-center">
        <Reveal>
          <p className="font-sans tracking-luxe text-xs uppercase text-primary mb-5">Детали события</p>
          <h2 className="font-display font-light text-4xl sm:text-6xl mb-12">Где и когда</h2>
          <div className="max-w-xl mx-auto space-y-8">
            <div>
              <Icon name="Calendar" className="mx-auto text-primary mb-3" size={28} />
              <p className="font-display text-3xl">29 августа 2026</p>
              <p className="text-muted-foreground mt-1">суббота</p>
            </div>
            <div className="w-16 h-px bg-border mx-auto" />
            <div>
              <Icon name="MapPin" className="mx-auto text-primary mb-3" size={28} />
              <p className="font-display text-3xl">Усадьба «Подгорье»</p>
              <p className="text-muted-foreground mt-2 leading-relaxed">
                Московская область, село Михалёво,<br />
                Советская улица, 56А
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ТАЙМИНГ ДНЯ */}
      <section className="py-24 sm:py-32 bg-secondary/40">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <Reveal>
              <div className="overflow-hidden rounded-sm shadow-xl">
                <img src={PHOTO_TIMING} alt="Тайминг дня" className="w-full h-full object-cover aspect-[4/5]" />
              </div>
            </Reveal>
            <Reveal delay={120}>
              <p className="font-sans tracking-luxe text-xs uppercase text-primary mb-5">Тайминг дня</p>
              <h2 className="font-display font-light text-4xl sm:text-6xl mb-10">Программа</h2>
              <div className="space-y-8">
                {timeline.map((item) => (
                  <div key={item.time} className="flex gap-5">
                    <span className="font-display text-2xl text-primary w-20 shrink-0">{item.time}</span>
                    <div>
                      <p className="font-medium text-lg">{item.title}</p>
                      <p className="text-sm text-muted-foreground italic mt-0.5">{item.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ДРЕСС-КОД */}
      <section className="py-24 sm:py-32">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <Reveal className="md:order-2">
              <div className="overflow-hidden rounded-sm shadow-xl">
                <img src={PHOTO_DRESS} alt="Дресс-код" className="w-full h-full object-cover aspect-[4/5]" />
              </div>
            </Reveal>
            <Reveal delay={120} className="md:order-1">
              <p className="font-sans tracking-luxe text-xs uppercase text-primary mb-5">Дресс-код</p>
              <h2 className="font-display font-light text-4xl sm:text-6xl mb-6">Цветовая гамма</h2>
              <p className="text-muted-foreground mb-10 max-w-md leading-relaxed">
                Будем благодарны, если вы поддержите палитру нашего торжества в нарядах.
              </p>
              <div className="flex flex-wrap gap-5">
                {palette.map((c) => (
                  <span
                    key={c.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-md ring-1 ring-black/5"
                    style={{ backgroundColor: c.color }}
                  />
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section className="py-24 sm:py-32 bg-secondary/40">
        <div className="container max-w-xl text-center">
          <Reveal>
            <p className="font-sans tracking-luxe text-xs uppercase text-primary mb-5">Подтверждение</p>
            <h2 className="font-display font-light text-4xl sm:text-6xl mb-4">Будете с нами?</h2>
            <p className="text-muted-foreground mb-10">
              Пожалуйста, подтвердите присутствие до 1 августа
            </p>
            <form onSubmit={submit} className="space-y-6 text-left">
              <div>
                <Label htmlFor="name" className="text-sm">Ваше имя</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Имя и фамилия"
                  className="mt-2 bg-background"
                />
              </div>
              <div>
                <Label htmlFor="count" className="text-sm">Количество человек</Label>
                <Input
                  id="count"
                  type="number"
                  min={1}
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  placeholder="1"
                  className="mt-2 bg-background"
                />
              </div>
              <div>
                <Label className="text-sm mb-2 block">Предпочтения по напиткам</Label>
                <div className="grid grid-cols-2 gap-3">
                  {drinks.map((d) => (
                    <button
                      type="button"
                      key={d}
                      onClick={() => setDrink(d)}
                      className={`py-3 rounded-md border text-sm transition-colors ${
                        drink === d
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background border-border hover:border-primary'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <Button type="submit" disabled={sending} className="w-full py-6 text-base">
                {sending ? 'Отправляем...' : 'Подтвердить присутствие'}
              </Button>
            </form>
          </Reveal>
        </div>
      </section>

      {/* FAQ / КОНТАКТЫ */}
      <section className="py-24 sm:py-32">
        <div className="container max-w-3xl">
          <Reveal>
            <div className="text-center mb-14">
              <p className="font-sans tracking-luxe text-xs uppercase text-primary mb-5">Вопросы и контакты</p>
              <h2 className="font-display font-light text-4xl sm:text-6xl">FAQ</h2>
            </div>
            <Accordion type="single" collapsible className="mb-16">
              <AccordionItem value="q1">
                <AccordionTrigger className="font-display text-xl">Можно ли прийти с детьми?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Конечно! Будем рады видеть всю вашу семью. Укажите количество гостей в форме.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2">
                <AccordionTrigger className="font-display text-xl">Будет ли парковка?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Да, на территории усадьбы «Подгорье» есть бесплатная парковка для гостей.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3">
                <AccordionTrigger className="font-display text-xl">Когда нужно подтвердить участие?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Пожалуйста, заполните форму до 1 августа 2026 года.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-10">
            <Reveal>
              <div className="text-center">
                <div className="w-40 h-40 mx-auto rounded-full overflow-hidden shadow-lg mb-5 ring-1 ring-black/5">
                  <img src={PHOTO_GROOM} alt="Александр" className="w-full h-full object-cover" />
                </div>
                <p className="font-display text-2xl">Александр</p>
                <p className="text-muted-foreground text-sm mb-3">Жених</p>
                <a href="tel:+79851197228" className="inline-flex items-center gap-2 text-primary hover:underline">
                  <Icon name="Phone" size={16} />
                  +7-985-119-72-28
                </a>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="text-center">
                <div className="w-40 h-40 mx-auto rounded-full overflow-hidden shadow-lg mb-5 ring-1 ring-black/5">
                  <img src={PHOTO_BRIDE} alt="Мария" className="w-full h-full object-cover" />
                </div>
                <p className="font-display text-2xl">Мария</p>
                <p className="text-muted-foreground text-sm mb-3">Невеста</p>
                <a href="tel:+79771173479" className="inline-flex items-center gap-2 text-primary hover:underline">
                  <Icon name="Phone" size={16} />
                  +7-977-117-34-79
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ТАЙМЕР */}
      <section className="py-24 sm:py-32 bg-primary text-primary-foreground text-center px-6">
        <Reveal>
          <p className="font-sans tracking-luxe text-xs uppercase mb-5 opacity-80">До свадьбы осталось</p>
          <h2 className="font-display italic font-light text-4xl sm:text-5xl mb-12">Считаем дни вместе</h2>
          <div className="flex justify-center gap-5 sm:gap-12">
            {[
              { v: cd.days, l: 'дней' },
              { v: cd.hours, l: 'часов' },
              { v: cd.minutes, l: 'минут' },
              { v: cd.seconds, l: 'секунд' },
            ].map((u) => (
              <div key={u.l}>
                <div className="font-display text-5xl sm:text-7xl tabular-nums">
                  {String(u.v).padStart(2, '0')}
                </div>
                <div className="text-xs sm:text-sm uppercase tracking-widest mt-2 opacity-80">{u.l}</div>
              </div>
            ))}
          </div>
          <div className="w-24 h-px bg-primary-foreground/40 mx-auto mt-16 mb-6" />
          <p className="font-display text-2xl">Александр &amp; Мария · 2026</p>
        </Reveal>
      </section>
    </div>
  );
};

export default Index;