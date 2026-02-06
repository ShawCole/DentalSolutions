import { cn } from "@/lib/utils";

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    valueDisplay?: string | number;
}

export function Slider({ className, label, valueDisplay, ...props }: SliderProps) {
    return (
        <div className={className}>
            <div className="flex items-center justify-between mb-2">
                {label && <span className="text-sm font-medium text-zinc-900">{label}</span>}
                {valueDisplay !== undefined && <span className="text-sm text-zinc-500">{valueDisplay}</span>}
            </div>
            <input
                type="range"
                className={cn(
                    "h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-200 accent-zinc-900",
                    // Standard range input styling
                    className
                )}
                {...props}
            />
        </div>
    );
}
