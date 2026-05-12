"use client";

import { useEffect } from "react";

export default function ScrollSnap() {
  useEffect(() => {
    const getSections = (): HTMLElement[] => {
      return Array.from(document.querySelectorAll<HTMLElement>("main > section"));
    };

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

    // Returns sections.length when scrolled into footer territory
    const currentIndex = (sections: HTMLElement[]): number => {
      const sy = window.scrollY;
      if (sections.length > 0) {
        const lastStart = scrollTopFor(sections[sections.length - 1]);
        if (sy > lastStart + window.innerHeight * 0.5) return sections.length;
      }
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

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scrollBehavior: ScrollBehavior = reducedMotion ? "instant" : "smooth";
    const lockMs = reducedMotion ? 100 : 1000;

    let locked = false;

    const trigger = (dir: 1 | -1) => {
      if (locked) return;
      const sections = getSections();
      const current = currentIndex(sections);

      if (current === sections.length) {
        if (dir === -1) {
          locked = true;
          window.scrollTo({ top: scrollTopFor(sections[sections.length - 1]), behavior: scrollBehavior });
          setTimeout(() => { locked = false; }, lockMs);
        }
        return;
      }

      const next = Math.max(0, Math.min(current + dir, sections.length - 1));
      if (next === current) return;
      locked = true;
      window.scrollTo({ top: scrollTopFor(sections[next]), behavior: scrollBehavior });
      setTimeout(() => { locked = false; }, lockMs);
    };

    const onWheel = (e: WheelEvent) => {
      if (locked) { e.preventDefault(); return; }
      if (isFormActive()) return;

      const raw =
        e.deltaMode === 1 ? e.deltaY * 40 :
        e.deltaMode === 2 ? e.deltaY * window.innerHeight :
        e.deltaY;

      if (Math.abs(raw) < 5) return;

      const dir = raw > 0 ? 1 : -1;
      const sections = getSections();
      const current = currentIndex(sections);

      if (current === sections.length) {
        if (dir === -1) { e.preventDefault(); trigger(dir); }
        return;
      }

      const next = Math.max(0, Math.min(current + dir, sections.length - 1));
      if (next === current) return;

      e.preventDefault();
      trigger(dir);
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
