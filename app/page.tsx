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
  const [menuOpen, setMenuOpen] = useState(false);
  const [videoBase, setVideoBase] = useState(82);

  // Состояния для интерактивного блока материала (мышь и касание)
  const [loupe, setLoupe] = useState({ active: false, x: 50, y: 50 });

  const updateLoupe = (clientX: number, clientY: number, el: HTMLDivElement) => {
    const rect = el.getBoundingClientRect();
    const x = Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 0), 100);
    const y = Math.min(Math.max(((clientY - rect.top) / rect.height) * 100, 0), 100);
    setLoupe({ active: true, x, y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    updateLoupe(e.clientX, e.clientY, e.currentTarget);
  };

  const handleTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0];
    if (t) updateLoupe(t.clientX, t.clientY, e.currentTarget);
  };

  // Управление видео
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Анимация нити лекала
  const pathRef = useRef<SVGPathElement | null>(null);
  const [dotState, setDotState] = useState({ x: 60, y: 0, opacity: 1 });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 250);

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const progress = Math.min(Math.max(scrollY / 220, 0), 1);
      setScrollProgress(progress);
    };

    // На телефоне видео шире, чтобы не быть узкой полоской
    const handleResize = () => {
      setVideoBase(window.innerWidth < 640 ? 92 : 82);
      if (window.innerWidth >= 768) setMenuOpen(false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    handleScroll();
    handleResize();

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
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

  const videoWidth = videoBase + scrollProgress * (100 - videoBase);

  const navLinks = [
    { href: "#material", label: "Материал" },
    { href: "#collection", label: "Коллекция" },
    { href: "#essence", label: "Уникальность" },
  ];

  return (
    <main
      className={`${cormorant.variable} ${inter.variable} min-h-[220vh] overflow-x-hidden bg-[#080808] text-[#F2EFE9] selection:bg-[#E5B84B] selection:text-[#080808]`}
    >
      {/* 1. Меню */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#080808]/85 backdrop-blur-md">
        <div className="mx-auto grid h-14 sm:h-16 max-w-[1200px] grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 md:px-10 font-sans text-[11px] uppercase tracking-[0.22em] text-[#A39E93]">
          {/* Десктоп-навигация */}
          <nav className="hidden md:flex items-center justify-start gap-7">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-[#F2EFE9] transition-colors">
                {l.label}
              </a>
            ))}
          </nav>

          {/* Мобильная кнопка меню */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-10 w-10 -ml-2 items-center justify-center text-[#F2EFE9] cursor-pointer"
            >
              {menuOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
                  <line x1="5" y1="5" x2="19" y2="19" />
                  <line x1="19" y1="5" x2="5" y2="19" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
                  <line x1="4" y1="8" x2="20" y2="8" />
                  <line x1="4" y1="16" x2="14" y2="16" />
                </svg>
              )}
            </button>
          </div>

          <div className="flex justify-center">
            <a
              href="#"
              className="font-serif text-xl sm:text-2xl italic font-medium tracking-[0.06em] text-[#F2EFE9] normal-case whitespace-nowrap"
            >
              Gioni &amp; Co
            </a>
          </div>

          <div className="flex items-center justify-end gap-3 sm:gap-6 whitespace-nowrap" style={{ textTransform: "uppercase" }}>
            <div className="hidden sm:flex items-center gap-2 cursor-pointer hover:text-[#F2EFE9] transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span className="hidden lg:inline text-[10px]">Русский язык</span>
            </div>

            <button
              aria-label="Личный кабинет"
              className="group flex h-10 w-8 sm:w-auto items-center justify-center gap-1.5 text-[#A39E93] hover:text-[#F2EFE9] transition-colors cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <circle cx="12" cy="8" r="4" />
                <path d="M5 20c1.5-3.5 4.2-5 7-5s5.5 1.5 7 5" />
              </svg>
              <span className="hidden lg:inline text-[10px]">ЛИЧНЫЙ КАБИНЕТ</span>
            </button>

            <button
              aria-label="Корзина"
              className="group relative flex h-10 w-8 sm:w-auto items-center justify-center gap-1.5 text-[#A39E93] hover:text-[#F2EFE9] transition-colors cursor-pointer"
            >
              <div className="relative flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M6 7h12l1 13H5L6 7z" />
                  <path d="M9 7V5a3 3 0 0 1 6 0v2" />
                </svg>
                <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-[#E5B84B]" />
              </div>
              <span className="hidden lg:inline text-[10px]">КОРЗИНА</span>
            </button>
          </div>
        </div>

        {/* Выпадающее мобильное меню */}
        <div
          className={`md:hidden overflow-hidden border-white/10 bg-[#080808]/95 backdrop-blur-md transition-[max-height,border-color] duration-500 ease-out ${
            menuOpen ? "max-h-[320px] border-t" : "max-h-0 border-t-0"
          }`}
        >
          <nav className="flex flex-col px-6 py-4 font-sans text-[12px] uppercase tracking-[0.25em] text-[#A39E93]">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="py-4 border-b border-white/5 last:border-b-0 hover:text-[#F2EFE9] transition-colors"
              >
                {l.label}
              </a>
            ))}
            <div className="flex items-center gap-2 pt-4 text-[10px] sm:hidden">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              Русский язык
            </div>
          </nav>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-20 sm:pt-24 pb-6 sm:pb-10 flex flex-col items-center">
        <div
          style={{
            width: `${videoWidth}%`,
            transition: "width 70ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
          className="relative h-[68svh] sm:h-[78vh] overflow-hidden bg-[#111111]"
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

          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 text-center pointer-events-none">
            <div className="overflow-hidden py-3 px-2 sm:px-6">
              <h1
                className={`font-serif italic text-[52px] min-[400px]:text-6xl sm:text-8xl md:text-[140px] lg:text-[165px] leading-none font-normal tracking-[0.03em] text-[#F2EFE9] whitespace-nowrap ${
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
              className={`mt-4 sm:mt-6 font-sans text-[11px] sm:text-base md:text-lg uppercase tracking-[0.22em] sm:tracking-[0.36em] text-[#E5B84B] ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{
                transition: "opacity 1.8s ease-in-out 1.4s, transform 1.8s ease-out 1.4s",
              }}
            >
              Архитектура твоего силуэта
            </p>
          </div>

          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 flex items-center gap-3">
            <button
              onClick={togglePlay}
              aria-label="Пауза"
              className="flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-[#F2EFE9]/80 backdrop-blur-sm hover:border-[#E5B84B] transition-all cursor-pointer"
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
              className="flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-[#F2EFE9]/80 backdrop-blur-sm hover:border-[#E5B84B] transition-all cursor-pointer"
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

      {/* 3. Редакционный блок "Материя и Каркас" */}
      <section id="material" className="relative mx-auto max-w-[1100px] px-5 sm:px-6 md:px-12 pt-4 pb-14 md:pb-16 scroll-mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="lg:col-span-6">
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setLoupe((l) => ({ ...l, active: false }))}
              onTouchStart={handleTouch}
              onTouchMove={handleTouch}
              onTouchEnd={() => setLoupe((l) => ({ ...l, active: false }))}
              className="relative h-[280px] sm:h-[400px] w-full overflow-hidden cursor-crosshair bg-[#0A0A0A] touch-pan-y"
            >
              <img
                src="/fabrics11.jpg"
                alt="Мерсеризованный хлопок высшей крутки"
                className="h-full w-full object-cover opacity-90 transition-transform duration-1000 ease-out hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]/30 pointer-events-none" />
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                  opacity: loupe.active ? 1 : 0,
                  backgroundImage: `url('/fabrics11.jpg')`,
                  backgroundPosition: `${loupe.x}% ${loupe.y}%`,
                  backgroundSize: "220%",
                  clipPath: `circle(60px at ${loupe.x}% ${loupe.y}%)`,
                }}
              />
              {loupe.active && (
                <div
                  className="pointer-events-none absolute h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25"
                  style={{ left: `${loupe.x}%`, top: `${loupe.y}%` }}
                />
              )}
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 font-sans text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#6E6A63]">
              <span>Fig. 01 — Мерсеризованный хлопок</span>
              <span className="hidden sm:inline">240 g/m²</span>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-[#7A756D]">
              01 / Материя и Каркас
            </span>
            <h2 className="mt-4 sm:mt-5 font-serif text-[28px] sm:text-4xl font-light text-[#F2EFE9] leading-[1.15]">
              Сухой хруст <span className="italic text-[#E5B84B]">хлопка</span> и архитектурная тишина шва.
            </h2>
            <p className="mt-4 sm:mt-5 max-w-[420px] font-sans text-xs leading-[1.8] text-[#9E998F] font-light">
              Плотный мерсеризованный хлопок с матовой поверхностью. Ткань сама держит линию плеча, без жёстких прокладок.
            </p>

            <dl className="mt-7 sm:mt-8 grid grid-cols-3 gap-3 sm:gap-6 font-sans text-[10px] tracking-[0.12em] sm:tracking-[0.16em]">
              <div>
                <dt className="uppercase text-[#6E6A63]">Сырьё</dt>
                <dd className="mt-1.5 text-[#D8D3C8]">Extra-Long Staple</dd>
              </div>
              <div>
                <dt className="uppercase text-[#6E6A63]">Плотность</dt>
                <dd className="mt-1.5 text-[#D8D3C8]">240 г/м²</dd>
              </div>
              <div>
                <dt className="uppercase text-[#6E6A63]">Крой</dt>
                <dd className="mt-1.5 text-[#D8D3C8]">Смещённое плечо</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* 4. Каталог коллекции */}
      <section id="collection" className="relative w-full scroll-mt-16">
        <div className="text-center py-14 md:py-16 px-6">
          <span className="font-sans text-[10px] uppercase tracking-[0.35em] text-[#7A756D]">
            02 / Коллекция Силуэтов
          </span>
          <h2 className="mt-3 font-serif italic text-3xl sm:text-5xl font-light text-[#F2EFE9]">
            Архитектура базовой формы
          </h2>
        </div>

        {[
          {
            title: "The Evening Contour Tee",
            tag: "HOLIDAY 2026",
            desc: "Чёткая линия плеча и мягкое облегание в талии. Футболка для вечера, которая держит форму без лишних деталей.",
            image: "/tee-evening.png",
          },
          {
            title: "The Everyday Architectural Tee",
            tag: "HOLIDAY 2026",
            desc: "Плотный хлопок 240 г/м² и свободная геометрия кроя для каждого дня: ткань сама держит силуэт.",
            image: "/tee-casual.png",
          },
          {
            title: "The Lounge Silence Jersey",
            tag: "HOLIDAY 2026",
            desc: "Мягкий джерси с расслабленной посадкой. Тишина шва и спокойный силуэт для дома и отдыха.",
            image: "/tee-lounge.png",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="group grid grid-cols-1 md:grid-cols-2 md:min-h-[90vh]"
          >
            {/* Панель с текстом (на десктопе ещё и с маленьким фото) */}
            <div
              className={`order-2 flex flex-col items-center justify-center px-6 sm:px-8 py-12 md:py-16 bg-[#080808] text-center ${
                idx % 2 === 1 ? "md:order-2" : "md:order-1"
              }`}
            >
              <div className="hidden md:block w-[240px] aspect-[3/4] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                />
              </div>

              <span className="md:mt-10 font-sans text-[10px] uppercase tracking-[0.3em] text-[#7A756D]">
                {item.tag}
              </span>
              <h3 className="mt-3 font-serif text-[28px] sm:text-4xl font-light text-[#F2EFE9] leading-tight">
                {item.title}
              </h3>
              <p className="mt-4 sm:mt-5 max-w-[340px] font-sans text-xs sm:text-sm leading-[1.8] text-[#9E998F] font-light">
                {item.desc}
              </p>

              <a
                href="#"
                className="mt-8 md:mt-10 py-2 font-serif italic text-lg text-[#E5B84B] hover:text-[#f3c759] transition-colors"
              >
                – Смотреть –
              </a>
            </div>

            {/* Большое фото (на мобильном идёт первым) */}
            <div
              className={`order-1 relative h-[58svh] md:h-auto overflow-hidden bg-[#080808] ${
                idx % 2 === 1 ? "md:order-1" : "md:order-2"
              }`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-[1200ms] ease-out"
              />
            </div>
          </div>
        ))}
      </section>

      {/* 5. Уникальность бренда */}
      <section id="essence" className="relative mx-auto max-w-[1280px] px-5 sm:px-6 py-16 md:py-32 border-t border-white/10 scroll-mt-16">
        <div className="text-center mb-10 md:mb-20">
          <span className="font-sans text-[10px] uppercase tracking-[0.35em] text-[#7A756D]">
            03 / Уникальность системы
          </span>
          <h2 className="mt-3 font-serif italic text-3xl sm:text-5xl font-light text-[#F2EFE9]">
            К вашим услугам
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Точный подбор размера по замерам",
              icon: (
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.1" className="text-[#D8D3C8] group-hover:text-[#E5B84B] transition-colors duration-500">
                  <path d="M14 44C14 34 26 34 34 26C42 18 38 12 46 12C51 12 54 16 50 22C44 31 28 31 20 42C17 46 14 48 14 44Z" />
                  <path d="M22 36L25 39M28 31L31 34M34 25L37 28M40 19L43 22" strokeLinecap="round" />
                  <circle cx="46" cy="16" r="1.5" fill="currentColor" />
                  <path d="M12 50H52" strokeDasharray="2 3" strokeOpacity="0.4" />
                </svg>
              ),
            },
            {
              title: "Парфюм под ваш сезон и повод",
              icon: (
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.1" className="text-[#D8D3C8] group-hover:text-[#E5B84B] transition-colors duration-500">
                  <rect x="20" y="24" width="24" height="28" rx="1" />
                  <rect x="25" y="29" width="14" height="16" strokeOpacity="0.5" />
                  <path d="M28 24V19H36V24" />
                  <rect x="26" y="13" width="12" height="6" />
                  <path d="M32 19V28" strokeDasharray="1.5 2" strokeOpacity="0.6" />
                </svg>
              ),
            },
            {
              title: "Инженерный крой и плотность ткани",
              icon: (
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.1" className="text-[#D8D3C8] group-hover:text-[#E5B84B] transition-colors duration-500">
                  <path d="M16 20H48M16 32H48M16 44H48" strokeOpacity="0.45" />
                  <path d="M20 16V48M32 16V48M44 16V48" strokeOpacity="0.45" />
                  <rect x="18" y="18" width="28" height="28" />
                  <path d="M26 16V48M38 16V48" strokeDasharray="3 3" />
                </svg>
              ),
            },
            {
              title: "Именная нашивка владельца",
              icon: (
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.1" className="text-[#D8D3C8] group-hover:text-[#E5B84B] transition-colors duration-500">
                  <rect x="14" y="22" width="36" height="20" />
                  <path d="M14 25L11 22M14 39L11 42M50 25L53 22M50 39L53 42" strokeLinecap="round" />
                  <path d="M22 30H42" />
                  <path d="M26 35H38" strokeOpacity="0.6" />
                </svg>
              ),
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col items-center justify-between px-6 py-8 sm:py-6 text-center cursor-pointer border-t border-white/10 first:border-t-0 sm:border-t-0"
            >
              {idx !== 0 && (
                <div className="hidden lg:flex flex-col items-center justify-between absolute left-0 top-2 bottom-2 w-[1px]">
                  <span className="h-1.5 w-[1px] bg-white/30" />
                  <span className="flex-grow w-[1px] bg-white/10 my-1.5" />
                  <span className="h-1.5 w-[1px] bg-white/30" />
                </div>
              )}

              <div className="h-20 flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-1">
                {item.icon}
              </div>

              <h3 className="mt-5 sm:mt-6 font-serif text-xl font-light text-[#F2EFE9] leading-snug max-w-[240px] sm:max-w-[210px] group-hover:text-white transition-colors">
                {item.title}
              </h3>

              <span className="mt-6 sm:mt-8 font-serif italic text-sm tracking-[0.06em] text-[#E5B84B]/85 group-hover:text-[#E5B84B] transition-colors">
                – Узнать больше –
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 5.1. CTA-блок: подбор посадки */}
      <section className="group relative w-full h-[75svh] sm:h-[80vh] min-h-[520px] overflow-hidden">
        <img
          src="/fabrics11.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-[1600ms] ease-out"
        />

        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(8,8,8,0.85)_0%,rgba(8,8,8,0)_15%,rgba(8,8,8,0)_85%,rgba(8,8,8,0.85)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,8,8,0.5)_0%,rgba(8,8,8,0)_65%)]" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 sm:px-6 text-center">
          <span className="font-sans text-[10px] uppercase tracking-[0.35em] text-[#D8D3C8]">
            Персональный сервис
          </span>

          <h2 className="mt-5 sm:mt-6 max-w-3xl font-serif italic text-[34px] leading-[1.15] sm:text-5xl md:text-6xl font-light text-[#F2EFE9] drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)]">
            Определите свой силуэт и ольфакторный код
          </h2>

          <p className="mt-5 sm:mt-6 max-w-md font-sans text-xs leading-[1.8] text-[#E4DFD3] font-light">
            Короткий опросник для точного подбора размера, сезона и повода.
          </p>

          <div className="mt-9 sm:mt-12 flex flex-col items-center gap-5 sm:gap-6">
            <button className="group/btn flex items-center gap-3 sm:gap-4 border border-[#E5B84B] px-7 sm:px-10 py-4 font-sans text-[11px] uppercase tracking-[0.22em] sm:tracking-[0.3em] text-[#F2EFE9] hover:bg-[#E5B84B] hover:text-[#080808] transition-colors duration-500 cursor-pointer">
              Подобрать посадку
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                className="shrink-0 group-hover/btn:translate-x-1 transition-transform duration-500"
              >
                <line x1="4" y1="12" x2="20" y2="12" />
                <polyline points="13 5 20 12 13 19" />
              </svg>
            </button>

            <a
              href="#contacts"
              className="font-serif italic text-base text-[#D8D3C8] hover:text-white transition-colors border-b border-white/30 hover:border-white pb-0.5"
            >
              Консультация стилиста
            </a>
          </div>
        </div>
      </section>

      {/* 5.2. Лента-журнал: Выбор стилистов */}
      <section className="relative border-t border-white/10 py-14 md:py-24 overflow-hidden">
        <style>{`
          @keyframes ribbon-right {
            from { transform: translateX(-50%); }
            to   { transform: translateX(0); }
          }
          .ribbon-track { animation: ribbon-right 110s linear infinite; }
          .ribbon:hover .ribbon-track,
          .ribbon:active .ribbon-track { animation-play-state: paused; }
          @media (max-width: 639px) {
            .ribbon-track { animation-duration: 90s; }
          }
          @media (prefers-reduced-motion: reduce) {
            .ribbon-track { animation: none; }
          }
        `}</style>

        {/* Заголовок */}
        <div className="mx-auto max-w-[900px] px-5 sm:px-6 mb-9 md:mb-16 text-center">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.35em] text-[#7A756D]">
            04 / Выбор стилистов · Holiday 2026
          </span>
          <h2 className="mt-4 sm:mt-5 font-serif italic text-[34px] sm:text-5xl md:text-6xl font-light leading-[1.1] text-[#F2EFE9]">
            Не знаете, с чем сочетать?
          </h2>
          <p className="mt-3 sm:mt-4 font-serif text-lg sm:text-2xl font-light text-[#E5B84B]">
            Взгляните на подборку стилистов на этот сезон
          </p>
        </div>

        {/* Лента */}
        <div className="ribbon relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 sm:w-40 bg-gradient-to-r from-[#080808] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 sm:w-40 bg-gradient-to-l from-[#080808] to-transparent" />

          <div className="ribbon-track flex w-max">
            {[0, 1, 2, 3, 4, 5].map((copy) => (
              <div key={copy} className="flex gap-4 sm:gap-6 pr-4 sm:pr-6" aria-hidden={copy !== 0}>
                {[
                  { title: "The Evening Monochrome", tag: "Evening", image: "/tee-evening.png", pos: "50% 30%" },
                  { title: "The Architectural Everyday", tag: "City Rhythm", image: "/tee-casual.png", pos: "50% 30%" },
                  { title: "Тишина шва", tag: "Detail", image: "/tee-evening.png", pos: "50% 80%" },
                  { title: "Плотность 240", tag: "Fabric", image: "/tee-casual.png", pos: "50% 75%" },
                ].map((card, i) => (
                  <a
                    key={i}
                    href="#"
                    tabIndex={copy !== 0 ? -1 : undefined}
                    className="group relative block w-[220px] sm:w-[320px] lg:w-[380px] shrink-0"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-[#0A0A0A] border border-white/10">
                      <img
                        src={card.image}
                        alt={card.title}
                        style={{ objectPosition: card.pos }}
                        className="h-full w-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/85 via-transparent to-[#080808]/30" />

                      <span className="absolute top-3 left-3 sm:top-4 sm:left-4 font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#F2EFE9]/80">
                        № {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="absolute top-3 right-3 sm:top-4 sm:right-4 font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#E5B84B]">
                        {card.tag}
                      </span>
                      <h3 className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 font-serif italic text-xl sm:text-3xl leading-tight text-[#F2EFE9]">
                        {card.title}
                      </h3>
                    </div>
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Премиальный футер */}
      <footer id="contacts" className="w-full bg-[#12100E] text-[#E8E2D5] border-t border-white/10 pt-14 md:pt-20 pb-10 md:pb-12">
        <div className="mx-auto max-w-[1300px] px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 md:pb-16 border-b border-white/10">
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
                    className="w-full bg-transparent font-sans text-base sm:text-sm text-[#F2EFE9] placeholder-[#7A756D] focus:outline-none"
                  />
                  <button aria-label="Отправить" className="p-1 text-[#A39E93] hover:text-[#E5B84B] transition-colors cursor-pointer">
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

            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-10 font-sans text-xs">
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

              <div className="flex flex-col gap-4 col-span-2 sm:col-span-1">
                <span className="font-serif italic text-base text-[#E5B84B] mb-2">Правовая информация</span>
                <a href="#" className="text-[#A39E93] hover:text-[#F2EFE9] transition-colors">Условия продажи</a>
                <a href="#" className="text-[#A39E93] hover:text-[#F2EFE9] transition-colors">Конфиденциальность</a>
                <a href="#" className="text-[#A39E93] hover:text-[#F2EFE9] transition-colors">Комплаенс</a>
              </div>
            </div>
          </div>

          {/* Нижняя строка: на мобильном по центру в столбик, с md — три колонки */}
          <div className="mt-10 md:mt-12 grid grid-cols-1 md:grid-cols-3 items-center gap-6 font-sans text-[11px] text-[#A39E93]">
            <div className="order-2 md:order-1 flex items-center gap-2.5 cursor-pointer hover:text-[#F2EFE9] transition-colors justify-center md:justify-start">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>Русский язык</span>
            </div>

            <div className="order-1 md:order-2 flex justify-center">
              <a href="#" className="font-serif italic text-2xl md:text-xl tracking-[0.08em] text-[#F2EFE9]">Gioni &amp; Co</a>
            </div>

            <div className="order-3 flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-3 uppercase tracking-[0.2em] text-[10px]">
              <a href="#" className="py-1 hover:text-[#F2EFE9] transition-colors">Telegram</a>
              <a href="#" className="py-1 hover:text-[#F2EFE9] transition-colors">Instagram</a>
              <a href="#" className="py-1 hover:text-[#F2EFE9] transition-colors">TikTok</a>
              <a href="#" className="py-1 hover:text-[#F2EFE9] transition-colors">WhatsApp</a>
            </div>
          </div>

          {/* Копирайт */}
          <div className="mt-8 md:mt-10 pt-6 border-t border-white/5 text-center font-sans text-[10px] leading-relaxed text-[#7A756D] tracking-wider">
            Gioni &amp; Co 2026 | <a href="#" className="underline hover:text-[#F2EFE9]">Гарантия подлинности</a> | Официальный онлайн-бутик
          </div>
        </div>
      </footer>
    </main>
  );
}