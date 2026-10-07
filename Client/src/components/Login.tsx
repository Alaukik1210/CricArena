import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { authApi, type AuthResponse, type LoginRequest } from "../features/auth/auth.api";
import { loginFormSchema, type LoginFormValues } from "../features/auth/auth.schemas";
import { useAppDispatch } from "../redux/store";
import { setUser } from "../redux/userSlice";
import { showApiError } from "../lib/api";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: { email: "", password: "", role: "PLAYER" },
    });

    const loginMutation = useMutation<AuthResponse, unknown, LoginRequest>({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            dispatch(setUser(data.user));
            toast.success(data.message ?? "Welcome back!");
            navigate("/");
        },
        onError: showApiError,
    });

    const onSubmit = (values: LoginFormValues) => loginMutation.mutate(values);

    const isPending = loginMutation.isPending;

    return (
        <div className="h-screen bg-black flex items-center justify-center">
            <div className="max-w-md w-full font-cabinet-extrabold p-6 bg-[#3d3d3d] rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-[#FFD070] text-center mb-6">
                    Login to CricArena
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="mb-4">
                        <label className="block text-white text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            autoComplete="email"
                            {...register("email")}
                            className="w-full px-3 py-2 rounded-md bg-[#2d2d2d] text-white focus:outline-none"
                            placeholder="Enter your email"
                        />
                        {errors.email && (
                            <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="block text-white text-sm font-bold mb-2">Password</label>
                        <input
                            type="password"
                            autoComplete="current-password"
                            {...register("password")}
                            className="w-full px-3 py-2 rounded-md bg-[#2d2d2d] text-white focus:outline-none"
                            placeholder="Enter your password"
                        />
                        {errors.password && (
                            <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="block text-white text-sm font-bold mb-2">Role</label>
                        <select
                            {...register("role")}
                            className="w-full px-3 py-2 rounded-md bg-[#2d2d2d] text-white focus:outline-none"
                        >
                            <option value="PLAYER">Player</option>
                            <option value="OWNER">Ground Owner</option>
                        </select>
                        {errors.role && (
                            <p className="text-red-400 text-xs mt-1">{errors.role.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-[#FFD070] text-black font-bold py-2 px-4 rounded h-10 flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="animate-spin h-4 w-4" />
                                Please wait
                            </>
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>

                <p className="text-center text-white mt-4">
                    Don’t have an account?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/signup")}
                        className="text-[#FFD070] hover:underline"
                    >
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
