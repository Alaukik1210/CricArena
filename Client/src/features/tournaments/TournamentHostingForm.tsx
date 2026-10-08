import { useState, type ChangeEvent, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ApiError, api } from "@/lib/api";
import { useAppSelector } from "@/redux/store";

const emptyForm = {
  title: "",
  description: "",
  tourStartsDate: "",
  tourEndDate: "",
  venue: "",
  entryFee: "",
  spots: "",
  type: "Tournament",
  lastRegistrationDate: "",
};

// TODO(P2): this is the screen the organizer co-pilot will target. Keep the
// form fields and the submit payload stable so it can prefill and submit them.
const TournamentHostingForm = () => {
  const user = useAppSelector((store) => store.user.user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (!user?.id || user?.role !== "OWNER") {
        alert("Please login as an owner to host a tournament.");
        setIsSubmitting(false);
        return;
      }

      await api.post(`/owner/profile/${user.id}`, { bio: "" });

      const response = await api.post("/owner/tours/tourDetails", formData);
      console.log("Tournament created successfully:", response.data);
      alert("Tournament hosted successfully!");
      setFormData(emptyForm);
    } catch (error) {
      console.error("Error hosting tournament:", error);
      if (error instanceof ApiError && error.status === 401) {
        alert("Session expired or missing. Please login again as OWNER and retry.");
      } else {
        alert("Failed to host tournament. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative mt-24 min-h-screen overflow-hidden bg-ground px-4 py-14 md:px-8">
      <div className="relative mx-auto w-full max-w-4xl">
        <div className="mb-6 rounded border border-rule bg-surface p-5 text-ink md:p-6">
          <h2 className="font-display text-3xl text-pending md:text-4xl">
            Host a Tournament
          </h2>
          <p className="mt-2 text-sm text-ink-soft md:text-base">
            Set dates, pricing, and capacity. Make your event discoverable to teams instantly.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-7 rounded border border-rule bg-surface p-5 text-ink md:p-8"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title" className="font-semibold tracking-wide">
                Tournament Title
              </Label>
              <Input
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Weekend Champions League"
                className="h-12"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description" className="font-semibold tracking-wide">
                Description
              </Label>
              <Textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Share format, rules, and highlights of your tournament"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tourStartsDate" className="font-semibold tracking-wide">
                Start Date
              </Label>
              <Input
                type="date"
                name="tourStartsDate"
                id="tourStartsDate"
                value={formData.tourStartsDate}
                onChange={handleChange}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tourEndDate" className="font-semibold tracking-wide">
                End Date
              </Label>
              <Input
                type="date"
                name="tourEndDate"
                id="tourEndDate"
                value={formData.tourEndDate}
                onChange={handleChange}
                className="h-12"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="venue" className="font-semibold tracking-wide">
                Venue
              </Label>
              <Input
                name="venue"
                id="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="e.g. Arun Jaitley Stadium, Delhi"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="entryFee" className="font-semibold tracking-wide">
                Entry Fee
              </Label>
              <Input
                name="entryFee"
                id="entryFee"
                value={formData.entryFee}
                onChange={handleChange}
                placeholder="e.g. 200"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="spots" className="font-semibold tracking-wide">
                Number of Spots
              </Label>
              <Input
                type="number"
                name="spots"
                id="spots"
                value={formData.spots}
                onChange={handleChange}
                placeholder="e.g. 16"
                className="h-12"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="lastRegistrationDate" className="font-semibold tracking-wide">
                Last Registration Date
              </Label>
              <Input
                type="date"
                name="lastRegistrationDate"
                id="lastRegistrationDate"
                value={formData.lastRegistrationDate}
                onChange={handleChange}
                className="h-12"
              />
            </div>
          </div>

          <div className="pt-2 text-center">
            <Button type="submit" size="lg" disabled={isSubmitting} className="min-w-60 font-bold tracking-wide">
              {isSubmitting ? "Hosting..." : "Host Tournament"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default TournamentHostingForm;
