import * as React from "react";
import { cn } from "@/lib/utils";

/** Fraction of the crease to ink, clamped to 0-1. Returns 0 when `required` is 0. */
// creaseFill must be exported (tests and Task 10 reuse it) and stays beside the component it drives.
// eslint-disable-next-line react-refresh/only-export-components
export function creaseFill(current: number, required: number): number {
    if (!Number.isFinite(current) || !Number.isFinite(required) || required <= 0) return 0;
    if (current <= 0) return 0;
    if (current >= required) return 1;
    return current / required;
}

export interface CreaseCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    meta: string;
    current: number;
    required: number;
}

export const CreaseCard = React.forwardRef<HTMLDivElement, CreaseCardProps>(
    ({ title, meta, current, required, className, children, ...props }, ref) => {
        const fill = creaseFill(current, required);
        const complete = fill === 1;
        const degrees = fill * 360;

        return (
            <div
                ref={ref}
                role="group"
                aria-label={`${title} — ${current} of ${required} players`}
                data-complete={complete ? "true" : "false"}
                className={cn("relative bg-surface p-5", className)}
                style={{
                    border: "1px solid transparent",
                    borderImageSlice: 1,
                    borderImageSource: `conic-gradient(from 0deg, var(--rule) 0deg ${degrees}deg, transparent ${degrees}deg 360deg)`,
                }}
                {...props}
            >
                <h3 className="font-display text-xl uppercase leading-none tracking-wide text-ink">{title}</h3>
                <p className="mt-2 text-sm text-ink-soft">{meta}</p>
                <p className="mt-3 font-data text-sm text-ink">
                    {current}/{required}
                    <span className="ml-2 text-ink-soft">{complete ? "full" : `${required - current} needed`}</span>
                </p>
                {children}
            </div>
        );
    },
);
CreaseCard.displayName = "CreaseCard";
