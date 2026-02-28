"use client";

import { useMemo, useState } from "react";
import { AddTab } from "@/components/tabs/add-tab";
import type { TabKey } from "@/lib/types";

const TABS: { key: TabKey; label: string }[] = [
  { key: "home", label: "Home" },
  { key: "add", label: "Add" },
  { key: "study", label: "Study" },
  { key: "wordbook", label: "Wordbook" },
  { key: "stats", label: "Stats" },
];

function Placeholder({ title, desc }: { title: string; desc: string }) {
  return (
    <section className="rounded-card bg-cream p-5">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted">{desc}</p>
    </section>
  );
}

export function AppShell() {
  const [activeTab, setActiveTab] = useState<TabKey>("add");

  const body = useMemo(() => {
    if (activeTab === "add") return <AddTab />;
    if (activeTab === "home") return <Placeholder title="Home" desc="오늘 복습 카드, 학습 시간, 연속 학습 표시" />;
    if (activeTab === "study") return <Placeholder title="Study" desc="FSRS 카드 학습(phrase + word) 화면 예정" />;
    if (activeTab === "wordbook") return <Placeholder title="Wordbook" desc="단어/구문 목록, 수동 단어 추가, IPA 확인 화면 예정" />;
    return <Placeholder title="Stats" desc="월간 캘린더와 학습 로그 화면 예정" />;
  }, [activeTab]);

  return (
    <div className="mx-auto min-h-dvh w-full max-w-md px-4 pb-24 pt-6">
      <header className="mb-4 rounded-card bg-lime px-5 py-4">
        <h1 className="text-xl font-bold">English Memo</h1>
        <p className="mt-1 text-sm">구문 반복 학습 + 단어 카드</p>
      </header>

      <main>{body}</main>

      <nav className="fixed bottom-0 left-0 right-0 mx-auto flex w-full max-w-md gap-2 border-t border-black/10 bg-cream px-3 py-3">
        {TABS.map((tab) => {
          const active = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 rounded-xl px-2 py-2 text-xs ${active ? "bg-lime font-semibold" : "bg-transparent text-muted"}`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
