import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MediaRow({
  title,
  children,
  action,
  className,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  const scroller = useRef<HTMLDivElement>(null);

  const scroll = (dir: -1 | 1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <section className={cn("group/row py-5", className)} aria-label={title}>
      <div className="mb-3 flex items-center justify-between gap-4 px-4 md:px-10">
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">{title}</h2>
        <div className="flex items-center gap-2">
          {action}
          <div className="hidden gap-1 md:flex">
            <Button
              size="icon"
              variant="ghost"
              aria-label={`Scroll ${title} left`}
              onClick={() => scroll(-1)}
              className="rounded-full"
            >
              <ChevronLeft className="size-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              aria-label={`Scroll ${title} right`}
              onClick={() => scroll(1)}
              className="rounded-full"
            >
              <ChevronRight className="size-5" />
            </Button>
          </div>
        </div>
      </div>
      <div
        ref={scroller}
        className="no-scrollbar flex snap-x gap-4 overflow-x-auto scroll-smooth px-4 pb-4 md:gap-5 md:px-10"
      >
        {children}
      </div>
    </section>
  );
}
