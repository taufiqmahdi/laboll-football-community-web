"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export type TabItem = { id: string; label: string; icon: ReactNode; content: ReactNode };

// Accessible tabs: arrow keys / Home / End move between tabs. Panels are all
// rendered on the server and only toggled here, so switching is instant.
export default function Tabs({ items, label }: { items: TabItem[]; label: string }) {
  const [active, setActive] = useState(items[0].id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number) => {
    const next = (index + items.length) % items.length;
    setActive(items[next].id);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: items.length - 1,
    };
    if (e.key in moves) {
      e.preventDefault();
      select(moves[e.key]);
    }
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label={label}
        className="grid grid-cols-4 border-b border-slate-200 sm:flex sm:gap-1"
      >
        {items.map((tab, i) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`-mb-px flex items-center justify-center gap-2 border-b-2 px-1 py-3 text-[13px] font-semibold whitespace-nowrap transition sm:justify-start sm:px-4 sm:text-sm ${
                selected
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800"
              }`}
            >
              {/* phones: 4 equal columns without icons, so every tab is visible */}
              <span className="hidden sm:inline-flex">{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {items.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={tab.id !== active}
          tabIndex={0}
          className="pt-6 outline-none"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
