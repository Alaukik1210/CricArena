import { useState } from "react";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SKILL_OPTIONS } from "./discovery.options";
import { SelectField } from "./SelectField";
import type { RoomFormValues } from "./discovery.types";

const DEFAULT_VALUES: RoomFormValues = {
    title: "",
    description: "",
    requiredPlayers: "10",
    skillLevel: "Intermediate",
    teamMode: "SINGLE_GROUP",
    matchDate: "",
    contactMode: "WHATSAPP_CONSENT",
};

const CONTACT_OPTIONS = [
    { value: "IN_APP", label: "In app" },
    { value: "WHATSAPP_CONSENT", label: "WhatsApp after consent" },
    { value: "PHONE_CONSENT", label: "Phone after consent" },
];

interface CreateRoomFormProps {
    creating: boolean;
    /** Resolves true when the room was created, so the form can reset. */
    onSubmit: (values: RoomFormValues) => Promise<boolean>;
}

export function CreateRoomForm({ creating, onSubmit }: CreateRoomFormProps) {
    const [values, setValues] = useState<RoomFormValues>(DEFAULT_VALUES);
    const patch = (next: Partial<RoomFormValues>) => setValues((prev) => ({ ...prev, ...next }));

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (await onSubmit(values)) setValues(DEFAULT_VALUES);
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
                <Label htmlFor="room-title" className="mb-2 block font-semibold">
                    Room title
                </Label>
                <Input
                    id="room-title"
                    placeholder="Friday Night 10-over game"
                    value={values.title}
                    onChange={(event) => patch({ title: event.target.value })}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <Label htmlFor="room-players" className="mb-2 block font-semibold">
                        Required players
                    </Label>
                    <Input
                        id="room-players"
                        type="number"
                        min="2"
                        max="22"
                        value={values.requiredPlayers}
                        onChange={(event) => patch({ requiredPlayers: event.target.value })}
                    />
                </div>
                <div>
                    <Label htmlFor="room-date" className="mb-2 block font-semibold">
                        Match date
                    </Label>
                    <Input
                        id="room-date"
                        type="datetime-local"
                        value={values.matchDate}
                        onChange={(event) => patch({ matchDate: event.target.value })}
                    />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <SelectField
                    id="room-skill"
                    label="Skill level"
                    value={values.skillLevel}
                    onChange={(skillLevel) => patch({ skillLevel })}
                    options={SKILL_OPTIONS}
                />
                <SelectField
                    id="room-contact"
                    label="Contact mode"
                    value={values.contactMode}
                    onChange={(contactMode) => patch({ contactMode })}
                    options={CONTACT_OPTIONS}
                />
            </div>

            <div>
                <Label htmlFor="room-description" className="mb-2 block font-semibold">
                    What should players know?
                </Label>
                <Textarea
                    id="room-description"
                    placeholder="Friendly but serious. Need 2 bowlers and 1 keeper. Match fee split equally."
                    value={values.description}
                    onChange={(event) => patch({ description: event.target.value })}
                />
            </div>

            <Button type="submit" disabled={creating}>
                <Users />
                {creating ? "Creating..." : "Create Room"}
            </Button>
        </form>
    );
}
