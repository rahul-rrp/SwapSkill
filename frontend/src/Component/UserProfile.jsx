import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getUserDetails } from "../services/oprations/auth";
import { Loader2, UserCircle2, Mail, BrainCircuit } from "lucide-react";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const getdel = async () => {
    setLoading(true);
    try {
      const getUserDe = await getUserDetails();
      setProfile(getUserDe.user);
    } catch (error) {
      toast.error("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getdel();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-10 text-blue-500">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        Loading Profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center mt-10 text-red-600">
        No profile data found.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-3xl shadow-xl mt-12 border border-gray-200">
      <div className="flex flex-col items-center space-y-4">
        <UserCircle2 className="w-20 h-20 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">
          {profile.firstName + " " + profile.lastName}
        </h2>
        <p className="text-gray-600 flex items-center gap-2">
          <Mail className="w-4 h-4" />
          {profile.email}
        </p>
        <hr className="w-full border-t border-gray-300 my-4" />
        <div className="w-full space-y-2">
          <div className="flex items-center gap-2 text-gray-700">
            <BrainCircuit className="w-5 h-5 text-indigo-600" />
            <strong>Skills Offered:</strong>{" "}
            {profile.skillsOffered?.join(", ") || "Not added"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
