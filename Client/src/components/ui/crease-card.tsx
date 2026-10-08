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

        return (
            <div
                ref={ref}
                role="group"
                aria-label={`${title} — ${current} of ${required} players`}
                data-complete={complete ? "true" : "false"}
                className={cn("relative rounded bg-surface p-5", className)}
                {...props}
            >
                {/*
                  The crease. pathLength={100} normalises the rectangle's
                  perimeter to 100 units, so strokeDasharray inks exactly
                  `fill` of the border length regardless of the card's aspect
                  ratio. A conic-gradient border-image would ink by ANGLE
                  instead, which is not proportional on a non-square card, and
                  would also ignore the corner radius.
                  strokeWidth 2 with the rect on the viewport edge leaves a
                  crisp 1px visible after the SVG clips the outer half.
                */}
                <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
                    <rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        rx="3"
                        fill="none"
                        stroke="var(--rule-soft)"
                        strokeWidth="2"
                    />
                    <rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        rx="3"
                        fill="none"
                        stroke="var(--rule)"
                        strokeWidth="2"
                        pathLength={100}
                        strokeDasharray={`${(fill * 100).toFixed(2)} 100`}
                        data-testid="crease-stroke"
                    />
                </svg>

                <div className="relative">
                    <h3 className="font-display text-xl uppercase leading-none tracking-wide text-ink">{title}</h3>
                    <p className="mt-2 text-sm text-ink-soft">{meta}</p>
                    <p className="mt-3 font-data text-sm text-ink">
                        {current}/{required}
                        <span className="ml-2 text-ink-soft">
                            {complete ? "full" : `${required - current} needed`}
                        </span>
                    </p>
                    {children}
                </div>
            </div>
        );
    },
);
CreaseCard.displayName = "CreaseCard";
