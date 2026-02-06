import { cn } from "@/lib/utils";

export function Tabs({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn("w-full", className)}>{children}</div>;
}

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-zinc-100 p-1 text-zinc-500", className)}>{children}</div>;
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    active?: boolean;
}

export function TabsTrigger({ children, className, active, ...props }: TabsTriggerProps) {
    return (
        <button
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                active ? "bg-white text-zinc-950 shadow-sm" : "hover:bg-zinc-200/50 hover:text-zinc-900",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}

export function TabsContent({ children, className, active }: { children: React.ReactNode; className?: string; active?: boolean }) {
    if (!active) return null;
    return <div className={cn("mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2", className)}>{children}</div>;
}
