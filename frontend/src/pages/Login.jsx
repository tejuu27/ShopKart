import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginCustomer } from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");

        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Enter a valid email";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                await loginCustomer({
                    email: formData.email,
                    password: formData.password,
                });

                navigate("/home");
            } catch (error) {
                setServerError(error.message);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#ede7dd] flex items-center justify-center px-5 py-10">

            <div className="w-full max-w-md bg-[#f8f4ee] rounded-2xl border border-[#d1c7ba] shadow-[0_10px_30px_rgba(70,55,40,0.08)] px-7 py-9 md:px-9">

                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#2b2b2b] flex items-center justify-center shadow-sm">
                        <span className="text-2xl">
                            🛍️
                        </span>
                    </div>
                </div>

                {/* Heading */}
                <div className="text-center mb-8">

                    <p className="text-xs uppercase tracking-[0.2em] text-[#8f7d68] mb-3">
                        ShopKart
                    </p>

                    <h1 className="text-3xl font-semibold text-[#2b2b2b]">
                        Welcome back
                    </h1>

                    <p className="mt-2 text-sm text-[#6b6258]">
                        Sign in to continue your journey
                    </p>

                </div>

                {/* Server Error */}
                {serverError && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {serverError}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Email */}
                    <div>

                        <label className="block mb-2 text-sm font-medium text-[#4b443d]">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full h-12 px-4 rounded-xl border border-[#cfc4b6] bg-[#fffdf9] text-sm text-[#2b2b2b] placeholder-[#9a9085] outline-none transition focus:border-[#8f7d68] focus:ring-2 focus:ring-[#8f7d68]/10"
                        />

                        {errors.email && (
                            <p className="mt-1.5 text-sm text-red-500">
                                {errors.email}
                            </p>
                        )}

                    </div>

                    {/* Password */}
                    <div>

                        <label className="block mb-2 text-sm font-medium text-[#4b443d]">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full h-12 px-4 rounded-xl border border-[#cfc4b6] bg-[#fffdf9] text-sm text-[#2b2b2b] placeholder-[#9a9085] outline-none transition focus:border-[#8f7d68] focus:ring-2 focus:ring-[#8f7d68]/10"
                        />

                        {errors.password && (
                            <p className="mt-1.5 text-sm text-red-500">
                                {errors.password}
                            </p>
                        )}

                    </div>

                    {/* Remember + Forgot */}
                    <div className="flex items-center justify-between">

                        <label className="flex items-center gap-2 text-sm text-[#6b6258] cursor-pointer">

                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="h-4 w-4 accent-[#2b2b2b] cursor-pointer"
                            />

                            Remember me

                        </label>

                        <button
                            type="button"
                            className="text-sm font-medium text-[#2b2b2b] hover:underline"
                        >
                            Forgot password?
                        </button>

                    </div>

                    {/* Sign In */}
                    <button
                        type="submit"
                        className="w-full h-12 rounded-xl bg-[#2b2b2b] text-white text-sm font-semibold tracking-wide transition hover:opacity-90 active:scale-[0.99]"
                    >
                        SIGN IN
                    </button>

                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 my-7">

                    <div className="h-px flex-1 bg-[#ded5ca]" />

                    <span className="text-xs text-[#9a9085]">
                        OR CONTINUE WITH
                    </span>

                    <div className="h-px flex-1 bg-[#ded5ca]" />

                </div>

                {/* Social Login */}
                <div className="grid grid-cols-3 gap-3">

                    <button
                        type="button"
                        className="h-11 rounded-xl border border-[#cfc4b6] bg-[#fffdf9] hover:bg-[#f1ece4] transition flex items-center justify-center font-medium text-sm text-[#2b2b2b]"
                    >
                        
                        <span className="ml-1.5">Apple</span>
                    </button>

                    <button
                        type="button"
                        className="h-11 rounded-xl border border-[#cfc4b6] bg-[#fffdf9] hover:bg-[#f1ece4] transition flex items-center justify-center font-medium text-sm text-[#2b2b2b]"
                    >
                        G
                        <span className="ml-1.5">Google</span>
                    </button>

                    <button
                        type="button"
                        className="h-11 rounded-xl border border-[#cfc4b6] bg-[#fffdf9] hover:bg-[#f1ece4] transition flex items-center justify-center font-medium text-sm text-[#2b2b2b]"
                    >
                        ∞
                        <span className="ml-1.5">Meta</span>
                    </button>

                </div>

                {/* Register */}
                <div className="mt-7 pt-6 border-t border-[#ded5ca] text-center">

                    <p className="text-sm text-[#6b6258]">

                        Don't have an account?{" "}

                        <button
                            type="button"
                            onClick={() => navigate("/register")}
                            className="font-semibold text-[#2b2b2b] hover:underline"
                        >
                            Create an account
                        </button>

                    </p>

                </div>

            </div>
        </div>
    );
}

export default Login;