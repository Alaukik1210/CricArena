import axios from "axios";
import { CheckCircle2, ShieldCheck, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { ProductShell, SectionBlock, MetricCard } from "./ProductShell";
import { PLAY_ROOMS_API_END_POINT } from "@/utils/constants";

export default function RoomsHub() {
  const { user } = useSelector((store) => store.user);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  const loadRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(PLAY_ROOMS_API_END_POINT);
      setRooms(response.data.rooms || []);
    } catch (error) {
      console.error("Failed to load rooms:", error);
      setStatus("Could not load rooms right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const myRooms = useMemo(
    () => rooms.filter((room) => room.createdByUserId === user?.id),
    [rooms, user?.id],
  );

  const pendingApprovals = useMemo(
    () =>
      myRooms.reduce((sum, room) => sum + (room.joinRequests?.filter((item) => item.status === "PENDING").length || 0), 0),
    [myRooms],
  );

  const approveMember = async (roomId, memberId) => {
    try {
      await axios.post(`${PLAY_ROOMS_API_END_POINT}/${roomId}/members/${memberId}/approve`);
      setStatus("Player approved successfully.");
      await loadRooms();
    } catch (error) {
      console.error("Failed to approve member:", error);
      setStatus(error.response?.data?.message || "Could not approve this player.");
    }
  };

  return (
    <ProductShell
      kicker="Rooms"
      title="Manage your open rooms and approvals."
      description="This page is intentionally direct: monitor your rooms, approve the right players fast, and keep game formation moving."
    >
      <section className="product-grid-4">
        <MetricCard label="My Rooms" value={`${myRooms.length}`} detail="Rooms you created and currently control" />
        <MetricCard label="Pending Approvals" value={`${pendingApprovals}`} detail="Requests waiting on your decision" />
        <MetricCard label="Approved Players" value={`${myRooms.reduce((sum, room) => sum + (room.members?.filter((member) => member.status === "APPROVED").length || 0), 0)}`} detail="Already cleared to join" />
        <MetricCard label="Core Value" value="Fast Fill" detail="Less coordination lag, more actual match readiness" />
      </section>

      {status ? <div className="product-panel px-5 py-4 text-sm text-[#f0ddb0] md:px-6">{status}</div> : null}

      <SectionBlock
        kicker="Creator Control"
        title="Approve the right players quickly"
        description="You only see direct operational information here: who requested, which room they want, and the next action."
      >
        {loading ? (
          <div className="product-card muted-copy">Loading your rooms...</div>
        ) : myRooms.length === 0 ? (
          <div className="product-card muted-copy">
            You have not created any rooms yet. Open one from Discover to start building local match energy.
          </div>
        ) : (
          <div className="space-y-5">
            {myRooms.map((room) => (
              <article key={room.id} className="product-card">
                <div className="flex flex-col gap-4 border-b border-white/10 pb-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <span className="pill-gold">{room.status}</span>
                    <h3 className="mt-4 text-2xl font-cabinet-bold">{room.title}</h3>
                    <p className="muted-copy mt-2 text-sm">
                      {room.currentPlayers}/{room.requiredPlayers} players • {room.skillLevel || "Open"} • {room.city || "Local"}
                    </p>
                  </div>
                  <div className="grid gap-2 text-sm text-white/80">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-[#d8b56d]" />
                      <span>{room.joinRequests?.length || 0} total requests</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-[#8bc78f]" />
                      <span>{room.members?.filter((member) => member.status === "APPROVED").length || 0} approved</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 product-grid-3">
                  {(room.joinRequests || []).length === 0 ? (
                    <div className="muted-copy text-sm">No pending requests for this room yet.</div>
                  ) : (
                    room.joinRequests.map((request) => {
                      const member = room.members?.find((entry) => entry.userId === request.requesterUserId);

                      return (
                        <div key={request.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <p className="section-kicker mb-2">Pending Request</p>
                          <h4 className="text-lg font-semibold text-white">
                            {request.requester?.fullname || request.requesterUserId}
                          </h4>
                          <p className="muted-copy mt-1 text-xs uppercase tracking-[0.16em]">
                            {request.requester?.city ? `${request.requester.city}, ${request.requester.state}` : "Nearby player"}
                          </p>
                          <p className="muted-copy mt-2 text-sm leading-6">
                            {request.message || "Interested in joining this game."}
                          </p>
                          <button
                            type="button"
                            className="cta-primary mt-4"
                            disabled={!member}
                            onClick={() => member && approveMember(room.id, member.id)}
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Approve Player
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </SectionBlock>
    </ProductShell>
  );
}
