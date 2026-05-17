import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const text = await res.text();
      setMessage(text);
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
        <h1 className="text-2xl font-bold mb-6">Forgot Password</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10"
            required
          />

          <button
            type="submit"
            className="w-full bg-cyan-400 text-black font-bold py-3 rounded-xl"
          >
            Send Reset Link
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-cyan-300">{message}</p>
        )}

        <button
          onClick={() => navigate("/auth")}
          className="mt-4 text-sm text-gray-400 underline"
        >
          Back to login
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;