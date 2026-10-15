import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerCustomer } from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    repeatPassword: "",
    agree: false,
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

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.repeatPassword) {
      newErrors.repeatPassword = "Please repeat your password";
    } else if (formData.password !== formData.repeatPassword) {
      newErrors.repeatPassword = "Passwords do not match";
    }

    if (!formData.agree) {
      newErrors.agree = "You must accept the Terms and Conditions";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      await registerCustomer({
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      navigate("/login");
    } catch (error) {
      setServerError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#ede7dd] flex items-center justify-center px-5 py-10">

      <div className="w-full max-w-lg bg-[#f8f4ee] rounded-2xl border border-[#d1c7ba] shadow-[0_10px_30px_rgba(70,55,40,0.08)] px-7 py-9 md:px-9">

        {/* Header */}
        <div className="text-center mb-8">

          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-2xl bg-[#2b2b2b] flex items-center justify-center shadow-sm">
              <span className="text-2xl">
                🛍️
              </span>
            </div>
          </div>

          <p className="text-xs uppercase tracking-[0.2em] text-[#8f7d68] mb-3">
            ShopKart
          </p>

          <h1 className="text-3xl font-semibold text-[#2b2b2b]">
            Create Account
          </h1>

          <p className="mt-2 text-sm text-[#6b6258]">
            Create your ShopKart account to get started.
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

          {/* Name */}
          <div>

            <label className="block mb-2 text-sm font-medium text-[#4b443d]">
              Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded-xl border border-[#cfc4b6] bg-[#fffdf9] text-sm text-[#2b2b2b] placeholder-[#9a9085] outline-none transition focus:border-[#8f7d68] focus:ring-2 focus:ring-[#8f7d68]/10"
            />

            {errors.name && (
              <p className="mt-1.5 text-sm text-red-500">
                {errors.name}
              </p>
            )}

          </div>

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

          {/* Phone */}
          <div>

            <label className="block mb-2 text-sm font-medium text-[#4b443d]">
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded-xl border border-[#cfc4b6] bg-[#fffdf9] text-sm text-[#2b2b2b] placeholder-[#9a9085] outline-none transition focus:border-[#8f7d68] focus:ring-2 focus:ring-[#8f7d68]/10"
            />

            {errors.phone && (
              <p className="mt-1.5 text-sm text-red-500">
                {errors.phone}
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

          {/* Repeat Password */}
          <div>

            <label className="block mb-2 text-sm font-medium text-[#4b443d]">
              Repeat your password
            </label>

            <input
              type="password"
              name="repeatPassword"
              placeholder="Repeat your password"
              value={formData.repeatPassword}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded-xl border border-[#cfc4b6] bg-[#fffdf9] text-sm text-[#2b2b2b] placeholder-[#9a9085] outline-none transition focus:border-[#8f7d68] focus:ring-2 focus:ring-[#8f7d68]/10"
            />

            {errors.repeatPassword && (
              <p className="mt-1.5 text-sm text-red-500">
                {errors.repeatPassword}
              </p>
            )}

          </div>

          {/* Terms */}
          <div>

            <div className="flex items-start gap-3">

              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                className="mt-1 h-4 w-4 cursor-pointer accent-[#2b2b2b]"
              />

              <label className="text-sm text-[#6b6258] leading-5">
                I agree to all{" "}
                <span className="font-medium text-[#2b2b2b]">
                  Terms and Conditions
                </span>
              </label>

            </div>

            {errors.agree && (
              <p className="mt-1.5 text-sm text-red-500">
                {errors.agree}
              </p>
            )}

          </div>

          {/* Sign Up */}
          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-[#2b2b2b] text-white text-sm font-semibold tracking-wide hover:opacity-90 active:scale-[0.99] transition"
          >
            SIGN UP
          </button>

        </form>

        {/* Login */}
        <div className="mt-7 pt-6 border-t border-[#ded5ca] text-center">

          <p className="text-sm text-[#6b6258]">
            Already have an account?{" "}

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-semibold text-[#2b2b2b] hover:underline"
            >
              Login here
            </button>
          </p>

        </div>

      </div>
    </div>
  );
}

export default Register;