"use client";

import { useEffect } from "react";

export default function ScrollSnap() {
  useEffect(() => {
    const getSections = (): HTMLElement[] => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section"));
      const footer = document.querySelector<HTMLElement>("footer");
      return footer ? [...sections, footer] : sections;
    };

    // Compute the exact scrollY needed to bring a section to the top.
    // Mirrors Navigation.tsx's scrollToSection — the only approach that works
    // for position:sticky stacks (scrollIntoView is a no-op because the browser
    // considers a sticky element already "in view" even when hidden behind another).
    // Footer is outside <main> so its target is simply the bottom of the page.
    const scrollTopFor = (section: HTMLElement): number => {
      if (!section.closest("main")) {
        return Math.max(0, document.body.scrollHeight - window.innerHeight);
      }
      let top = 0;
      let el = section.previousElementSibling as HTMLElement | null;
      while (el) {
        top += el.offsetHeight;
        el = el.previousElementSibling as HTMLElement | null;
      }
      return top;
    };

    const currentIndex = (sections: HTMLElement[]): number => {
      const sy = window.scrollY;
      let idx = 0;
      for (let i = 0; i < sections.length; i++) {
        if (scrollTopFor(sections[i]) <= sy + 10) idx = i;
      }
      return idx;
    };

    const isFormActive = (): boolean => {
      const el = document.activeElement;
      return (
        el instanceof HTMLTextAreaElement ||
        el instanceof HTMLInputElement ||
        el instanceof HTMLSelectElement
      );
    };

    let locked = false;

    const trigger = (dir: 1 | -1) => {
      if (locked) return;
      const sections = getSections();
      const current = currentIndex(sections);
      const next = Math.max(0, Math.min(current + dir, sections.length - 1));
      if (next === current) return; // at boundary — don't lock
      locked = true;
      window.scrollTo({ top: scrollTopFor(sections[next]), behavior: "smooth" });
      setTimeout(() => { locked = false; }, 1000);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault(); // always block native scroll on this full-page layout
      if (locked) return;
      if (isFormActive()) return;

      const raw =
        e.deltaMode === 1 ? e.deltaY * 40 :
        e.deltaMode === 2 ? e.deltaY * window.innerHeight :
        e.deltaY;

      if (Math.abs(raw) < 5) return;
      trigger(raw > 0 ? 1 : -1);
    };

    let touchStartY = NaN;

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = isFormActive() ? NaN : e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (isNaN(touchStartY) || isFormActive()) return;
      const delta = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(delta) >= 50) trigger(delta > 0 ? 1 : -1);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement;
      if (active && active !== document.body && active !== document.documentElement) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); trigger(1); }
      if (e.key === "ArrowUp"   || e.key === "PageUp")   { e.preventDefault(); trigger(-1); }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return null;
}
