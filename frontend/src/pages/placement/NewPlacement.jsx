import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/axios";

const NewPlacement = () => {
  const navigate = useNavigate();
  const [year, setYear] = useState("");
  const [companies, setCompanies] = useState([
    { id: Date.now(), companyName: "", companyEmail: "", placementStatus: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const statusOptions = [
  "interested",
  "notInterested",
  "dataSent",
  "followUp",
  "shortListRecieved",
  "confirmed",
];

  const handleYearChange = (e) => {
    setYear(e.target.value);
    setError("");
  };

  const handleCompanyChange = (id, field, value) => {
    setCompanies((prev) =>
      prev.map((company) =>
        company.id === id ? { ...company, [field]: value } : company,
      ),
    );
    setError("");
  };

  const addCompany = () => {
    setCompanies((prev) => [
      ...prev,
      { id: Date.now(), companyName: "", companyEmail: "", placementStatus: "" },
    ]);
  };

  const removeCompany = (id) => {
    if (companies.length === 1) {
      setError("At least one company is required");
      return;
    }
    setCompanies((prev) => prev.filter((company) => company.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!year.trim()) {
      setError("Year is required");
      return;
    }

    const yearNum = parseInt(year);
    const currentYear = new Date().getFullYear();
    if (isNaN(yearNum) || yearNum < 2000 || yearNum > currentYear + 10) {
      setError("Please enter a valid year");
      return;
    }

    const validCompanies = companies.filter(
      (c) => c.companyName.trim() || c.companyEmail.trim() || c.placementStatus,
    );

    if (validCompanies.length === 0) {
      setError("At least one company with details is required");
      return;
    }

    // Validate each company
    for (let i = 0; i < validCompanies.length; i++) {
      const company = validCompanies[i];
      if (!company.companyName.trim()) {
        setError(`Company name is required for entry ${i + 1}`);
        return;
      }
      if (!company.companyEmail.trim()) {
        setError(`Company email is required for entry ${i + 1}`);
        return;
      }
      if (!company.placementStatus) {
        setError(`Status is required for entry ${i + 1}`);
        return;
      }
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(company.companyEmail)) {
        setError(`Invalid email format for ${company.companyName}`);
        return;
      }
    }

    setLoading(true);

    try {
      const response = await API.post("/placement/newDrives", {
        year: yearNum,
        companies: validCompanies.map(({ id, ...rest }) => rest),
      });

      if (response.data.flag) {
        setSuccess("Placement records created successfully!");
        setYear("");
        setCompanies([{ id: Date.now(), companyName: "", companyEmail: "", placementStatus: "" }]);

        setTimeout(() => {
          navigate("/placement/all");
        }, 2000);
      } else {
        setError(response.data.message || "Failed to create placement records");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while creating placement records",
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
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/placement/all")}
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
            Back to Placements
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
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white">
              New Placement Record
            </h1>
          </div>
          <p className="text-gray-400">
            Add placement details for companies by year
          </p>
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
            {/* Year Input */}
            <div className="flex flex-col gap-2 pb-6 border-b border-gray-700">
              <label
                htmlFor="year"
                className="text-lg font-semibold text-gray-300"
              >
                Placement Year <span className="text-cyan-400">*</span>
              </label>
              <input
                id="year"
                type="number"
                placeholder="e.g., 2024"
                value={year}
                onChange={handleYearChange}
                min="2000"
                max={new Date().getFullYear() + 10}
                required
                className="w-full md:w-1/2 rounded-lg border border-gray-700 bg-gray-700 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
              />
              <p className="text-xs text-gray-500">
                Enter the year for these placement records
              </p>
            </div>

            {/* Companies Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Company Details
                </h2>
                <button
                  type="button"
                  onClick={addCompany}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition font-medium"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Company
                </button>
              </div>

              <div className="space-y-4">
                {companies.map((company, index) => (
                  <div
                    key={company.id}
                    className="bg-gray-700/50 border border-gray-600 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-300">
                        Company {index + 1}
                      </h3>
                      {companies.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCompany(company.id)}
                          className="text-red-400 hover:text-red-300 transition"
                          title="Remove company"
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Company Name */}
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-400">
                          Company Name <span className="text-cyan-400">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Google"
                          value={company.companyName}
                          onChange={(e) =>
                            handleCompanyChange(
                              company.id,
                              "companyName",
                              e.target.value,
                            )
                          }
                          className="rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                        />
                      </div>

                      {/* Company Email */}
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-400">
                          Company Email <span className="text-cyan-400">*</span>
                        </label>
                        <input
                          type="email"
                          placeholder="e.g., hr@company.com"
                          value={company.companyEmail}
                          onChange={(e) =>
                            handleCompanyChange(
                              company.id,
                              "companyEmail",
                              e.target.value,
                            )
                          }
                          className="rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                        />
                      </div>

                      {/* Status */}
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-400">
                          Status <span className="text-cyan-400">*</span>
                        </label>
                        <select
                          value={company.placementStatus}
                          onChange={(e) =>
                            handleCompanyChange(
                              company.id,
                              "placementStatus",
                              e.target.value,
                            )
                          }
                          className="rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                        >
                          <option value="">Select Status</option>
                          {statusOptions.map((placementStatus) => (
                            <option key={placementStatus} value={placementStatus}>
                              {placementStatus}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-linear-to-r from-cyan-500 to-purple-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-cyan-500/50 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg
                      className="inline animate-spin -ml-1 mr-2 h-5 w-5"
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
                    Saving...
                  </>
                ) : (
                  "Save Placement Records"
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/placement/all")}
                className="flex-1 sm:flex-initial sm:px-8 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewPlacement;
