import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  /*
  ========================================
  Register / Login
  ========================================
  */
  const handleAuth = async (e) => {
    e.preventDefault();

    const endpoint = isLogin ? "login" : "register";

    const payload = isLogin
      ? { username, password }
      : { username, email, password };

    try {
      const response = await fetch(
        `https://vaultix-backend.onrender.com/auth/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        alert(errorText || "Authentication failed");

        setUsername("");
        setEmail("");
        setPassword("");

        return;
      }

      if (isLogin) {
        const data = await response.json();

        localStorage.setItem("token", data.token);

        alert("Login successful");

        navigate("/dashboard");
      } else {
        const text = await response.text();

        alert(text || "Registration successful. Please login.");

        setIsLogin(true);
      }

      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error);

      alert("Server error");

      setUsername("");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen text-white">
      <Navbar />

      <div className="flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-[0_0_40px_rgba(6,182,212,0.15)] p-10">

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight">
              {isLogin ? "Login to Vaultix" : "Create Your Vaultix Account"}
            </h1>

            <p className="text-gray-300 mt-3 leading-relaxed">
              Secure your files with encryption, temporal locks, and governance
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-5">

            {/* Username */}
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white placeholder-gray-400 outline-none"
              required
            />

            {/* Email (only register) */}
            {!isLogin && (
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white placeholder-gray-400 outline-none"
                required
              />
            )}

            {/* Password with ICON TOGGLE */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 pr-12 text-white placeholder-gray-400 outline-none"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-cyan-400 transition"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-cyan-500 py-4 text-lg font-semibold text-white"
            >
              {isLogin ? "Login" : "Register"}
            </button>

            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-cyan-400 hover:text-cyan-300 transition"
              >
                Forgot Password?
              </button>
            </div>

          </form>

          {/* Switch Auth */}
          <p className="mt-8 text-center text-gray-300">
            {isLogin ? "No account?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setUsername("");
                setEmail("");
                setPassword("");
              }}
              className="font-semibold text-cyan-400"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}

export default AuthPage;