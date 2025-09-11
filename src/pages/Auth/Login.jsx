// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // dummy auth logic
    if (username === "admin" && password === "1234") {
      navigate("/"); // redirect to home
    } else {
      alert("Invalid credentials!");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0f1260]">
      {/* Left Panel (Form + Workspaces) */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white rounded-tl-3xl rounded-tr-3xl ml-8 mt-8 p-10">
        <div className="w-full max-w-lg">
          {/* Step Indicator */}
          <div className="flex items-center space-x-2 text-gray-500 mb-6">
            <button className="text-xl">←</button>
            <span className="text-sm font-medium">3/4 Workspace</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold mb-2 text-center">
            Join your company on Acme!
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            These workspaces allow anyone from{" "}
            <span className="font-semibold">@onecotec</span> to join:
          </p>



          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-300"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-300"
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              Login
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-4 text-center">
            Don’t have an account?{" "}
            <span className="text-indigo-600 cursor-pointer">Sign up</span>
          </p>
        </div>
      </div>

      {/* Right Panel (Brand/Testimonial) */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-[#0f1260] text-white p-10 rounded-l-3xl">
        <div className="max-w-md text-center">
          <p className="text-lg italic mb-6">
            "I used Acme because I knew they could deliver what I needed... 
            someone who had a robust portfolio and someone who specialized in 
            producing massive, open online education courses."
          </p>
          <p className="font-semibold">Georgianna, PhD</p>
        </div>
      </div>
    </div>
  );
}
