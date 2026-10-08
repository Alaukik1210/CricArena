import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircle2, ShieldCheck, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageShell, Section, Stat } from "@/components/ui/page-shell";
import { ApiError } from "@/lib/api";
import { useAppSelector } from "@/redux/store";
import { approveMember, fetchRooms } from "./rooms.api";

const countApproved = (members: { status: string }[] | undefined) =>
    members?.filter((member) => member.status === "APPROVED").length ?? 0;

export default function RoomsHub() {
    const user = useAppSelector((store) => store.user.user);
    const [status, setStatus] = useState("");

    const roomsQuery = useQuery({ queryKey: ["my-rooms"], queryFn: fetchRooms });
    const { refetch: refetchRooms } = roomsQuery;

    const approveMutation = useMutation({
        mutationFn: ({ roomId, memberId }: { roomId: string; memberId: string }) =>
            approveMember(roomId, memberId),
    });

    const myRooms = useMemo(
        () => (roomsQuery.data ?? []).filter((room) => room.createdByUserId === user?.id),
        [roomsQuery.data, user?.id],
    );

    const pendingApprovals = useMemo(
        () =>
            myRooms.reduce(
                (sum, room) => sum + (room.joinRequests?.filter((item) => item.status === "PENDING").length ?? 0),
                0,
            ),
        [myRooms],
    );

    const approvedPlayers = myRooms.reduce((sum, room) => sum + countApproved(room.members), 0);

    const approve = async (roomId: string, memberId: string) => {
        try {
            await approveMutation.mutateAsync({ roomId, memberId });
            setStatus("Player approved successfully.");
            await refetchRooms();
        } catch (error) {
            console.error("Failed to approve member:", error);
            // The api client folds the server message into ApiError; status 0 means no response.
            setStatus(
                error instanceof ApiError && error.status > 0 ? error.message : "Could not approve this player.",
            );
        }
    };

    const banner = status || (roomsQuery.isError ? "Could not load rooms right now." : "");

    return (
        <PageShell
            kicker="Rooms"
            title="Manage your open rooms and approvals."
            description="This page is intentionally direct: monitor your rooms, approve the right players fast, and keep game formation moving."
        >
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 xl:grid-cols-4">
                <Stat label="My Rooms" value={myRooms.length} detail="Rooms you created and currently control" />
                <Stat label="Pending Approvals" value={pendingApprovals} detail="Requests waiting on your decision" />
                <Stat label="Approved Players" value={approvedPlayers} detail="Already cleared to join" />
                <Stat label="Core Value" value="Fast Fill" detail="Less coordination lag, more actual match readiness" />
            </section>

            {banner ? (
                <div className="rounded border border-rule bg-surface px-5 py-4 text-sm text-pending md:px-6">
                    {banner}
                </div>
            ) : null}

            <Section
                kicker="Creator Control"
                title="Approve the right players quickly"
                description="You only see direct operational information here: who requested, which room they want, and the next action."
            >
                {roomsQuery.isLoading ? (
                    <div className="rounded border border-rule bg-surface p-5 text-ink-soft">Loading your rooms...</div>
                ) : myRooms.length === 0 ? (
                    <div className="rounded border border-rule bg-surface p-5 text-ink-soft">
                        You have not created any rooms yet. Open one from Discover to start building local match energy.
                    </div>
                ) : (
                    <div className="space-y-5">
                        {myRooms.map((room) => (
                            <article key={room.id} className="rounded border border-rule bg-surface p-5">
                                <div className="flex flex-col gap-4 border-b border-rule-soft pb-4 md:flex-row md:items-start md:justify-between">
                                    <div>
                                        <Badge tone="pending">{room.status}</Badge>
                                        <h3 className="mt-4 text-2xl font-body font-bold">{room.title}</h3>
                                        <p className="mt-2 text-sm text-ink-soft">
                                            {room.currentPlayers}/{room.requiredPlayers} players {"•"} {room.skillLevel || "Open"} {"•"} {room.city || "Local"}
                                        </p>
                                    </div>
                                    <div className="grid gap-2 text-sm text-ink-soft">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-pending" />
                                            <span>{room.joinRequests?.length ?? 0} total requests</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="h-4 w-4 text-go" />
                                            <span>{countApproved(room.members)} approved</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
                                    {(room.joinRequests ?? []).length === 0 ? (
                                        <div className="text-sm text-ink-soft">No pending requests for this room yet.</div>
                                    ) : (
                                        (room.joinRequests ?? []).map((request) => {
                                            const member = room.members?.find((entry) => entry.userId === request.requesterUserId);

                                            return (
                                                <div key={request.id} className="rounded border border-rule-soft bg-surface-sunk p-4">
                                                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-soft">
                                                        Pending Request
                                                    </p>
                                                    <h4 className="text-lg font-semibold text-ink">
                                                        {request.requester?.fullname || request.requesterUserId}
                                                    </h4>
                                                    <p className="mt-1 text-xs uppercase tracking-widest text-ink-soft">
                                                        {request.requester?.city
                                                            ? `${request.requester.city}, ${request.requester.state}`
                                                            : "Nearby player"}
                                                    </p>
                                                    <p className="mt-2 text-sm leading-6 text-ink-soft">
                                                        {request.message || "Interested in joining this game."}
                                                    </p>
                                                    <Button
                                                        type="button"
                                                        className="mt-4"
                                                        disabled={!member}
                                                        onClick={() => member && void approve(room.id, member.id)}
                                                    >
                                                        <CheckCircle2 />
                                                        Approve Player
                                                    </Button>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </Section>
        </PageShell>
    );
}
