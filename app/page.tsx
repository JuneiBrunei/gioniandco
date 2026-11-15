"use client";

import React, { useEffect, useState, useRef } from "react";
import { Cormorant_Garamond, Inter } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400"],
  variable: "--font-sans",
});

export default function HomePage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Состояния для интерактивного блока материала
  const [loupe, setLoupe] = useState({ active: false, x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLoupe({ active: true, x, y });
  };
  
  // Управление видео
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Анимация нити лекала
  const pathRef = useRef<SVGPathElement | null>(null);
  const [dotState, setDotState] = useState({ x: 60, y: 0, opacity: 1 });

  // Интерактивный кластер уникальности (Mind Map)
  const [activeEssence, setActiveEssence] = useState(0);
  const essenceNodes = [
    {
      id: 0,
      title: "Персонализация",
      subtitle: "Индивидуальные лекала",
      desc: "Создание изделия по вашим параметрам с адаптацией под динамику силуэта.",
      position: "top-2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    },
    {
      id: 1,
      title: "Индекс посадки",
      subtitle: "Закрытый опросник",
      desc: "Инженерный тест для точного определения вашей идеальной формы и плотности.",
      position: "top-1/2 left-2 -translate-y-1/2 -translate-x-0",
    },
    {
      id: 2,
      title: "Парфюм",
      subtitle: "Ольфакторный код",
      desc: "Фирменный древесно-амбровый шлейф, сопровождающий каждую ткань.",
      position: "top-1/2 right-2 -translate-y-1/2 translate-x-0",
    },
    {
      id: 3,
      title: "Архитектурный бокс",
      subtitle: "Ритуал владения",
      desc: "Плотная матовая коробка ручной сборки с защитной герметизацией.",
      position: "bottom-2 left-1/2 -translate-x-1/2 translate-y-1/2",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 250);

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const progress = Math.min(Math.max(scrollY / 220, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;
    const duration = 3400;

    const animateDot = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) % duration;
      const t = elapsed / duration;
      const easedT = -(Math.cos(Math.PI * t) - 1) / 2;

      if (pathRef.current) {
        const pathLength = pathRef.current.getTotalLength();
        const point = pathRef.current.getPointAtLength(easedT * pathLength);

        let opacity = 1;
        if (t < 0.12) opacity = t / 0.12;
        else if (t > 0.85) opacity = (1 - t) / 0.15;

        setDotState({ x: point.x, y: point.y, opacity });
      }

      animationFrameId = requestAnimationFrame(animateDot);
    };

    animationFrameId = requestAnimationFrame(animateDot);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const videoWidth = 82 + scrollProgress * 18;

  return (
    <main
      className={`${cormorant.variable} ${inter.variable} min-h-[220vh] bg-[#080808] text-[#F2EFE9] selection:bg-[#E5B84B] selection:text-[#080808]`}
    >
      {/* 1. Меню */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#080808]/85 backdrop-blur-md">
        <div className="mx-auto grid h-16 max-w-[1200px] grid-cols-3 items-center px-6 md:px-10 font-sans text-[11px] uppercase tracking-[0.22em] text-[#A39E93]">
          <nav className="hidden md:flex items-center justify-start gap-7">
            <a href="#material" className="hover:text-[#F2EFE9] transition-colors">
              Материал
            </a>
            <a href="#collection" className="hover:text-[#F2EFE9] transition-colors">
              Коллекция
            </a>
            <a href="#essence" className="hover:text-[#F2EFE9] transition-colors">
              Уникальность
            </a>
          </nav>

          <div className="flex md:hidden items-center">
            <span className="text-[10px] tracking-[0.25em] text-[#F2EFE9]">Меню</span>
          </div>

          <div className="flex justify-center">
            <a
              href="#"
              className="font-serif text-2xl italic font-medium tracking-[0.06em] text-[#F2EFE9] normal-case"
            >
              Gioni &amp; Co
            </a>
          </div>

          {/* Правая часть: текст написан капслоком и защищен от переносов */}
          <div className="flex items-center justify-end gap-5 sm:gap-6 whitespace-nowrap" style={{ textTransform: 'uppercase' }}>
            <div className="flex items-center gap-2 cursor-pointer hover:text-[#F2EFE9] transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span className="hidden sm:inline text-[10px]">Русский язык</span>
            </div>

            <button
              aria-label="Личный кабинет"
              className="group flex items-center gap-1.5 text-[#A39E93] hover:text-[#F2EFE9] transition-colors cursor-pointer"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <circle cx="12" cy="8" r="4" />
                <path d="M5 20c1.5-3.5 4.2-5 7-5s5.5 1.5 7 5" />
              </svg>
              <span className="hidden sm:inline text-[10px]">ЛИЧНЫЙ КАБИНЕТ</span>
            </button>

            <button
              aria-label="Корзина"
              className="group relative flex items-center gap-1.5 text-[#A39E93] hover:text-[#F2EFE9] transition-colors cursor-pointer"
            >
              <div className="relative flex items-center justify-center">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M6 7h12l1 13H5L6 7z" />
                  <path d="M9 7V5a3 3 0 0 1 6 0v2" />
                </svg>
                <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-[#E5B84B]" />
              </div>
              <span className="hidden sm:inline text-[10px]">КОРЗИНА</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-24 pb-10 flex flex-col items-center">
        <div
          style={{
            width: `${videoWidth}%`,
            transition: "width 70ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
          className="relative h-[78vh] overflow-hidden bg-[#111111]"
        >
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            className="h-full w-full object-cover opacity-75 scale-[1.02]"
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-black/30 to-black/40 pointer-events-none" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center pointer-events-none">
            <div className="overflow-hidden py-3 px-6">
              <h1
                className={`font-serif italic text-7xl sm:text-9xl md:text-[165px] leading-none font-normal tracking-[0.03em] text-[#F2EFE9] ${
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{
                  clipPath: isLoaded ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                  transition: "clip-path 2.2s linear, opacity 1.1s ease-out, transform 1.8s ease-out",
                }}
              >
                Gioni &amp; Co
              </h1>
            </div>

            <p
              className={`mt-6 font-sans text-sm sm:text-base md:text-lg uppercase tracking-[0.36em] text-[#E5B84B] ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{
                transition: "opacity 1.8s ease-in-out 1.4s, transform 1.8s ease-out 1.4s",
              }}
            >
              Архитектура твоего силуэта
            </p>
          </div>

          <div className="absolute bottom-6 right-6 z-30 flex items-center gap-3">
            <button
              onClick={togglePlay}
              aria-label="Пауза"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-[#F2EFE9]/80 backdrop-blur-sm hover:border-[#E5B84B] transition-all cursor-pointer"
            >
              {isPlaying ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="3.5" height="16" /><rect x="14.5" y="4" width="3.5" height="16" /></svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,4 20,12 6,20" /></svg>
              )}
            </button>
            <button
              onClick={toggleMute}
              aria-label="Звук"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-[#F2EFE9]/80 backdrop-blur-sm hover:border-[#E5B84B] transition-all cursor-pointer"
            >
              {isMuted ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>
              )}
            </button>
          </div>
        </div>

        {/* Траектория нити */}
        <div className="relative -mt-4 z-20 flex flex-col items-center pointer-events-none">
          <svg width="100" height="110" viewBox="0 0 120 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
            <path ref={pathRef} d="M 60 0 C 88 35, 32 85, 60 125" stroke="rgba(242, 239, 233, 0.25)" strokeWidth="1" />
            <circle cx={dotState.x} cy={dotState.y} r="6" fill="rgba(229, 184, 75, 0.28)" style={{ opacity: dotState.opacity }} />
            <circle cx={dotState.x} cy={dotState.y} r="2.5" fill="#E5B84B" style={{ opacity: dotState.opacity }} />
          </svg>
        </div>
      </section>

      {/* 3. Редакционный блок "Материя и Каркас" (использует fabrics.jpg) */}
      <section id="material" className="relative mx-auto max-w-[1280px] px-6 md:px-12 pt-8 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-7">
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setLoupe({ ...loupe, active: false })}
              className="relative h-[480px] sm:h-[620px] w-full overflow-hidden cursor-crosshair bg-[#0A0A0A]"
            >
              <img src="/fabrics.jpg" alt="Мерсеризованный хлопок высшей крутки" className="h-full w-full object-cover opacity-90 transition-transform duration-1000 ease-out hover:scale-[1.02]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]/30 pointer-events-none" />
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                  opacity: loupe.active ? 1 : 0,
                  backgroundImage: `url('/fabrics.jpg')`,
                  backgroundPosition: `${loupe.x}% ${loupe.y}%`,
                  backgroundSize: "220%",
                  clipPath: `circle(90px at ${loupe.x}% ${loupe.y}%)`,
                }}
              />
              {loupe.active && (
                <div className="pointer-events-none absolute h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25" style={{ left: `${loupe.x}%`, top: `${loupe.y}%` }} />
              )}
            </div>

            <div className="mt-3 flex items-center justify-between font-sans text-[10px] uppercase tracking-[0.28em] text-[#6E6A63]">
              <span>Fig. 01 — Длинноволокнистый мерсеризованный хлопок</span>
              <span className="hidden sm:inline">240 g/m²</span>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="font-sans text-[10px] uppercase tracking-[0.35em] text-[#7A756D]">
              01 / Материя и Каркас
            </span>
            <h2 className="mt-5 font-serif text-4xl sm:text-5xl font-light text-[#F2EFE9] leading-[1.12]">
              Сухой хруст <span className="italic text-[#E5B84B]">хлопка</span> и архитектурная тишина шва.
            </h2>
            <p className="mt-6 font-sans text-xs sm:text-sm leading-[1.8] text-[#9E998F] font-light">
              Мы используем мерсеризованное полотно высокой крутки с глубоким матовым поглощением света. Плотная структура волокна позволяет выстраивать чёткую геометрию плеча без жёстких дублирующих прокладок — ткань сама держит силуэт.
            </p>
            <dl className="mt-10 pt-6 border-t border-white/10 space-y-3 font-sans text-[11px] tracking-[0.18em]">
              <div className="flex justify-between"><dt className="uppercase text-[#6E6A63]">Сырьё</dt><dd className="text-[#D8D3C8]">Extra-Long Staple Cotton</dd></div>
              <div className="flex justify-between"><dt className="uppercase text-[#6E6A63]">Плотность</dt><dd className="text-[#D8D3C8]">240 г/м² · Двойная крутка</dd></div>
              <div className="flex justify-between"><dt className="uppercase text-[#6E6A63]">Конструкция</dt><dd className="text-[#D8D3C8]">Смещённый плечевой баланс</dd></div>
            </dl>
          </div>

        </div>
      </section>

      {/* 4. Каталог коллекции */}
      <section id="collection" className="relative mx-auto max-w-[1280px] px-6 py-28 md:py-20">
        <div className="text-center mb-16">
          <span className="font-sans text-[10px] uppercase tracking-[0.35em] text-[#7A756D]">
            02 / Коллекция Силуэтов
          </span>
          <h2 className="mt-3 font-serif italic text-3xl sm:text-5xl font-light text-[#F2EFE9]">
            Архитектура базовой формы
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {[
            {
              title: "The Evening Contour Tee",
              tag: "HOLIDAY 2026",
              target: "— Вечерний силуэт —",
              image: "/tee-evening.png",
            },
            {
              title: "The Everyday Architectural Tee",
              tag: "HOLIDAY 2026",
              target: "— Повседневный баланс —",
              image: "/tee-casual.png",
            },
            {
              title: "The Lounge Silence Jersey",
              tag: "HOLIDAY 2026",
              target: "— Абсолютный комфорт —",
              image: "/tee-lounge.png",
            },
          ].map((item, idx) => (
            <div key={idx} className="group cursor-pointer flex flex-col">
              <div className="relative h-[480px] sm:h-[540px] w-full overflow-hidden bg-[#0C0C0C] border border-white/10">
                <img src={item.image} alt={item.title} className="h-full w-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/70 via-transparent to-transparent pointer-events-none" />
              </div>
              <div className="mt-6 text-center flex flex-col items-center">
                <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#7A756D]">{item.tag}</span>
                <h3 className="mt-2 font-serif italic text-2xl sm:text-3xl font-light text-[#F2EFE9] group-hover:text-[#E5B84B] transition-colors">{item.title}</h3>
                <span className="mt-2 font-sans text-[11px] uppercase tracking-[0.25em] text-[#A39E93]">{item.target}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Уникальность бренда (Крупные фото, минимум текста) */}
      <section id="essence" className="relative mx-auto max-w-[1280px] px-6 py-28 md:py-36 border-t border-white/10">
        <div className="text-center mb-20">
          <span className="font-sans text-[10px] uppercase tracking-[0.35em] text-[#7A756D]">
            03 / Уникальность системы
          </span>
          <h2 className="mt-3 font-serif italic text-3xl sm:text-5xl font-light text-[#F2EFE9]">
            Персональный код владения
          </h2>
          <p className="mt-3 font-sans text-xs text-[#A39E93] tracking-[0.2em] uppercase font-light">
            Интерактивная матрица индивидуального опыта
          </p>
        </div>

        {/* 4 колонки с акцентом на крупные фото и лаконичный текст */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              num: "01",
              title: "Подбор размера",
              desc: "Анализируем ваши замеры для точного определения идеальной посадки.",
              image: "/fabrics.jpg",
            },
            {
              num: "02",
              title: "Ольфакторный код",
              desc: "Селективный аромат к заказу — под сезон и повод из вашей анкеты.",
              image: "/tee-evening.png",
            },
            {
              num: "03",
              title: "Материя и крой",
              desc: "Инженерный подбор плотности полотна и выверенные пропорции.",
              image: "/tee-casual.png",
            },
            {
              num: "04",
              title: "Именная нашивка",
              desc: "Внутренний эксклюзивный штрих с вашими именем и фамилией.",
              image: "/tee-lounge.png",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col justify-between overflow-hidden border border-white/10 bg-[#0A0A0A] transition-all duration-700 hover:border-[#E5B84B]/40 hover:-translate-y-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            >
              {/* Крупное фото (высота увеличена до h-72) */}
              <div className="relative h-72 w-full overflow-hidden bg-[#050505]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover opacity-85 transition-transform duration-1000 ease-out group-hover:scale-110 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/20 to-transparent" />
                
                <div className="absolute top-4 left-4">
                  <span className="font-serif italic text-base text-[#E5B84B] bg-black/60 px-3.5 py-1 border border-white/10 backdrop-blur-md">
                    {item.num}
                  </span>
                </div>
              </div>

              {/* Короткое текстовое наполнение */}
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="font-serif italic text-2xl font-light text-[#F2EFE9] group-hover:text-[#E5B84B] transition-colors duration-300">
                    {item.title}
                  </h3>
                  
                  <p className="mt-2.5 font-sans text-xs text-[#8C877D] font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Анимированная золотая полоса снизу */}
                <div className="mt-6 h-[1px] w-full bg-white/10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#E5B84B] -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Премиальный футер (логотип строго по центру сетки) */}
      <footer id="contacts" className="w-full bg-[#12100E] text-[#E8E2D5] border-t border-white/10 pt-20 pb-12">
        <div className="mx-auto max-w-[1300px] px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
            
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <h3 className="font-serif italic text-3xl sm:text-4xl font-light text-[#F2EFE9]">
                  Подпишитесь на рассылку
                </h3>
                <p className="mt-3 font-sans text-xs text-[#A39E93] leading-relaxed max-w-sm">
                  Откройте для себя закрытый мир Gioni &amp; Co, первыми узнавайте о новых силуэтах, лимитированных тканях и событиях дома.
                </p>
              </div>

              <div className="mt-8">
                <div className="relative flex items-center border-b border-white/30 pb-2 focus-within:border-[#E5B84B] transition-colors">
                  <input
                    type="email"
                    placeholder="Ваш электронный адрес"
                    className="w-full bg-transparent font-sans text-sm text-[#F2EFE9] placeholder-[#7A756D] focus:outline-none"
                  />
                  <button aria-label="Отправить" className="text-[#A39E93] hover:text-[#E5B84B] transition-colors cursor-pointer">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </div>
                <p className="mt-4 font-sans text-[10px] text-[#7A756D] leading-normal">
                  Я подтверждаю, что мой адрес электронной почты будет обработан Gioni &amp; Co в соответствии с положениями{" "}
                  <a href="#" className="underline hover:text-[#F2EFE9]">Политики конфиденциальности</a>.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8 font-sans text-xs">
              <div className="flex flex-col gap-4">
                <span className="font-serif italic text-base text-[#E5B84B] mb-2">Клиентский сервис</span>
                <a href="#contacts" className="text-[#A39E93] hover:text-[#F2EFE9] transition-colors">Контакты</a>
                <a href="#" className="text-[#A39E93] hover:text-[#F2EFE9] transition-colors">Вопросы и ответы</a>
                <a href="#" className="text-[#A39E93] hover:text-[#F2EFE9] transition-colors">Ваш заказ</a>
                <a href="#" className="text-[#A39E93] hover:text-[#F2EFE9] transition-colors">Доставка и возврат</a>
              </div>

              <div className="flex flex-col gap-4">
                <span className="font-serif italic text-base text-[#E5B84B] mb-2">Система Gioni</span>
                <a href="#essence" className="text-[#A39E93] hover:text-[#F2EFE9] transition-colors">Персонализация</a>
                <a href="#essence" className="text-[#A39E93] hover:text-[#F2EFE9] transition-colors">Индекс посадки</a>
                <a href="#material" className="text-[#A39E93] hover:text-[#F2EFE9] transition-colors">Текстиль и крой</a>
              </div>

              <div className="flex flex-col gap-4">
                <span className="font-serif italic text-base text-[#E5B84B] mb-2">Правовая информация</span>
                <a href="#" className="text-[#A39E93] hover:text-[#F2EFE9] transition-colors">Условия продажи</a>
                <a href="#" className="text-[#A39E93] hover:text-[#F2EFE9] transition-colors">Конфиденциальность</a>
                <a href="#" className="text-[#A39E93] hover:text-[#F2EFE9] transition-colors">Комплаенс</a>
              </div>
            </div>
          </div>

          {/* Нижняя строка: грид на 3 колонки (язык слева, ровно по центру логотип, соцсети справа) */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 items-center gap-6 font-sans text-[11px] text-[#A39E93]">
            <div className="flex items-center gap-2.5 cursor-pointer hover:text-[#F2EFE9] transition-colors justify-start">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>Русский язык</span>
            </div>

            <div className="flex justify-center">
              <a href="#" className="font-serif italic text-xl tracking-[0.08em] text-[#F2EFE9]">Gioni &amp; Co</a>
            </div>

            <div className="flex items-center justify-end gap-6 uppercase tracking-[0.2em] text-[10px]">
              <a href="#" className="hover:text-[#F2EFE9] transition-colors">Telegram</a>
              <a href="#" className="hover:text-[#F2EFE9] transition-colors">Instagram</a>
              <a href="#" className="hover:text-[#F2EFE9] transition-colors">TikTok</a>
              <a href="#" className="hover:text-[#F2EFE9] transition-colors">WhatsApp</a>
            </div>
          </div>

          {/* Копирайт */}
          <div className="mt-10 pt-6 border-t border-white/5 text-center font-sans text-[10px] text-[#7A756D] tracking-wider">
            Gioni &amp; Co 2026 | <a href="#" className="underline hover:text-[#F2EFE9]">Гарантия подлинности</a> | Официальный онлайн-бутик
          </div>
        </div>
      </footer>
    </main>
  );
}