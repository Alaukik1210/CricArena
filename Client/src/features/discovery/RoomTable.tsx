import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/ui/data-table";
import type { PlayRoomSummary } from "./discovery.types";

interface RoomTableProps {
    rooms: PlayRoomSummary[];
    loading: boolean;
    onJoin: (roomId: string) => void;
}

export function RoomTable({ rooms, loading, onJoin }: RoomTableProps) {
    const columns: Column<PlayRoomSummary>[] = [
        {
            key: "title",
            header: "Room",
            render: (r) => (
                <div>
                    <p className="font-medium text-ink">{r.title}</p>
                    <p className="text-xs text-ink-soft">{r.teamMode?.replace(/_/g, " ") || "Single Group"}</p>
                    {r.description ? <p className="mt-1 max-w-xs text-xs text-ink-soft">{r.description}</p> : null}
                </div>
            ),
        },
        {
            key: "dist",
            header: "Dist",
            align: "right",
            numeric: true,
            // distanceKm is absent entirely when the caller sent no coordinates.
            render: (r) => (r.distanceKm == null ? "-" : `${r.distanceKm.toFixed(1)}km`),
        },
        {
            key: "spots",
            header: "Spots",
            align: "right",
            numeric: true,
            render: (r) =>
                r.currentPlayers >= r.requiredPlayers ? "full" : `${r.currentPlayers}/${r.requiredPlayers}`,
        },
        { key: "skill", header: "Skill", render: (r) => r.skillLevel ?? "mixed" },
        {
            key: "when",
            header: "When",
            render: (r) => (r.matchDate ? new Date(r.matchDate).toLocaleString() : "flexible"),
        },
        {
            key: "action",
            header: "",
            align: "right",
            render: (r) => (
                <Button type="button" variant="outline" size="sm" onClick={() => onJoin(r.id)}>
                    Request to Join
                </Button>
            ),
        },
    ];

    return (
        <DataTable
            columns={columns}
            rows={rooms}
            getRowId={(r) => r.id}
            loading={loading}
            emptyMessage="No rooms in range. Widen your radius, or start one."
        />
    );
}
