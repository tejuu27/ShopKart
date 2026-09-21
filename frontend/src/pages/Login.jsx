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
        <div className="min-h-screen bg-zinc-100 flex items-center justify-center px-4 py-8">

            <div className="w-full max-w-md bg-white rounded-2xl border border-zinc-200 shadow-sm px-8 py-9">

                <div className="flex justify-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-zinc-900 flex items-center justify-center">
                        <span className="text-2xl">🛍️</span>
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-semibold text-zinc-900">
                        Welcome back!
                    </h1>

                    <p className="mt-2 text-sm text-zinc-500">
                        Sign in to continue your journey
                    </p>
                </div>

                {serverError && (
                    <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {serverError}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Email */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-zinc-700">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full h-12 px-4 rounded-lg border border-zinc-300 bg-white text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-zinc-600 focus:ring-2 focus:ring-zinc-100"
                        />

                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-zinc-700">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full h-12 px-4 rounded-lg border border-zinc-300 bg-white text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-zinc-600 focus:ring-2 focus:ring-zinc-100"
                        />

                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Remember + Forgot */}
                    <div className="flex items-center justify-between">

                        <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="h-4 w-4 accent-zinc-900 cursor-pointer"
                            />
                            Remember me
                        </label>

                        <button
                            type="button"
                            className="text-sm font-medium text-zinc-900 hover:underline"
                        >
                            Forgot password?
                        </button>

                    </div>

                    {/* Sign In */}
                    <button
                        type="submit"
                        className="w-full h-12 rounded-lg bg-zinc-900 text-white text-sm font-semibold tracking-wide transition hover:bg-zinc-800 active:scale-[0.99]"
                    >
                        SIGN IN
                    </button>

                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 my-7">
                    <div className="h-px flex-1 bg-zinc-200"></div>

                    <span className="text-xs text-zinc-400">
                        OR CONTINUE WITH
                    </span>

                    <div className="h-px flex-1 bg-zinc-200"></div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-3 gap-3">

                    <button
                        type="button"
                        className="h-11 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-50 transition flex items-center justify-center font-medium text-sm"
                    >
                        
                        <span className="ml-2">Apple</span>
                    </button>

                    <button
                        type="button"
                        className="h-11 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-50 transition flex items-center justify-center font-medium text-sm"
                    >
                        G
                        <span className="ml-2">Google</span>
                    </button>

                    <button
                        type="button"
                        className="h-11 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-50 transition flex items-center justify-center font-medium text-sm"
                    >
                        ∞
                        <span className="ml-2">Meta</span>
                    </button>

                </div>

                {/* Register */}
                <div className="mt-7 pt-6 border-t border-zinc-100 text-center">
                    <p className="text-sm text-zinc-500">
                        Don't have an account?{" "}
                        <a
                            href="/register"
                            className="font-semibold text-zinc-900 hover:underline"
                        >
                            Create an account
                        </a>
                    </p>
                </div>

            </div>
        </div>
    );
}

export default Login;