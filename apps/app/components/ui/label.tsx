import { cn } from "@/lib/utils";

export function Label({ className, children }: { className?: string; children: React.ReactNode }) {
    return <label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}>{children}</label>;
}
