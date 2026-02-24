import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/axios";

const NewTask = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    lastDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await API.get("/auth/allUsers");

      if (response.data.flag) {
        setUsers(response.data.users || []);
      } else {
        setError("Failed to fetch users");
      }
    } catch (error) {
      setError("Error loading users");
      console.log(error)
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!formData.title.trim()) {
      setError("Task title is required");
      return;
    }

    if (formData.title.trim().length > 100) {
      setError("Task title must be less than 100 characters");
      return;
    }

    if (!formData.description.trim()) {
      setError("Task description is required");
      return;
    }

    if (formData.description.trim().length > 500) {
      setError("Task description must be less than 500 characters");
      return;
    }

    if (!formData.assignedTo) {
      setError("Please select a user to assign the task");
      return;
    }

    if (!formData.lastDate) {
      setError("Last date is required");
      return;
    }

    // Check if date is not in the past
    const selectedDate = new Date(formData.lastDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError("Last date cannot be in the past");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/task/newTask", {
        title: formData.title.trim(),
        description: formData.description.trim(),
        assignedTo: formData.assignedTo,
        lastDate: formData.lastDate,
      });

      if (response.data.flag) {
        setSuccess("Task created successfully!");
        setFormData({
          title: "",
          description: "",
          assignedTo: "",
          lastDate: "",
        });

        // Redirect to all tasks after 2 seconds
        setTimeout(() => {
          navigate("/task/all");
        }, 2000);
      } else {
        setError(response.data.message || "Failed to create task");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred while creating task",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-black to-gray-900 px-4 py-8">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/task/all")}
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition mb-4"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Tasks
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-linear-to-r from-cyan-500 to-purple-600 rounded-lg">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white">Create New Task</h1>
          </div>
          <p className="text-gray-400">Add a new task to the system</p>
        </div>

        {/* Card */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-8 backdrop-blur-md">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg flex items-start gap-3">
              <svg
                className="w-5 h-5 shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 text-green-300 rounded-lg flex items-start gap-3">
              <svg
                className="w-5 h-5 shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="title"
                className="text-sm font-semibold text-gray-300"
              >
                Task Title <span className="text-cyan-400">*</span>
              </label>
              <input
                id="title"
                type="text"
                name="title"
                placeholder="Enter task title"
                value={formData.title}
                onChange={handleChange}
                maxLength="100"
                required
                className="w-full rounded-lg border border-gray-700 bg-gray-700 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
              />
              <p className="text-xs text-gray-500">
                {formData.title.length}/100 characters
              </p>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="description"
                className="text-sm font-semibold text-gray-300"
              >
                Task Description <span className="text-cyan-400">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter task description"
                value={formData.description}
                onChange={handleChange}
                maxLength="500"
                rows="4"
                required
                className="w-full rounded-lg border border-gray-700 bg-gray-700 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition resize-none"
              />
              <p className="text-xs text-gray-500">
                {formData.description.length}/500 characters
              </p>
            </div>

            {/* Assigned To */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="assignedTo"
                className="text-sm font-semibold text-gray-300"
              >
                Assigned To <span className="text-cyan-400">*</span>
              </label>
              {loadingUsers ? (
                <div className="w-full rounded-lg border border-gray-700 bg-gray-700 px-4 py-3 text-gray-400">
                  Loading users...
                </div>
              ) : (
                <select
                  id="assignedTo"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-700 bg-gray-700 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                >
                  <option value="">Select a user</option>
                  {users.map((user) => (
                    <option key={user._id} value={user.email}>
                      {user.firstName} {user.lastName} ({user.email}) -{" "}
                      {user.role}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Last Date */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="lastDate"
                className="text-sm font-semibold text-gray-300"
              >
                Last Date <span className="text-cyan-400">*</span>
              </label>
              <input
                id="lastDate"
                type="date"
                name="lastDate"
                value={formData.lastDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full rounded-lg border border-gray-700 bg-gray-700 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
              />
              <p className="text-xs text-gray-500">
                Select a date for task completion
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-cyan-500 to-purple-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-cyan-500/50 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <svg
                    className="inline animate-spin -ml-1 mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating task...
                </>
              ) : (
                "Create Task"
              )}
            </button>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={() => navigate("/task/all")}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewTask;
