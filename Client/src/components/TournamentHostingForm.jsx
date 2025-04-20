import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const TournamentHostingForm = () => {
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
      const response = await axios.post(
        "http://localhost:8080/api/v1/owner/tours/tourDetails",
        formData
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
      alert("Failed to host tournament. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mt-40 mx-auto p-8 rounded-2xl shadow-xl bg-[#2f2f2f] text-white w-[800px] space-y-6 font-cabinet-black"
    >
      <h2 className="text-3xl font-bold text-center text-[#FFD070]">
        🏏 Host a Tournament
      </h2>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Tournament Title</Label>
        <Input
          name="title"
          id="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter title"
          className="bg-black text-white border-zinc-600 placeholder:text-zinc-400"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          name="description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter a short description"
          className="bg-black text-white border-zinc-600 placeholder:text-zinc-400"
        />
      </div>

      {/* Dates */}
      <div className="flex gap-4">
        <div className="w-full space-y-2">
          <Label htmlFor="tourStartsDate">Start Date</Label>
          <Input
            type="date"
            name="tourStartsDate"
            id="tourStartsDate"
            value={formData.tourStartsDate}
            onChange={handleChange}
            className="bg-black text-white border-zinc-600"
          />
        </div>
        <div className="w-full space-y-2">
          <Label htmlFor="tourEndDate">End Date</Label>
          <Input
            type="date"
            name="tourEndDate"
            id="tourEndDate"
            value={formData.tourEndDate}
            onChange={handleChange}
            className="bg-black text-white border-zinc-600"
          />
        </div>
      </div>

      {/* Venue */}
      <div className="space-y-2">
        <Label htmlFor="venue">Venue</Label>
        <Input
          name="venue"
          id="venue"
          value={formData.venue}
          onChange={handleChange}
          placeholder="e.g. Delhi Stadium"
          className="bg-black text-white border-zinc-600 placeholder:text-zinc-400"
        />
      </div>

      {/* Entry Fee */}
      <div className="space-y-2">
        <Label htmlFor="entryFee">Entry Fee</Label>
        <Input
          name="entryFee"
          id="entryFee"
          value={formData.entryFee}
          onChange={handleChange}
          placeholder="e.g. ₹200"
          className="bg-black text-white border-zinc-600 placeholder:text-zinc-400"
        />
      </div>

      {/* Spots */}
      <div className="space-y-2">
        <Label htmlFor="spots">Number of Spots</Label>
        <Input
          type="number"
          name="spots"
          id="spots"
          value={formData.spots}
          onChange={handleChange}
          placeholder="e.g. 16"
          className="bg-black text-white border-zinc-600 placeholder:text-zinc-400"
        />
      </div>

      {/* Last Registration Date */}
      <div className="space-y-2">
        <Label htmlFor="lastRegistrationDate">Last Registration Date</Label>
        <Input
          type="date"
          name="lastRegistrationDate"
          id="lastRegistrationDate"
          value={formData.lastRegistrationDate}
          onChange={handleChange}
          className="bg-black text-white border-zinc-600"
        />
      </div>

      {/* Submit */}
      <div className="text-center">
        <Button
          type="submit"
          variant="outline"
          className="hover:text-white border-[#FFD070] bg-[#FFD070] hover:bg-[#FFDO70] text-black font-bold px-8 py-2 text-lg transition-all duration-300 rounded-xl"
        >
          Host Tournament
        </Button>
      </div>
    </form>
  );
};

export default TournamentHostingForm;
