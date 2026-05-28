import { PageShell } from "@/components/page-shell";
import { ProgressDashboard } from "@/components/progress-dashboard";

export default function ProgressPage() {
  return (
    <PageShell>
      <div className="space-y-6">
        <header className="space-y-1">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Progress
          </p>
          <h1 className="text-2xl sm:text-3xl">進捗</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            単元ごとの「方針の正答率」を記録。直近の調子が悪い単元には「苦手」が付く。
          </p>
        </header>
        <ProgressDashboard />
      </div>
    </PageShell>
  );
}
