import { cn } from "@/lib/styles";

interface LoadingIndicatorProps {
  className?: string;
  text?: string;
}

export function LoadingIndicator({
  className,
  text = "Thinking...",
}: LoadingIndicatorProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="relative h-4 w-4">
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  );
}
