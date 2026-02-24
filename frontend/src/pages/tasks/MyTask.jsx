import React, { useState, useEffect } from "react";
import API from "../../utils/axios";

const MyTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const userEmail = localStorage.getItem("userEmail") || "";

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      setLoading(true);
      const response = await API.get("/task/allTask");

      if (response.data.flag) {
        // Filter tasks where assignedTo matches userEmail
        const myTasks = response.data.tasks.filter(
          (task) => task.assignedTo === userEmail,
        );
        setTasks(myTasks);
        setError("");
      } else {
        setError(response.data.message || "Failed to fetch tasks");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred while fetching tasks",
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isOverdue = (lastDate) => {
    return new Date(lastDate) < new Date();
  };

  const getDaysRemaining = (lastDate) => {
    const today = new Date();
    const deadline = new Date(lastDate);
    const daysRemaining = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    return daysRemaining;
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-black to-gray-900 px-4 py-8">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-linear-to-r from-cyan-500 to-purple-600 rounded-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white">My Tasks</h1>
          </div>
          <p className="text-gray-400">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}{" "}
            assigned to you
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative">
          <svg
            className="absolute left-4 top-3.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search your tasks by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
          />
        </div>

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

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <svg
                className="animate-spin h-12 w-12 text-cyan-500 mx-auto mb-4"
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
              <p className="text-gray-400">Loading your tasks...</p>
            </div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-16">
            <svg
              className="w-16 h-16 text-gray-600 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              {tasks.length === 0 ? "No tasks assigned" : "No matching tasks"}
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Try adjusting your search terms"
                : "You don't have any tasks assigned to you yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => {
              const daysRemaining = getDaysRemaining(task.lastDate);
              const isOverdueTask = isOverdue(task.lastDate);

              return (
                <div
                  key={task._id}
                  className={`group rounded-lg p-6 border transition duration-300 transform hover:scale-105 ${
                    isOverdueTask
                      ? "bg-red-500/10 border-red-500/30 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20"
                      : daysRemaining <= 3 && daysRemaining > 0
                        ? "bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/20"
                        : "bg-gray-800 border-gray-700 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20"
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-lg font-bold text-white flex-1 line-clamp-2 group-hover:text-cyan-400 transition">
                      {task.title}
                    </h2>
                    {isOverdueTask && (
                      <span className="ml-2 px-3 py-1 bg-red-500/20 border border-red-500/50 text-red-300 text-xs font-semibold rounded-full shrink-0">
                        Overdue
                      </span>
                    )}
                    {!isOverdueTask &&
                      daysRemaining <= 3 &&
                      daysRemaining > 0 && (
                        <span className="ml-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 text-xs font-semibold rounded-full shrink-0">
                          Due Soon
                        </span>
                      )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {task.description}
                  </p>

                  {/* Progress/Days Remaining */}
                  <div className="mb-4 p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300 font-medium">
                        Time remaining
                      </span>
                      <span
                        className={`text-sm font-bold ${
                          isOverdueTask
                            ? "text-red-400"
                            : daysRemaining <= 3
                              ? "text-yellow-400"
                              : "text-cyan-400"
                        }`}
                      >
                        {isOverdueTask
                          ? "Overdue"
                          : daysRemaining <= 0
                            ? "Today"
                            : `${daysRemaining} day${daysRemaining !== 1 ? "s" : ""}`}
                      </span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isOverdueTask
                            ? "bg-red-500"
                            : daysRemaining <= 3
                              ? "bg-yellow-500"
                              : "bg-cyan-500"
                        }`}
                        style={{
                          width: `${Math.max(
                            0,
                            Math.min(
                              100,
                              ((30 - Math.abs(daysRemaining)) / 30) * 100,
                            ),
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <div className="flex items-center gap-2 text-sm">
                      <svg
                        className="w-4 h-4 text-purple-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v2H4a2 2 0 00-2 2v2h16V7a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v2H7V3a1 1 0 00-1-1zm0 5a2 2 0 002 2h8a2 2 0 002-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-400">
                        {formatDate(task.lastDate)}
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        isOverdueTask
                          ? "bg-red-500/20 text-red-300 border border-red-500/50"
                          : daysRemaining <= 3
                            ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/50"
                            : "bg-green-500/20 text-green-300 border border-green-500/50"
                      }`}
                    >
                      {isOverdueTask ? "Overdue" : "Active"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTask;
