/** Smart-TV style directional focus navigation over [data-focusable] elements. */

export type Direction = "up" | "down" | "left" | "right";

function focusables(): HTMLElement[] {
  if (typeof document === "undefined") return [];
  return Array.from(document.querySelectorAll<HTMLElement>("[data-focusable]")).filter((el) => {
    if (el.hasAttribute("disabled") || el.getAttribute("aria-hidden") === "true") return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  });
}

function center(el: Element) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2, rect: r };
}

function clearFocusOutline() {
  document.querySelectorAll("[data-focusable]").forEach((el) => {
    el.classList.remove("remote-focused");
  });
}

function setFocusOutline(el: HTMLElement) {
  clearFocusOutline();
  el.classList.add("remote-focused");
}

export function moveFocus(direction: Direction): boolean {
  const items = focusables();
  if (!items.length) return false;

  const active = document.activeElement as HTMLElement | null;
  if (!active || !items.includes(active)) {
    items[0]?.focus();
    setFocusOutline(items[0]!);
    items[0]?.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
    return true;
  }

  const from = center(active);
  let best: { el: HTMLElement; score: number } | null = null;

  for (const el of items) {
    if (el === active) continue;
    const to = center(el);
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const forward =
      direction === "left" ? -dx : direction === "right" ? dx : direction === "up" ? -dy : dy;
    if (forward <= 8) continue;
    const lateral = direction === "left" || direction === "right" ? Math.abs(dy) : Math.abs(dx);
    const score = forward + lateral * 2.2;
    if (!best || score < best.score) best = { el, score };
  }

  if (!best) return false;
  best.el.focus();
  setFocusOutline(best.el);
  best.el.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  return true;
}

export function activateFocused(): boolean {
  const active = document.activeElement as HTMLElement | null;
  if (!active || active === document.body) return false;
  active.click();
  return true;
}

export function focusFirst() {
  focusables()[0]?.focus();
}
