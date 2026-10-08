import { useState } from "react";
import { Compass, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SKILL_OPTIONS } from "./discovery.options";
import { SelectField } from "./SelectField";
import type { AvailabilityValues } from "./discovery.types";

const DEFAULT_VALUES: AvailabilityValues = {
    skillLevel: "Intermediate",
    preferredRoles: "Batter, Fielder",
    notes: "",
};

interface AvailabilityFormProps {
    /** Lifted to the page: the radius also drives the feed query and room creation. */
    radiusKm: string;
    onRadiusChange: (radiusKm: string) => void;
    saving: boolean;
    refreshing: boolean;
    onSubmit: (values: AvailabilityValues) => void;
    onRefresh: () => void;
}

export function AvailabilityForm({
    radiusKm,
    onRadiusChange,
    saving,
    refreshing,
    onSubmit,
    onRefresh,
}: AvailabilityFormProps) {
    const [values, setValues] = useState<AvailabilityValues>(DEFAULT_VALUES);
    const patch = (next: Partial<AvailabilityValues>) => setValues((prev) => ({ ...prev, ...next }));

    return (
        <form
            className="space-y-4"
            onSubmit={(event) => {
                event.preventDefault();
                onSubmit(values);
            }}
        >
            <div className="grid gap-4 md:grid-cols-2">
                <SelectField
                    id="availability-skill"
                    label="Skill level"
                    value={values.skillLevel}
                    onChange={(skillLevel) => patch({ skillLevel })}
                    options={SKILL_OPTIONS}
                />
                <div>
                    <Label htmlFor="availability-radius" className="mb-2 block font-semibold">
                        Radius in km
                    </Label>
                    <Input
                        id="availability-radius"
                        type="number"
                        min="1"
                        max="50"
                        value={radiusKm}
                        onChange={(event) => onRadiusChange(event.target.value)}
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="availability-roles" className="mb-2 block font-semibold">
                    Preferred roles
                </Label>
                <Input
                    id="availability-roles"
                    placeholder="Batter, Bowler, Keeper"
                    value={values.preferredRoles}
                    onChange={(event) => patch({ preferredRoles: event.target.value })}
                />
            </div>

            <div>
                <Label htmlFor="availability-notes" className="mb-2 block font-semibold">
                    Quick note
                </Label>
                <Textarea
                    id="availability-notes"
                    placeholder="Weekend evenings work best. Happy to join a friendly 10-over game."
                    value={values.notes}
                    onChange={(event) => patch({ notes: event.target.value })}
                />
            </div>

            <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={saving}>
                    <Compass />
                    {saving ? "Saving..." : "Go Visible"}
                </Button>
                <Button type="button" variant="outline" onClick={onRefresh} disabled={refreshing}>
                    <Sparkles />
                    Refresh Feed
                </Button>
            </div>
        </form>
    );
}
