import { Label } from "@/components/ui/label";

interface SelectFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
}

export function SelectField({ id, label, value, onChange, options }: SelectFieldProps) {
    return (
        <div>
            <Label htmlFor={id} className="mb-2 block font-semibold">
                {label}
            </Label>
            <select
                id={id}
                className="h-10 w-full rounded border border-rule bg-surface px-3 text-sm text-ink"
                value={value}
                onChange={(event) => onChange(event.target.value)}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
