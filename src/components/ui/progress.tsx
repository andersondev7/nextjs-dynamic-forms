import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max: number;
  className?: string;
  showLabel?: boolean;
}

export function Progress({
  value,
  max,
  className,
  showLabel = true,
}: ProgressProps) {
  const percentage = Math.round((value / max) * 100);

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Progresso</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
