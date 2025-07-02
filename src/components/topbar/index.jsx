import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Notification from "../../components/notification";
import essilogo from "../../assets/images/essi-logo.png";
import Profile from "../../views/auth/Profile.jsx";
import { url } from "../../utils/Constants";

const Topbar = () => {
  const navigate = useNavigate();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [userimage, setUserimage] = useState("");

  useEffect(() => {
    setUsername(localStorage.getItem("user_name"));
    setUserimage(localStorage.getItem("image"));
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${url}/accounts/logout-user/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          refresh: localStorage.getItem("refresh_token"),
        }),
      });

      if (response.ok) {
        localStorage.clear();
        navigate("/login");
        Notification.showSuccessMessage(
          "Logout Successfully!",
          "You have been logged out successfully."
        );
      }
    } catch (err) {
      Notification.showErrorMessage("Error", "Server error!");
    }
  };

  return (
    <>
      <div className="flex justify-between items-center bg-gray-100 p-4 shadow-md">
        {/* <img src={essilogo} alt="MOD Logo" className="h-12" /> */}
        <div className="h-full flex items-center font-bold text-xl">
          VISITOR MANAGEMENT SYSTEM
        </div>

        {localStorage.getItem("token") && (
          <div className="flex items-center space-x-2">
            <div
              className="flex items-center space-x-2 bg-customGreen rounded-full p-1 transform scale-90 shadow-md min-w-[130px]"
              onClick={() => setProfileModalOpen(true)}
            >
              <div className="w-8 h-8 border-2 border-gray-300 rounded-full overflow-hidden bg-customGreen flex justify-center items-center">
                {userimage !== "null" && userimage ? (
                  <img
                    src={`data:image/jpeg;base64,${userimage}`}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white">
                    {username ? username.charAt(0).toUpperCase() : "N"}
                  </span>
                )}
              </div>
              <span className="text-white p-1">{username}</span>
            </div>

            <button
              className="bg-customGreen hover:bg-gray-700 text-white py-2 px-4 rounded-3xl shadow-md flex items-center text-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      <Profile
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </>
  );
};

export default Topbar;
