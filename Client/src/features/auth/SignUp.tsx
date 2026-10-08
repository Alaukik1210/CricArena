import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { setLoading } from "@/redux/authSlice";
import { setUser } from "@/redux/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Button } from "@/components/ui/button";
import type { Role } from "@/types/user";
import type { AuthResponse, RegisterRequest } from "./auth.api";

type SignUpForm = Omit<RegisterRequest, "role"> & { role: Role };

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
  const dispatch = useAppDispatch();
  const {loading} = useAppSelector((store) => store.auth)
  // 
  const navigate = useNavigate();
  const [input, setInput] = useState<SignUpForm>({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "PLAYER",
    state: "",
    city: "",
  });

  const changeEventHandler = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate all required fields
    if (!input.fullname || !input.email || !input.phoneNumber || !input.password || !input.state || !input.city) {
      alert("Please fill all required fields");
      return;
    }

    try {
      // Send data as JSON instead of FormData
      dispatch(setLoading(true));
      const response = await api.post<AuthResponse>("/user/register", {
        fullname: input.fullname,
        email: input.email,
        phoneNumber: input.phoneNumber,
        password: input.password,
        role: input.role,
        state: input.state,
        city: input.city
      });

      console.log("Server Response:", response.data);

      if (response.data.success) {
        dispatch(setUser(response.data.user));
        navigate("/");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert(error instanceof Error && error.message ? error.message : "Registration failed. Please try again.");
    }finally{
      dispatch(setLoading(false))
    }
  };

  return (
    <div className="h-screen pt-12 bg-ground font-display flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-surface border border-rule-soft rounded shadow-lg">
        <h2 className="text-3xl font-bold text-ink text-center mb-6">
          Sign Up for CricArena
        </h2>
        <form onSubmit={onSubmitHandler}>
          <div className="mb-4">
            <label className="block text-ink text-sm font-bold mb-2">
              Username
            </label>
            <input
              name="fullname"
              type="text"
              value={input.fullname}
              onChange={changeEventHandler}
              className="w-full px-3 py-2 rounded bg-surface border border-rule text-ink placeholder:text-ink-faint"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-4">
            <label className="block text-ink text-sm font-bold mb-2">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={input.email}
              onChange={changeEventHandler}
              className="w-full px-3 py-2 rounded bg-surface border border-rule text-ink placeholder:text-ink-faint"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-ink text-sm font-bold mb-2">
              Phone Number
            </label>
            <input
              name="phoneNumber"
              type="tel"
              value={input.phoneNumber}
              onChange={changeEventHandler}
              className="w-full px-3 py-2 rounded bg-surface border border-rule text-ink placeholder:text-ink-faint"
              placeholder="+91"
            />
          </div>
          <div className="mb-6">
            <label className="block text-ink text-sm font-bold mb-2">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={input.password}
              onChange={changeEventHandler}
              className="w-full px-3 py-2 rounded bg-surface border border-rule text-ink placeholder:text-ink-faint"
              placeholder="Enter your password"
            />
          </div>
          <div className="mb-6">
            <label className="block text-ink text-sm font-bold mb-2">
              Role
            </label>
            <select
              name="role"
              value={input.role}
              onChange={changeEventHandler}
              className="w-full px-3 py-2 rounded bg-surface border border-rule text-ink placeholder:text-ink-faint"
            >
              <option value="PLAYER">Player</option>
              <option value="OWNER">Ground Owner</option>
            </select>
          </div>
          <div className="flex gap-10">
            <div className="mb-6 w-[50%]">
              <label className="block text-ink text-sm font-bold mb-2">
                State
              </label>
              <select
                name="state"
                value={input.state}
                onChange={changeEventHandler}
                className="w-full px-3 py-2 rounded bg-surface border border-rule text-ink placeholder:text-ink-faint"
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
              <label className="block text-ink text-sm font-bold mb-2">
                City
              </label>
              <select
                name="city"
                value={input.city}
                onChange={changeEventHandler}
                className="w-full px-3 py-2 rounded bg-surface border border-rule text-ink placeholder:text-ink-faint"
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
          {loading ? (
            <Button type="button" disabled className="w-full h-10">
              <Loader2 className="animate-spin" /> Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full h-10">
              Sign up
            </Button>
          )}
          </div>
        </form>
        <p className="text-center text-ink mt-4">
          Already have an account?{" "}
          <button
            onClick={() => navigate(`/login`)}
            className="font-bold text-ink underline hover:text-ink-soft"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;