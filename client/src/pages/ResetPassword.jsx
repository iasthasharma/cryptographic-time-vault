import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword: password,
        }),
      });

      const text = await res.text();
      setMessage(text);

      if (res.ok) {
        setTimeout(() => navigate("/auth"), 1500);
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
        <h1 className="text-2xl font-bold mb-6">Reset Password</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10"
            required
          />

          <button
            type="submit"
            className="w-full bg-cyan-400 text-black font-bold py-3 rounded-xl"
          >
            Reset Password
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-cyan-300">{message}</p>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;