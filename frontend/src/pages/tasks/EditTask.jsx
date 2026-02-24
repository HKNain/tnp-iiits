import React, { useState, useEffect } from "react";
import API from "../../utils/axios";

const EditTask = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [updatedTasks, setUpdatedTasks] = useState({});
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchTasksAndUsers();
  }, []);

  const fetchTasksAndUsers = async () => {
    try {
      setLoading(true);
      const [tasksRes, usersRes] = await Promise.all([
        API.get("/task/allTask"),
        API.get("/auth/allUsers"),
      ]);

      if (tasksRes.data.flag) {
        setTasks(tasksRes.data.tasks);
      }

      if (usersRes.data.flag) {
        setUsers(usersRes.data.users);
      }

      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred while fetching data",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAssignedToChange = (taskId, newAssignedTo) => {
    setUpdatedTasks((prev) => ({
      ...prev,
      [taskId]: newAssignedTo,
    }));
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

  const handleUpdateTasks = async () => {
    if (Object.keys(updatedTasks).length === 0) {
      setError("No changes to update");
      return;
    }

    setUpdating(true);
    setError("");
    setSuccess("");

    try {
      const updatePromises = Object.entries(updatedTasks).map(
        ([taskId, assignedTo]) =>
          API.patch("/task/editTask", {
            taskId,
            assignedTo,
          }),
      );

      await Promise.all(updatePromises);

      setSuccess("Tasks updated successfully!");
      setUpdatedTasks({});

      // Refresh tasks
      setTimeout(() => {
        fetchTasksAndUsers();
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred while updating tasks",
      );
    } finally {
      setUpdating(false);
    }
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const hasChanges = Object.keys(updatedTasks).length > 0;

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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-linear-to-r from-cyan-500 to-purple-600 rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-white">Edit Tasks</h1>
            </div>
            <p className="text-gray-400">
              Update task assignments
              {hasChanges && (
                <span className="ml-2 text-cyan-400 font-semibold">
                  ({Object.keys(updatedTasks).length} change
                  {Object.keys(updatedTasks).length !== 1 ? "s" : ""} pending)
                </span>
              )}
            </p>
          </div>

          {/* Update Button */}
          <button
            onClick={handleUpdateTasks}
            disabled={!hasChanges || updating}
            className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
              hasChanges
                ? "bg-linear-to-r from-cyan-500 to-purple-600 text-white shadow-lg hover:shadow-cyan-500/50 hover:opacity-90"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            {updating ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
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
                Updating...
              </>
            ) : (
              <>
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Update Tasks
              </>
            )}
          </button>
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
            placeholder="Search tasks by title or description..."
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
              <p className="text-gray-400">Loading tasks...</p>
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
              No tasks found
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Try adjusting your search terms"
                : "No tasks available"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-gray-800 rounded-lg border border-gray-700">
            <table className="w-full">
              {/* Table Head */}
              <thead>
                <tr className="border-b border-gray-700 bg-gray-900">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Current Assignment
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Assign To
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Last Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Status
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {filteredTasks.map((task) => (
                  <tr
                    key={task._id}
                    className="border-b border-gray-700 hover:bg-gray-700/50 transition"
                  >
                    <td className="px-6 py-4 text-sm text-white font-medium max-w-xs truncate">
                      {task.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">
                      {task.description}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-gray-700 text-cyan-300 rounded-full inline-block">
                        {task.assignedTo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <select
                        value={updatedTasks[task._id] || task.assignedTo}
                        onChange={(e) =>
                          handleAssignedToChange(task._id, e.target.value)
                        }
                        className={`px-3 py-2 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                          updatedTasks[task._id]
                            ? "bg-purple-600/40 border-purple-500 text-white"
                            : "bg-gray-700 border-gray-600 text-gray-300"
                        }`}
                      >
                        <option value="">Select assignee</option>
                        {users.map((user) => (
                          <option key={user._id} value={user.email}>
                            {user.firstName} {user.lastName}
                            {user.role === "admin" ? " (Admin)" : " (Member)"}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {formatDate(task.lastDate)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          isOverdue(task.lastDate)
                            ? "bg-red-500/20 text-red-300 border border-red-500/50"
                            : "bg-green-500/20 text-green-300 border border-green-500/50"
                        }`}
                      >
                        {isOverdue(task.lastDate) ? "Overdue" : "Active"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditTask;
