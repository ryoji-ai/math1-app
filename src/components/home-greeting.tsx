"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppState } from "@/lib/progress-store";

export function HomeGreeting() {
  const { state, hydrated } = useAppState();

  const totals = useMemo(() => {
    let attempts = 0;
    let correct = 0;
    for (const entry of Object.values(state.progress)) {
      attempts += entry.attempts;
      correct += entry.correct;
    }
    const rate = attempts === 0 ? null : correct / attempts;
    return { attempts, correct, rate };
  }, [state.progress]);

  return (
    <Card className="bg-gradient-to-br from-accent/40 via-card to-card">
      <CardContent className="flex flex-wrap items-center justify-between gap-4 py-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            数学I 全範囲
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl">
            「どの公式を使うか」を、見抜けるように。
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            計算の前に、まず方針を選ぶ。数と式・2次関数・三角比・データの分析を、1問ずつ身につけよう。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatBadge
            label="連続学習"
            value={hydrated ? `${state.streakDays} 日` : "—"}
          />
          <StatBadge
            label="解いた数"
            value={hydrated ? `${totals.attempts}` : "—"}
          />
          <StatBadge
            label="方針 正答率"
            value={
              hydrated && totals.rate !== null
                ? `${Math.round(totals.rate * 100)}%`
                : "—"
            }
            highlight
          />
        </div>
      </CardContent>
    </Card>
  );
}

function StatBadge({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col items-start">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <Badge
        variant={highlight ? "default" : "secondary"}
        className="mt-0.5 text-base px-3 py-1"
      >
        {value}
      </Badge>
    </div>
  );
}
