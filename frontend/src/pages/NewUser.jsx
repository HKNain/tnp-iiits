import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios.js"; // adjust path to your axios instance

const NewUser = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { data } = await API.post(
        "/auth/signup",
        {
          ...formData,
          role: "member",
        },
        {
          withCredentials: true,
        },
      );

      if (!data.flag) {
        setError(data.message || "Failed to create member");
        return;
      }

      setMessage("Member created successfully");
      setFormData({ firstName: "", lastName: "", email: "", password: "" });

      setTimeout(() => navigate("/dashboard"), 700);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Server error while creating member",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-1">Create Member</h1>
        <p className="text-gray-400 text-sm mb-6">
          New user will be created with role:{" "}
          <span className="text-cyan-400">member</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First name"
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-cyan-500"
          />
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last name"
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-cyan-500"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-cyan-500"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-cyan-500"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {message && <p className="text-green-400 text-sm">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 disabled:opacity-60 font-semibold"
          >
            {loading ? "Creating..." : "Create Member"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewUser;
