import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { USER_API_END_POINT } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { Button } from "react-scroll";
import { Loader2 } from "lucide-react";
import { setUser } from "@/redux/userSlice";

const SignUp = () => {
  const statesAndCities = [
    {
      state: "Maharashtra",
      cities: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur"],
    },
    {
      state: "Karnataka",
      cities: ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum"],
    },
    {
      state: "Tamil Nadu",
      cities: ["Chennai", "Coimbatore", "Madurai", "Salem", "Trichy"],
    },
    {
      state: "Delhi NCR",
      cities: ["New Delhi", "Noida", "Gurgaon", "Faridabad", "Ghaziabad"],
    },
    {
      state: "West Bengal",
      cities: ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"],
    },
    {
      state: "Telangana",
      cities: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
    },
    {
      state: "Gujarat",
      cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
    },
    {
      state: "Kerala",
      cities: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
    },
    {
      state: "Uttar Pradesh",
      cities: [
        "Lucknow",
        "Kanpur",
        "Varanasi",
        "Agra",
        "Prayagraj",
        "Noida",
        "Ghaziabad",
        "Meerut",
        "Bareilly",
        "Aligarh",
        "Moradabad",
        "Saharanpur",
        "Bahraich",
      ],
    },
  ];
  const dispatch = useDispatch();
  const {loading} = useSelector(store=>store.auth)
  // 
  const navigate = useNavigate();
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "PLAYER",
    state: "",
    city: "",
  });

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    if (name === "state") {
      setInput({
        ...input,
        state: value,
        city: "" 
      });
    } else {
      setInput({
        ...input,
        [name]: value
      });
    }
  };

  // Updated submit handler
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Validate all required fields
    if (!input.fullname || !input.email || !input.phoneNumber || !input.password || !input.state || !input.city) {
      alert("Please fill all required fields");
      return;
    }

    try {
      // Send data as JSON instead of FormData
      dispatch(setLoading(true));
      const response = await axios.post(`${USER_API_END_POINT}/register`, {
        fullname: input.fullname,
        email: input.email,
        phoneNumber: input.phoneNumber,
        password: input.password,
        role: input.role,
        state: input.state,
        city: input.city
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Server Response:", response.data);

      if (response.data.success) {
        dispatch(setUser(input.fullname))
        navigate("/");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.response?.data?.message || "Registration failed. Please try again.");
    }finally{
      dispatch(setLoading(false))
    }
  };

  return (
    <div className="h-screen pt-12 bg-black   font-cabinet-extrabold flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-[#3d3d3d] rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-[#FFD070] text-center mb-6">
          Sign Up for CricArena
        </h2>
        <form onSubmit={onSubmitHandler}>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">
              Username
            </label>
            <input
              name="fullname"
              type="text"
              value={input.fullname}
              onChange={changeEventHandler}
              className="w-full px-3 py-2 rounded-md bg-[#2d2d2d] text-white focus:outline-none"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={input.email}
              onChange={changeEventHandler}
              className="w-full px-3 py-2 rounded-md bg-[#2d2d2d] text-white focus:outline-none"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2">
              Phone Number
            </label>
            <input
              name="phoneNumber"
              type="tel"
              value={input.phoneNumber}
              onChange={changeEventHandler}
              className="w-full px-3 py-2 rounded-md bg-[#2d2d2d] text-white focus:outline-none"
              placeholder="+91"
            />
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={input.password}
              onChange={changeEventHandler}
              className="w-full px-3 py-2 rounded-md bg-[#2d2d2d] text-white focus:outline-none"
              placeholder="Enter your password"
            />
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2">
              Role
            </label>
            <select
              name="role"
              value={input.role}
              onChange={changeEventHandler}
              className="w-full px-3 py-2 rounded-md bg-[#2d2d2d] text-white focus:outline-none"
            >
              <option value="PLAYER">Player</option>
              <option value="OWNER">Ground Owner</option>
            </select>
          </div>
          <div className="flex gap-10">
            <div className="mb-6 w-[50%]">
              <label className="block text-white text-sm font-bold mb-2">
                State
              </label>
              <select
                name="state"
                value={input.state}
                onChange={changeEventHandler}
                className="w-full px-3 py-2 rounded-md bg-[#2d2d2d] text-white focus:outline-none"
              >
                <option value="">Select State</option>
                {statesAndCities.map((item) => (
                  <option key={item.state} value={item.state}>
                    {item.state}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-6 w-[50%]">
              <label className="block text-white text-sm font-bold mb-2">
                City
              </label>
              <select
                name="city"
                value={input.city}
                onChange={changeEventHandler}
                className="w-full px-3 py-2 rounded-md bg-[#2d2d2d] text-white focus:outline-none"
                disabled={!input.state}
              >
                <option value="">Select City</option>
                {input.state &&
                  statesAndCities
                    .find((item) => item.state === input.state)
                    ?.cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between">
          {
              loading?<Button className='w-full bg-[#FFD070] text-black font-bold py-2 px-4 rounded h-10 flex items-center justify-center gap-2'> <Loader2   className='text-center   animate-spin'/> Please wait</Button> : <button
            
              type="submit"
              className="w-full bg-[#FFD070]  text-black font-bold py-2 px-4 rounded group relative h-10  overflow-hidden  text-md  border-gold  text-center"
            >
              Sign up
              <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
            </button>
            }
          </div>
        </form>
        <p className="text-center text-white mt-4">
          Already have an account?{" "}
          <button
            onClick={() => navigate(`/login`)}
            className="text-[#FFD070] hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;