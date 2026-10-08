import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium",
    {
        variants: {
            tone: {
                neutral: "border-rule-soft bg-surface-sunk text-ink-soft",
                go: "border-go bg-surface text-go",
                urgent: "border-urgent bg-surface text-urgent",
                pending: "border-pending bg-surface text-pending",
            },
        },
        defaultVariants: { tone: "neutral" },
    },
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLSpanElement>,
        VariantProps<typeof badgeVariants> {}

const Badge = ({ className, tone, ...props }: BadgeProps) => (
    <span className={cn(badgeVariants({ tone }), className)} {...props} />
);

// `badgeVariants` is intentionally not exported — same reason as buttonVariants.
export { Badge };
