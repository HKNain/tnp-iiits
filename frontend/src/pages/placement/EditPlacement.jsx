import React, { useEffect, useMemo, useState } from "react";
import API from "../../utils/axios";

const statusOptions = [
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

const EditPlacement = () => {
  const [placements, setPlacements] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [statusChanges, setStatusChanges] = useState({});
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      .flatMap((p) =>
        (p.companies || []).map((c) => ({
          ...c,
          placementId: p._id,
        })),
      );
  }, [placements, selectedYear]);

  const handleStatusChange = (companyId, value) => {
    setStatusChanges((prev) => ({ ...prev, [companyId]: value }));
    setError("");
    setSuccess("");
  };

  const handleUpdate = async (row) => {
    const nextStatus = statusChanges[row._id];
    if (!nextStatus || nextStatus === row.placementStatus) return;

    try {
      setUpdatingId(row._id);
      setError("");
      setSuccess("");

      const res = await API.patch("/placement/editDrives", {
        placementId: row.placementId,
        companyId: row._id,
        placementStatus: nextStatus,
      });

      if (res.data.flag) {
        setPlacements((prev) =>
          prev.map((p) => {
            if (p._id !== row.placementId) return p;
            return {
              ...p,
              companies: (p.companies || []).map((c) =>
                c._id === row._id ? { ...c, placementStatus: nextStatus } : c,
              ),
            };
          }),
        );

        setStatusChanges((prev) => {
          const copy = { ...prev };
          delete copy[row._id];
          return copy;
        });

        setSuccess("Placement status updated successfully");
      } else {
        setError(res.data.message || "Failed to update placement status");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "An error occurred while updating placement status",
      );
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-black to-gray-900 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Edit Placement</h1>
          <p className="text-gray-400">
            Select year and update company placement status
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

        {error && (
          <div className="mb-4 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 rounded-lg bg-green-500/20 border border-green-500/50 text-green-300">
            {success}
          </div>
        )}

        {loading ? (
          <p className="text-gray-400">Loading placement records...</p>
        ) : !selectedYear ? (
          <p className="text-gray-400">Please select a year.</p>
        ) : (
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
                    Current Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Change Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {selectedYearCompanies.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-gray-400"
                    >
                      No placement data found for {selectedYear}
                    </td>
                  </tr>
                ) : (
                  selectedYearCompanies.map((row) => {
                    const selectedStatus =
                      statusChanges[row._id] ?? row.placementStatus;
                    const changed = selectedStatus !== row.placementStatus;

                    return (
                      <tr
                        key={row._id}
                        className="border-b border-gray-700 hover:bg-gray-700/40 transition"
                      >
                        <td className="px-6 py-4 text-sm text-white">
                          {row.companyName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {row.companyEmail}
                        </td>
                        <td className="px-6 py-4 text-sm text-cyan-300">
                          {prettyStatus(row.placementStatus)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <select
                            value={selectedStatus}
                            onChange={(e) =>
                              handleStatusChange(row._id, e.target.value)
                            }
                            className="rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {prettyStatus(status)}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => handleUpdate(row)}
                            disabled={!changed || updatingId === row._id}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${
                              !changed || updatingId === row._id
                                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                                : "bg-linear-to-r from-cyan-500 to-purple-600 text-white hover:opacity-90"
                            }`}
                          >
                            {updatingId === row._id ? "Updating..." : "Update"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditPlacement;
