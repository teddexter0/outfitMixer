import { cn } from '@/lib/utils';

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'w-5 h-5 rounded-full border-2 border-surface-3 border-t-accent animate-spin',
        className
      )}
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner className="w-8 h-8" />
    </div>
  );
}
