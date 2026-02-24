import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const userEmail = localStorage.getItem("userEmail");

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const cards = [
    {
      title: "My Tasks",
      description: "View tasks assigned to you",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
        </svg>
      ),
      route: "/task/my",
      color: "from-cyan-500 to-blue-600",
      allowedRoles: ["admin", "member"],
    },
    {
      title: "All Tasks",
      description: "View all tasks in the system",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 3a2 2 0 00-2 2v6h16V5a2 2 0 00-2-2H5zm16 9H3v5a2 2 0 002 2h14a2 2 0 002-2v-5z" />
        </svg>
      ),
      route: "/task/all",
      color: "from-purple-500 to-pink-600",
      allowedRoles: ["admin", "member"],
    },
    {
      title: "Create Task",
      description: "Add a new task to the system",
      icon: (
        <svg
          className="w-8 h-8"
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
      ),
      route: "/task/new",
      color: "from-green-500 to-emerald-600",
      allowedRoles: ["admin", "member"],
    },
    {
      title: "Edit Tasks",
      description: "Update task assignments",
      icon: (
        <svg
          className="w-8 h-8"
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
      ),
      route: "/task/edit",
      color: "from-yellow-500 to-orange-600",
      allowedRoles: ["admin", "member"],
    },

    // Placement Cards
    {
      title: "All Placements",
      description: "View placement stats by year",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 17v-6m3 6V7m3 10v-4m4 6H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2z"
          />
        </svg>
      ),
      route: "/placement/all",
      color: "from-cyan-500 to-indigo-600",
      allowedRoles: ["admin", "member"],
    },
    {
      title: "Create Placement",
      description: "Add placement records for a year",
      icon: (
        <svg
          className="w-8 h-8"
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
      ),
      route: "/placement/new",
      color: "from-emerald-500 to-teal-600",
      allowedRoles: ["admin", "member"],
    },
    {
      title: "Edit Placement",
      description: "Update company placement status",
      icon: (
        <svg
          className="w-8 h-8"
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
      ),
      route: "/placement/edit",
      color: "from-amber-500 to-orange-600",
      allowedRoles: ["admin", "member"],
    },

    {
      title: "Delete Tasks",
      description: "Remove tasks from the system",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      ),
      route: "/task/delete",
      color: "from-red-500 to-rose-600",
      allowedRoles: ["admin"],
    },
    {
      title: "Create Member",
      description: "Add new admin or member",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
          />
        </svg>
      ),
      route: "/newUser",
      color: "from-indigo-500 to-purple-600",
      allowedRoles: ["admin"],
    },
  ];

  const filteredCards = cards.filter((card) =>
    card.allowedRoles.includes(userRole),
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
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
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
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                  />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-white">Dashboard</h1>
            </div>
            <p className="text-gray-400">
              Welcome back,{" "}
              <span className="text-cyan-400 font-semibold">{userEmail}</span>
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Role:{" "}
              <span className="text-purple-400 font-medium capitalize">
                {userRole}
              </span>
            </p>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-3 bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/50 rounded-lg transition font-semibold"
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredCards.map((card, index) => (
            <div
              key={index}
              onClick={() => navigate(card.route)}
              className="group bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-transparent hover:shadow-2xl transition duration-300 cursor-pointer transform hover:scale-105 relative overflow-hidden"
            >
              {/* linear overlay on hover */}
              <div
                className={`absolute inset-0 bg-linear-to-br ${card.color} opacity-0 group-hover:opacity-10 transition duration-300`}
              ></div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div
                  className={`inline-flex p-4 bg-linear-to-br ${card.color} rounded-lg text-white mb-4 group-hover:scale-110 transition duration-300`}
                >
                  {card.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-4">{card.description}</p>

                {/* Arrow Icon */}
                <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm group-hover:gap-3 transition-all">
                  <span>Go to {card.title}</span>
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Border glow effect */}
              <div
                className={`absolute inset-0 rounded-xl bg-linear-to-br ${card.color} opacity-0 group-hover:opacity-20 blur-xl transition duration-300`}
              ></div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mt-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-cyan-500/20 rounded-lg">
              <svg
                className="w-6 h-6 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Quick Tips
              </h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>
                    Click on any card above to navigate to that section
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>Use "My Tasks" to view tasks assigned to you</span>
                </li>
                {userRole === "admin" && (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>
                        As an admin, you have access to all features including
                        task management
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>
                        Remember to regularly review and update task assignments
                      </span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-8">
          © 2024 TnP IIITS. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
