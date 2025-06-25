import React, { useEffect, useState } from "react";
import axios from "axios";

const statusStyles = {
  pending: "bg-yellow-300 text-yellow-900",
  accepted: "bg-green-300 text-green-900",
  completed: "bg-blue-300 text-blue-900",
  declined: "bg-red-300 text-red-900",
};

const SentRequestsList = () => {
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSentRequests = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No auth token found.");
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/request/requests/sent`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setSentRequests(res.data.requests || []);
      } catch (error) {
        console.error("Error fetching sent requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSentRequests();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-6 text-gray-500 font-semibold animate-pulse">
        Loading sent requests...
      </div>
    );
  }

  return (
    <section className="max-w-4xl mx-auto my-10 px-6">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
        Sent Requests
      </h2>

      {sentRequests.length === 0 ? (
        <p className="text-center text-gray-600">No sent requests found.</p>
      ) : (
        <ul className="space-y-4">
          {sentRequests.map(
            ({
              _id,
              receiverId,
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
                      To: {receiverId?.firstName || "User"}{" "}
                      {receiverId?.lastName || ""}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Sent: {new Date(createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-semibold">Offered:</span>{" "}
                      {offeredSkills.join(", ")}
                    </p>
                    <p>
                      <span className="font-semibold">Requested:</span>{" "}
                      {requestedSkills.join(", ")}
                    </p>
                  </div>
                </div>

                <span
                  className={`mt-2 md:mt-0 px-4 py-1 rounded-full font-semibold ${
                    statusStyles[response] || "bg-gray-200 text-gray-800"
                  }`}
                >
                  {response?.charAt(0).toUpperCase() + response?.slice(1)}
                </span>
              </li>
            )
          )}
        </ul>
      )}
    </section>
  );
};

export default SentRequestsList;
