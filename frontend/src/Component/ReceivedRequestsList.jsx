import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const statusStyles = {
  pending: "bg-yellow-300 text-yellow-900",
  accepted: "bg-green-300 text-green-900",
  completed: "bg-blue-300 text-blue-900",
  declined: "bg-red-300 text-red-900",
};

const ReceivedRequestsList = () => {
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch received requests from backend
  const fetchReceivedRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token missing.");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/request/requests/received`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setReceivedRequests(res.data.requests || []);
    } catch (error) {
      console.error("Error fetching received requests:", error);
      toast.error("Failed to load received requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceivedRequests();
  }, []);

  // Update request status (accept, decline, complete)
  const updateStatus = async (requestId, status) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token missing.");
        return;
      }

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/request/request/${requestId}`,
        { status }, // Backend expects "status" field for update
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(`Request ${status} successfully!`);
      fetchReceivedRequests(); // Refresh list after update
    } catch (error) {
      console.error(
        "Error updating request status:",
        error?.response?.data || error.message
      );
      toast.error(error?.response?.data?.message || "Failed to update request status.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-6 text-gray-500 font-semibold animate-pulse">
        Loading received requests...
      </div>
    );
  }

  return (
    <section className="max-w-4xl mx-auto my-10 px-6">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
        Received Requests
      </h2>

      {receivedRequests.length === 0 ? (
        <p className="text-center text-gray-600">No received requests found.</p>
      ) : (
        <ul className="space-y-4">
          {receivedRequests.map(
            ({
              _id,
              senderId,
              offeredSkills,
              requestedSkills,
              response,
              createdAt,
            }) => (
              <li
                key={_id}
                className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white shadow-md rounded-lg p-5 animate-slideIn"
              >
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      From: {senderId?.firstName || "User"} {senderId?.lastName || ""}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Received: {new Date(createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-semibold">Offered:</span>{" "}
                      {offeredSkills?.join(", ") || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Requested:</span>{" "}
                      {requestedSkills?.join(", ") || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center space-x-2 mt-3 md:mt-0">
                  {response === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(_id, "accepted")}
                        className="px-4 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateStatus(_id, "declined")}
                        className="px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                      >
                        Decline
                      </button>
                    </>
                  )}
                  {response === "accepted" && (
                    <button
                      onClick={() => updateStatus(_id, "completed")}
                      className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
                      Mark Complete
                    </button>
                  )}
                  <span
                    className={`ml-3 mt-2 md:mt-0 px-4 py-1 rounded-full font-semibold ${
                      statusStyles[response] || "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {response?.charAt(0).toUpperCase() + response?.slice(1)}
                  </span>
                </div>
              </li>
            )
          )}
        </ul>
      )}
    </section>
  );
};

export default ReceivedRequestsList;
