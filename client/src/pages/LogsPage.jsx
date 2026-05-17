import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GrainBackground from "../components/GrainBackground";

function LogsPage() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [logs, setLogs] = useState([]);

  /*
  ========================================
  Auth Check + Fetch Logs
  ========================================
  */
  useEffect(() => {
    if (!token) {
      navigate("/auth");
    } else {
      fetchLogs();
    }
  }, []);

  /*
  ========================================
  Fetch Logs
  ========================================
  */
  const fetchLogs = async () => {
    try {
      const response = await fetch("http://localhost:5000/logs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch logs");
      }

      const data = await response.json();

      setLogs(data);
    } catch (error) {
      console.error(error);
    }
  };

  /*
  ========================================
  Logout
  ========================================
  */
  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/auth");
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* Animated Background */}
      <GrainBackground />

      {/* Main Content */}
      <div className="relative z-10 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div>
              <h1 className="text-5xl font-extrabold tracking-tight text-cyan-300">
                Security Audit Logs
              </h1>

              <p className="text-gray-300 mt-2 text-lg">
                Monitor all vault activity and access history
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-white/10 backdrop-blur-xl border border-cyan-400/20 hover:border-cyan-400/50 hover:bg-white/20 text-white px-5 py-3 rounded-2xl shadow-lg transition-all duration-300"
              >
                Dashboard
              </button>

              <button
                onClick={handleLogout}
                className="bg-red-500/80 hover:bg-red-500 text-white px-5 py-3 rounded-2xl shadow-lg transition-all duration-300"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Logs Card */}
          <div className="bg-white/10 backdrop-blur-2xl border border-cyan-400/20 shadow-[0_0_40px_rgba(6,182,212,0.15)] rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-cyan-300">
              Activity Timeline
            </h2>

            {logs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-2xl font-semibold text-gray-200">
                  No security logs yet
                </p>

                <p className="text-gray-400 mt-2">
                  User activity and vault events will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="border border-cyan-400/10 bg-white/5 backdrop-blur-xl rounded-2xl p-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 hover:border-cyan-400/30 transition-all duration-300"
                  >
                    <div>
                      <p className="font-bold text-xl text-white">
                        {log.action}
                      </p>

                      <p className="text-gray-300 mt-1">
                        File: {log.fileName || "N/A"}
                      </p>

                      <p className="text-gray-400 mt-1">
                        Time:{" "}
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>

                    <span className="bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 px-5 py-3 rounded-2xl shadow-lg">
                      Secure Log
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-12 text-gray-400 text-sm">
            © 2026 ChronoLock X — Secure Temporal Vault Governance System
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogsPage;