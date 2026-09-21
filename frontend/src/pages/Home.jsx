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
      <div className="min-h-screen bg-zinc-100 flex items-center justify-center">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100">
      
      <Navbar />

      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg bg-white rounded-2xl border border-zinc-200 shadow-sm p-8">

          <h1 className="text-3xl font-semibold text-zinc-900">
            Welcome, {customer?.fullName} 👋
          </h1>

          <p className="mt-2 text-zinc-500">
            You are successfully logged in to ShopKart.
          </p>

          <div className="mt-8 space-y-4">

            <div className="border-b border-zinc-100 pb-4">
              <p className="text-sm text-zinc-500">Email</p>
              <p className="mt-1 font-medium text-zinc-900">
                {customer?.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-500">Phone</p>
              <p className="mt-1 font-medium text-zinc-900">
                {customer?.phone}
              </p>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}

export default Home;