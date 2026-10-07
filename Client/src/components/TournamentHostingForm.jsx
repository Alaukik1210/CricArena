import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSelector } from "react-redux";
import { OWNER_PROFILE_API_END_POINT, TOUR_API_END_POINT } from "@/utils/constants";

const TournamentHostingForm = () => {
  const { user } = useSelector((store) => store.user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tourStartsDate: "",
    tourEndDate: "",
    venue: "",
    entryFee: "",
    spots: "",
    type: "Tournament",
    lastRegistrationDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (!user?.id || user?.role !== "OWNER") {
        alert("Please login as an owner to host a tournament.");
        setIsSubmitting(false);
        return;
      }

      await axios.post(`${OWNER_PROFILE_API_END_POINT}/${user.id}`, {
        bio: "",
      }, {
        withCredentials: true,
      });

      const response = await axios.post(
        `${TOUR_API_END_POINT}/tourDetails`,
        formData,
        {
          withCredentials: true,
        }
      );
      console.log("Tournament created successfully:", response.data);
      alert("Tournament hosted successfully!");
      setFormData({
        title: "",
        description: "",
        tourStartsDate: "",
        tourEndDate: "",
        venue: "",
        entryFee: "",
        spots: "",
        type: "Tournament",
        lastRegistrationDate: "",
      });
    } catch (error) {
      console.error("Error hosting tournament:", error);
      if (error?.response?.status === 401) {
        alert("Session expired or missing. Please login again as OWNER and retry.");
      } else {
        alert("Failed to host tournament. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative mt-24 min-h-screen overflow-hidden bg-[#0b0b0d] px-4 py-14 md:px-8">
      <div className="pointer-events-none absolute -left-20 top-12 h-56 w-56 rounded-full bg-[#FFD070]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-1/3 h-72 w-72 rounded-full bg-[#f4a948]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#ffffff]/5 blur-3xl" />

      <div className="relative mx-auto w-full max-w-4xl">
        <div className="mb-6 rounded-2xl border border-[#FFD070]/20 bg-[#17181d]/70 p-5 text-[#e8e8e8] backdrop-blur-md md:p-6">
          <h2 className="font-cabinet-black text-3xl text-[#FFD070] md:text-4xl">
            Host a Tournament
          </h2>
          <p className="mt-2 text-sm text-[#b5b8c5] md:text-base">
            Set dates, pricing, and capacity. Make your event discoverable to teams instantly.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-7 rounded-2xl border border-white/10 bg-[#1a1c23]/85 p-5 text-white shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-md md:p-8"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title" className="text-sm font-semibold tracking-wide text-[#e6e7ed]">
                Tournament Title
              </Label>
              <Input
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Weekend Champions League"
                className="h-12 rounded-xl border border-white/15 bg-[#0f1117] text-white placeholder:text-[#7f8494] focus-visible:border-[#FFD070] focus-visible:ring-[#FFD070]/30"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description" className="text-sm font-semibold tracking-wide text-[#e6e7ed]">
                Description
              </Label>
              <Textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Share format, rules, and highlights of your tournament"
                className="min-h-28 rounded-xl border border-white/15 bg-[#0f1117] text-white placeholder:text-[#7f8494] focus-visible:border-[#FFD070] focus-visible:ring-[#FFD070]/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tourStartsDate" className="text-sm font-semibold tracking-wide text-[#e6e7ed]">
                Start Date
              </Label>
              <Input
                type="date"
                name="tourStartsDate"
                id="tourStartsDate"
                value={formData.tourStartsDate}
                onChange={handleChange}
                className="h-12 rounded-xl border border-white/15 bg-[#0f1117] text-white focus-visible:border-[#FFD070] focus-visible:ring-[#FFD070]/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tourEndDate" className="text-sm font-semibold tracking-wide text-[#e6e7ed]">
                End Date
              </Label>
              <Input
                type="date"
                name="tourEndDate"
                id="tourEndDate"
                value={formData.tourEndDate}
                onChange={handleChange}
                className="h-12 rounded-xl border border-white/15 bg-[#0f1117] text-white focus-visible:border-[#FFD070] focus-visible:ring-[#FFD070]/30"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="venue" className="text-sm font-semibold tracking-wide text-[#e6e7ed]">
                Venue
              </Label>
              <Input
                name="venue"
                id="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="e.g. Arun Jaitley Stadium, Delhi"
                className="h-12 rounded-xl border border-white/15 bg-[#0f1117] text-white placeholder:text-[#7f8494] focus-visible:border-[#FFD070] focus-visible:ring-[#FFD070]/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="entryFee" className="text-sm font-semibold tracking-wide text-[#e6e7ed]">
                Entry Fee
              </Label>
              <Input
                name="entryFee"
                id="entryFee"
                value={formData.entryFee}
                onChange={handleChange}
                placeholder="e.g. 200"
                className="h-12 rounded-xl border border-white/15 bg-[#0f1117] text-white placeholder:text-[#7f8494] focus-visible:border-[#FFD070] focus-visible:ring-[#FFD070]/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="spots" className="text-sm font-semibold tracking-wide text-[#e6e7ed]">
                Number of Spots
              </Label>
              <Input
                type="number"
                name="spots"
                id="spots"
                value={formData.spots}
                onChange={handleChange}
                placeholder="e.g. 16"
                className="h-12 rounded-xl border border-white/15 bg-[#0f1117] text-white placeholder:text-[#7f8494] focus-visible:border-[#FFD070] focus-visible:ring-[#FFD070]/30"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="lastRegistrationDate" className="text-sm font-semibold tracking-wide text-[#e6e7ed]">
                Last Registration Date
              </Label>
              <Input
                type="date"
                name="lastRegistrationDate"
                id="lastRegistrationDate"
                value={formData.lastRegistrationDate}
                onChange={handleChange}
                className="h-12 rounded-xl border border-white/15 bg-[#0f1117] text-white focus-visible:border-[#FFD070] focus-visible:ring-[#FFD070]/30"
              />
            </div>
          </div>

          <div className="pt-2 text-center">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="group h-12 min-w-60 rounded-xl border border-[#ffd070]/70 bg-gradient-to-r from-[#f5d37a] via-[#ffd070] to-[#e0ae3f] px-10 text-base font-bold tracking-wide text-black transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(255,208,112,0.35)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Hosting..." : "Host Tournament"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default TournamentHostingForm;
