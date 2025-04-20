import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckIcon, StarIcon, MapPin } from "lucide-react";

const grounds = [
  {
    name: "Green Field Stadium",
    location: "Dwarka, South-West Delhi",
    rating: 5,
    reviews: 48,
    price: 5000,
    tag: "Available Today",
    tagColor: "green",
    features: [
      "Natural grass pitch",
      "Changing rooms available",
      "Flood lights for night matches",
    ],
  },
  {
    name: "Sunshine Cricket Ground",
    location: "Noida, Sector 62",
    rating: 4,
    reviews: 36,
    price: 4000,
    tag: "Few Slots Left",
    tagColor: "yellow",
    features: ["Synthetic pitch", "Parking available", "Canteen on premises"],
  },
  {
    name: "Royal Sports Club",
    location: "Gurgaon, Golf Course Road",
    rating: 5,
    reviews: 52,
    price: 12000,
    tag: "Premium Ground",
    tagColor: "blue",
    features: [
      "Premium grass pitch",
      "Clubhouse with amenities",
      "Professional staff & equipment",
    ],
  },
];

export default function Grounds() {
  return (
    <div className="p-6 text-white bg-[#1e1e1e] min-h-screen mt-28 pt-12">
      <h2 className="text-5xl font-bold text-center mb-2 text-gold">Available Grounds</h2>
      <p className="text-center text-sm text-gray-400 mb-6">
        Find and book cricket grounds in your area for practice sessions, matches, or tournaments.
      </p>

      <div className="flex flex-wrap gap-4 justify-center items-center mb-6">
        <Input placeholder="Search grounds..." className="w-full max-w-sm" />
        <Select>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="delhi">Delhi</SelectItem>
            <SelectItem value="gurgaon">Gurgaon</SelectItem>
            <SelectItem value="noida">Noida</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low to High</SelectItem>
            <SelectItem value="high">High to Low</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Available Today</SelectItem>
            <SelectItem value="weekend">Weekend Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {grounds.map((ground, index) => (
          <Card key={index} className="bg-[#2a2a2a] text-white rounded-xl">
            <div className="h-40 bg-[#3b3b3b] rounded-t-xl flex justify-center items-center">
              <div className="text-gray-500 text-6xl">🏟️</div>
              <Badge
                className={`absolute top-4 right-4 text-xs ${
                  ground.tagColor === "green"
                    ? "bg-green-500"
                    : ground.tagColor === "yellow"
                    ? "bg-yellow-500"
                    : "bg-blue-500"
                }`}
              >
                {ground.tag}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-1">{ground.name}</h3>
              <div className="text-sm text-gray-400 flex items-center gap-1 mb-2">
                <MapPin size={14} /> {ground.location}
              </div>
              <div className="flex items-center text-sm mb-2">
                {[...Array(ground.rating)].map((_, i) => (
                  <StarIcon key={i} size={14} className="text-yellow-400" />
                ))}
                {[...Array(5 - ground.rating)].map((_, i) => (
                  <StarIcon key={i} size={14} className="text-gray-500" />
                ))}
                <span className="ml-2 text-gray-400">
                  {ground.rating}.0 ({ground.reviews} bookings)
                </span>
              </div>
              <ul className="text-sm space-y-1 mb-3">
                {ground.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-300">
                    <CheckIcon size={14} className="mr-2 text-green-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center">
                <div className="text-lg font-semibold">₹{ground.price.toLocaleString()} <span className="text-sm font-normal">/match</span></div>
                <Button className="bg-green-500 text-white hover:bg-green-600">Book Now</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
