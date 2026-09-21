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
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-zinc-200 shadow-sm px-8 py-9">

        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-zinc-900">
            Create Account
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Create your ShopKart account to get started.
          </p>
        </div>

        {serverError && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block mb-2 text-sm font-medium text-zinc-700">
              Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded-lg border border-zinc-300 bg-white text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-600 focus:ring-2 focus:ring-zinc-100"
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-500">
                {errors.name}
              </p>
            )}
          </div>

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
              className="w-full h-12 px-4 rounded-lg border border-zinc-300 bg-white text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-600 focus:ring-2 focus:ring-zinc-100"
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-zinc-700">
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded-lg border border-zinc-300 bg-white text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-600 focus:ring-2 focus:ring-zinc-100"
            />

            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">
                {errors.phone}
              </p>
            )}
          </div>

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
              className="w-full h-12 px-4 rounded-lg border border-zinc-300 bg-white text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-600 focus:ring-2 focus:ring-zinc-100"
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-zinc-700">
              Repeat your password
            </label>

            <input
              type="password"
              name="repeatPassword"
              placeholder="Repeat your password"
              value={formData.repeatPassword}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded-lg border border-zinc-300 bg-white text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-600 focus:ring-2 focus:ring-zinc-100"
            />

            {errors.repeatPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.repeatPassword}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                className="mt-0.5 h-4 w-4 cursor-pointer accent-zinc-900"
              />

              <label className="text-sm text-zinc-600 leading-5">
                I agree to all{" "}
                <span className="font-medium text-zinc-900">
                  Terms and Conditions
                </span>
              </label>
            </div>

            {errors.agree && (
              <p className="mt-1 text-sm text-red-500">
                {errors.agree}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-lg bg-zinc-900 text-white text-sm font-semibold tracking-wide hover:bg-zinc-800 active:scale-[0.99] transition"
          >
            SIGN UP
          </button>

        </form>

        <div className="mt-7 pt-6 border-t border-zinc-100 text-center">
          <p className="text-sm text-zinc-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-semibold text-zinc-900 hover:underline"
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