import React, { useEffect, useMemo, useState } from "react";
import API from "../../utils/axios";

const statusOrder = [
  "interested",
  "notInterested",
  "dataSent",
  "followUp",
  "shortListRecieved",
  "confirmed",
];

const prettyStatus = (status) =>
  ({
    interested: "Interested",
    notInterested: "Not Interested",
    dataSent: "Data Sent",
    followUp: "Follow Up",
    shortListRecieved: "Shortlisted",
    confirmed: "Confirmed",
  })[status] || status;

const AllPlacement = () => {
  const [placements, setPlacements] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        setLoading(true);
        const res = await API.get("/placement/allDrives");

        if (res.data.flag) {
          const data = res.data.placements || [];
          setPlacements(data);

          const years = [...new Set(data.map((p) => String(p.year)))].sort(
            (a, b) => Number(b) - Number(a),
          );
          if (years.length > 0) setSelectedYear(years[0]);
          setError("");
        } else {
          setError(res.data.message || "Failed to fetch placement records");
        }
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "An error occurred while fetching placement records",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlacements();
  }, []);

  const years = useMemo(
    () =>
      [...new Set(placements.map((p) => String(p.year)))].sort(
        (a, b) => Number(b) - Number(a),
      ),
    [placements],
  );

  const selectedYearCompanies = useMemo(() => {
    if (!selectedYear) return [];
    return placements
      .filter((p) => String(p.year) === String(selectedYear))
      .flatMap((p) => p.companies || []);
  }, [placements, selectedYear]);

  const statusStats = useMemo(() => {
    const base = statusOrder.reduce((acc, s) => ({ ...acc, [s]: 0 }), {});
    selectedYearCompanies.forEach((c) => {
      if (base[c.placementStatus] !== undefined) base[c.placementStatus] += 1;
    });
    return base;
  }, [selectedYearCompanies]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-black to-gray-900 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Placement Stats
          </h1>
          <p className="text-gray-400">
            Select a year to view corresponding placement details
          </p>
        </div>

        <div className="mb-6 w-full sm:w-72">
          <label
            htmlFor="yearFilter"
            className="block text-sm text-gray-300 mb-2"
          >
            Select Year
          </label>
          <select
            id="yearFilter"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            {years.length === 0 ? (
              <option value="">No years available</option>
            ) : (
              years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))
            )}
          </select>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading placement records...</p>
        ) : error ? (
          <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300">
            {error}
          </div>
        ) : !selectedYear ? (
          <p className="text-gray-400">Please select a year.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
              {statusOrder.map((status) => (
                <div
                  key={status}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-center"
                >
                  <p className="text-xs text-gray-400">
                    {prettyStatus(status)}
                  </p>
                  <p className="text-xl font-bold text-cyan-400">
                    {statusStats[status]}
                  </p>
                </div>
              ))}
            </div>

            <div className="overflow-x-auto bg-gray-800 rounded-lg border border-gray-700">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700 bg-gray-900">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Company Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Company Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedYearCompanies.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-10 text-center text-gray-400"
                      >
                        No placement data found for {selectedYear}
                      </td>
                    </tr>
                  ) : (
                    selectedYearCompanies.map((company, index) => (
                      <tr
                        key={`${company.companyEmail}-${index}`}
                        className="border-b border-gray-700 hover:bg-gray-700/40 transition"
                      >
                        <td className="px-6 py-4 text-sm text-white">
                          {company.companyName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {company.companyEmail}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                            {prettyStatus(company.placementStatus)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllPlacement;
