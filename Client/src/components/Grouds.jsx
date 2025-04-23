import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckIcon, StarIcon, MapPin } from "lucide-react";

export default function Grounds() {
  const [grounds, setGrounds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrounds = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/ground/all");
        setGrounds(response.data.grounds);
      } catch (error) {
        console.error("Error fetching grounds:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGrounds();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-white bg-[#1e1e1e] min-h-screen mt-28 pt-12">
        <h2 className="text-5xl font-bold text-center mb-2 text-gold">Available Grounds</h2>
        <p className="text-center text-sm text-gray-400 mb-6">
          Find and book cricket grounds in your area for practice sessions, matches, or tournaments.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="bg-[#2a2a2a] text-white rounded-xl animate-pulse">
              <div className="h-40 bg-[#3b3b3b] rounded-t-xl" />
              <CardContent className="p-4 space-y-3">
                <div className="h-4 bg-gray-600 rounded w-3/4" />
                <div className="h-3 bg-gray-500 rounded w-1/2" />
                <div className="h-3 bg-gray-500 rounded w-2/3" />
                <div className="h-3 bg-gray-500 rounded w-5/6" />
                <div className="h-10 bg-gray-700 rounded w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!grounds.length) {
    return <p className="text-center text-white mt-20">No grounds available.</p>;
  }

  return (
    <div className="p-6 text-white bg-[#1e1e1e] min-h-screen mt-28 pt-12">
      <h2 className="text-5xl font-bold text-center mb-2 text-gold">Available Grounds</h2>
      <p className="text-center text-sm text-gray-400 mb-6">
        Find and book cricket grounds in your area for practice sessions, matches, or tournaments.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {grounds.map((ground, index) => (
          <Card key={index} className="bg-[#2a2a2a] text-white rounded-xl relative">
            <div className="h-40 bg-[#3b3b3b] rounded-t-xl flex justify-center items-center relative">
              <img
                src="https://www.shutterstock.com/image-vector/night-cricket-stadium-illustration-vector-600nw-2160100275.jpg"
                alt="Ground"
                className="h-full w-full object-cover rounded-t-xl"
              />
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
                {[...Array(Math.floor(ground.rating))].map((_, i) => (
                  <StarIcon key={i} size={14} className="text-yellow-400" />
                ))}
                {[...Array(5 - Math.floor(ground.rating))].map((_, i) => (
                  <StarIcon key={i} size={14} className="text-gray-500" />
                ))}
                <span className="ml-2 text-gray-400">
                  {ground.rating.toFixed(1)} ({ground.bookings} bookings)
                </span>
              </div>
              <ul className="text-sm space-y-1 mb-3">
                {ground.facilities.map((facility, idx) => (
                  <li key={idx} className="flex items-center text-gray-300">
                    <CheckIcon size={14} className="mr-2 text-green-400" />
                    {facility}
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center">
                <div className="text-lg font-semibold">₹{ground.pricePerMatch.toLocaleString()} <span className="text-sm font-normal">/match</span></div>
                <Button className="bg-green-500 text-white hover:bg-green-600">Book Now</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
