import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { url } from "../../utils/Constants";
import Notification from "../../components/notification";
import modlogo from "../../assets/images/web-logo.png";
import footerwave from "../../assets/images/footer-wave.png";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Loading from "../../components/loading";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${url}/accounts/login-user/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const json = await response.json();

      if (response.ok) {
        Notification.showSuccessMessage("Welcome", "Logged in Successfully");

        localStorage.setItem("user_id", json.id);
        localStorage.setItem("user_name", json.username);
        localStorage.setItem("user_type", json.user_type);
        localStorage.setItem("image", json.image);
        localStorage.setItem("token", json.token.access);
        localStorage.setItem("refresh_token", json.token.refresh);
        localStorage.setItem("userInfo", JSON.stringify(json));

        setUsername("");
        setPassword("");
        navigate("/");
      } else {
        setIsLoading(false);
        Notification.showErrorMessage("Login Failed", json.error || "Invalid credentials");
      }
    } catch (err) {
      setIsLoading(false);
      Notification.showErrorMessage("Error", "Server error!");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-900 to-blue-600">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-indigo-700 to-blue-600 relative overflow-hidden px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/20 backdrop-blur-xl text-white p-10 rounded-3xl shadow-2xl border border-white/20 animate-fadeIn"
      >
        <div className="flex justify-center mb-4">
          <img src={modlogo} alt="Ministry of Defence" className="h-24 drop-shadow-xl" />
        </div>
        <h2 className="text-center text-3xl font-bold mb-2">Visitor Management System</h2>
        <p className="text-center text-lg mb-6 opacity-80">विज़िटर प्रबंधन प्रणाली</p>

        <div className="mb-4">
          <input
            type="text"
            id="username"
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/30 transition-all duration-300"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-6 relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            className="w-full px-4 py-2 pr-10 rounded-lg bg-white/20 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/30 transition-all duration-300"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={handleTogglePasswordVisibility}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-white/80 hover:text-white transition-colors duration-200"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-600 to-green-500 hover:from-green-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-md"
        >
          Login
        </button>
      </form>

      <div className="absolute bottom-0 w-full animate-slideUp">
        <img src={footerwave} alt="Wave" className="w-full object-cover" />
      </div>
    </div>
  );
};

export default Login;
