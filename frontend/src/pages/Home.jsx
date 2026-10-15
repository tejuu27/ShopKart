import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentCustomer } from "../services/api";
import Navbar from "../components/Navbar";

function Home() {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const data = await getCurrentCustomer();

        setCustomer(data);
      } catch (error) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ede7dd] flex items-center justify-center">
        <p className="text-[#6b6258] text-lg">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ede7dd] text-[#2b2b2b]">

      <Navbar />

      <main className="px-5 py-12 md:py-20">
        <div className="max-w-5xl mx-auto">

          {/* Hero */}
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.2em] text-[#8f7d68] mb-3">
              Welcome to ShopKart
            </p>

            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              Welcome, {customer?.fullName} 👋
            </h1>

            <p className="mt-4 text-[#6b6258] text-lg">
              Discover products you'll love.
            </p>

            <button
              onClick={() => navigate("/products")}
              className="mt-7 px-6 py-3 rounded-xl bg-[#2b2b2b] text-white font-medium hover:opacity-90 transition"
            >
              Explore Products
            </button>
          </div>

          {/* Customer Card */}
          <div className="max-w-xl mx-auto bg-[#f8f4ee] rounded-2xl border border-[#d1c7ba] shadow-[0_10px_30px_rgba(70,55,40,0.08)] p-7 md:p-9">

            <h2 className="text-2xl font-semibold mb-7">
              Your Account
            </h2>

            <div className="space-y-5">

              <div className="border-b border-[#ded5ca] pb-5">
                <p className="text-sm text-[#8f7d68] mb-1">
                  Full Name
                </p>

                <p className="font-medium text-lg">
                  {customer?.fullName}
                </p>
              </div>

              <div className="border-b border-[#ded5ca] pb-5">
                <p className="text-sm text-[#8f7d68] mb-1">
                  Email
                </p>

                <p className="font-medium text-lg break-words">
                  {customer?.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-[#8f7d68] mb-1">
                  Phone
                </p>

                <p className="font-medium text-lg">
                  {customer?.phone}
                </p>
              </div>

            </div>

          </div>

        </div>
      </main>

    </div>
  );
}

export default Home;

