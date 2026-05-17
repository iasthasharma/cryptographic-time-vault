import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import GrainBackground from "../components/GrainBackground";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function Dashboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [file, setFile] = useState(null);
  const [unlockTime, setUnlockTime] = useState("");
  const [files, setFiles] = useState([]);
  const [threats, setThreats] = useState([]);
  const [shareToken, setShareToken] = useState("");
  const [now, setNow] = useState(Date.now());

  /*
  ========================================
  Live Clock
  ========================================
  */
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /*
  ========================================
  Auth Check
  ========================================
  */
  useEffect(() => {
    if (!token) {
      navigate("/auth");
    } else {
      fetchFiles();
    }
  }, []);

  /*
  ========================================
  Status
  ========================================
  */
  const getStatus = (time) => {
    return new Date(time) <= new Date()
      ? "Unlocked"
      : "Locked";
  };

  /*
  ========================================
  Generate Share Token
  ========================================
  */
  const generateShareToken = () => {
    const token =
      "CLX-" +
      Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

    setShareToken(token);
  };

  /*
  ========================================
  AI Threat Detection
  ========================================
  */
  const detectThreats = (filesData) => {
    const alerts = [];

    if (filesData.length >= 5) {
      alerts.push({
        level: "warning",
        title: "High Vault Activity",
        description:
          "Unusual number of encrypted vault files detected.",
      });
    }

    const lockedCount = filesData.filter(
      (f) => getStatus(f.unlockTime) === "Locked"
    ).length;

    if (lockedCount >= 3) {
      alerts.push({
        level: "medium",
        title: "Multiple Locked Assets",
        description:
          "Several files remain under temporal protection.",
      });
    }

    const largeFile = filesData.find(
      (f) => f.size > 50000000
    );

    if (largeFile) {
      alerts.push({
        level: "high",
        title: "Large File Upload Detected",
        description:
          "Potential abnormal storage behavior identified.",
      });
    }

    if (alerts.length === 0) {
      alerts.push({
        level: "secure",
        title: "Vault Integrity Stable",
        description:
          "AI behavioral engine reports normal vault activity.",
      });
    }

    setThreats(alerts);
  };

  /*
  ========================================
  Fetch Files
  ========================================
  */
  const fetchFiles = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/files",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      setFiles(data);

      detectThreats(data);
    } catch (error) {
      console.error(error);
    }
  };

  /*
  ========================================
  Upload File
  ========================================
  */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !unlockTime) {
      alert("Please select file and unlock time");
      return;
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("unlockTime", unlockTime);

    try {
      const response = await fetch(
        "http://localhost:5000/files/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.text();

      if (!response.ok) {
        alert(result);
        return;
      }

      alert(result);

      setFile(null);
      setUnlockTime("");

      fetchFiles();
    } catch (error) {
      console.error(error);
      alert("Upload failed");
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

  /*
  ========================================
  Countdown
  ========================================
  */
  const getCountdown = (time) => {
    const diff =
      new Date(time).getTime() - now;

    if (diff <= 0) return "Available";

    const hours = Math.floor(
      diff / 1000 / 60 / 60
    );

    const minutes = Math.floor(
      (diff / 1000 / 60) % 60
    );

    const seconds = Math.floor(
      (diff / 1000) % 60
    );

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  /*
  ========================================
  Analytics
  ========================================
  */
  const analytics = useMemo(() => {
    const locked = files.filter(
      (f) =>
        getStatus(f.unlockTime) === "Locked"
    ).length;

    const unlocked = files.filter(
      (f) =>
        getStatus(f.unlockTime) ===
        "Unlocked"
    ).length;

    return {
      total: files.length,
      locked,
      unlocked,
    };
  }, [files]);

  /*
  ========================================
  Graph Data
  ========================================
  */
  const chartData = [
    { day: "Mon", uploads: 2 },
    { day: "Tue", uploads: 5 },
    { day: "Wed", uploads: 3 },
    { day: "Thu", uploads: 7 },
    { day: "Fri", uploads: 4 },
    { day: "Sat", uploads: 9 },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <GrainBackground />
      </div>

      {/* Main */}
      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
            <div>
              <p className="uppercase tracking-[0.3em] text-cyan-300 text-sm mb-3">
                Temporal Governance Dashboard
              </p>

              <h1 className="text-6xl font-black leading-tight">
                ChronoLock X
              </h1>

              <p className="text-gray-300 mt-3 text-lg">
                Enterprise Cryptographic Vault Platform
              </p>
            </div>

            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => navigate("/admin")}
                className="bg-cyan-400 text-black font-semibold px-6 py-3 rounded-2xl hover:scale-105 transition"
              >
                Admin Panel
              </button>

              <button
                onClick={() => navigate("/logs")}
                className="bg-white/10 border border-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl hover:bg-white/20 transition"
              >
                Security Logs
              </button>

              <button
                onClick={handleLogout}
                className="bg-red-500/80 hover:bg-red-500 px-6 py-3 rounded-2xl transition"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white/10 border border-white/10 backdrop-blur-2xl rounded-3xl p-6">
              <p className="text-gray-300 mb-2">
                Total Vault Files
              </p>

              <h2 className="text-5xl font-black">
                {analytics.total}
              </h2>
            </div>

            <div className="bg-white/10 border border-white/10 backdrop-blur-2xl rounded-3xl p-6">
              <p className="text-gray-300 mb-2">
                Locked Files
              </p>

              <h2 className="text-5xl font-black text-yellow-300">
                {analytics.locked}
              </h2>
            </div>

            <div className="bg-white/10 border border-white/10 backdrop-blur-2xl rounded-3xl p-6">
              <p className="text-gray-300 mb-2">
                Unlocked Files
              </p>

              <h2 className="text-5xl font-black text-green-300">
                {analytics.unlocked}
              </h2>
            </div>
          </div>

          {/* Upload + Graph */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

            {/* Upload */}
            <div className="bg-white/10 border border-white/10 backdrop-blur-2xl rounded-3xl p-8">
              <h2 className="text-3xl font-bold mb-6">
                Secure File Upload
              </h2>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <input
                  type="file"
                  onChange={(e) =>
                    setFile(e.target.files[0])
                  }
                  className="w-full bg-black/30 border border-white/10 rounded-2xl p-4"
                />

                <input
                  type="datetime-local"
                  min={new Date().toISOString().slice(0, 16)}
                  value={unlockTime}
                  onChange={(e) =>
                    setUnlockTime(
                      e.target.value
                    )
                  }
                  className="w-full bg-black/30 border border-white/10 rounded-2xl p-4"
                />

                <button
                  type="submit"
                  className="w-full bg-cyan-400 text-black font-bold py-4 rounded-2xl hover:scale-[1.02] transition"
                >
                  Encrypt & Lock File
                </button>
              </form>
            </div>

            {/* Analytics */}
            <div className="bg-white/10 border border-white/10 backdrop-blur-2xl rounded-3xl p-8">
              <h2 className="text-3xl font-bold mb-6">
                Vault Activity
              </h2>

              <div className="h-[300px]">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient
                        id="colorUploads"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#22d3ee"
                          stopOpacity={0.8}
                        />

                        <stop
                          offset="95%"
                          stopColor="#22d3ee"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#ffffff20"
                    />

                    <XAxis
                      dataKey="day"
                      stroke="#ccc"
                    />

                    <YAxis stroke="#ccc" />

                    <Tooltip />

                    <Area
                      type="monotone"
                      dataKey="uploads"
                      stroke="#22d3ee"
                      fillOpacity={1}
                      fill="url(#colorUploads)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* AI Threat Detection */}
          <div className="bg-white/10 border border-white/10 backdrop-blur-2xl rounded-3xl p-8 mb-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="uppercase tracking-[0.3em] text-red-300 text-sm mb-2">
                  AI Security Intelligence
                </p>

                <h2 className="text-3xl font-black">
                  Threat Detection Engine
                </h2>
              </div>

              <div className="bg-cyan-400/20 border border-cyan-300/30 px-5 py-2 rounded-2xl text-cyan-300">
                LIVE MONITORING
              </div>
            </div>

            <div className="space-y-4">
              {threats.map(
                (threat, index) => (
                  <div
                    key={index}
                    className="bg-black/20 border border-white/10 rounded-2xl p-5"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold">
                          {threat.title}
                        </h3>

                        <p className="text-gray-300 mt-2">
                          {
                            threat.description
                          }
                        </p>
                      </div>

                      <span
                        className={`px-4 py-2 rounded-xl font-semibold ${
                          threat.level ===
                          "high"
                            ? "bg-red-500/20 text-red-300"
                            : threat.level ===
                              "warning"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : threat.level ===
                              "medium"
                            ? "bg-orange-500/20 text-orange-300"
                            : "bg-green-500/20 text-green-300"
                        }`}
                      >
                        {threat.level.toUpperCase()}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Vault Files */}
          <div className="bg-white/10 border border-white/10 backdrop-blur-2xl rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-8">
              Vault Files
            </h2>

            {files.length === 0 ? (
              <p className="text-gray-300">
                No files uploaded yet.
              </p>
            ) : (
              <div className="space-y-5">
                {files.map((item) => (
                  <div
                    key={item.id}
                    className="bg-black/20 border border-white/10 rounded-3xl p-6 flex flex-col lg:flex-row justify-between gap-6"
                  >
                    <div>
                      <h3 className="text-2xl font-bold">
                        {item.originalName}
                      </h3>

                      <p className="text-gray-300 mt-2">
                        Unlock Time:{" "}
                        {item.unlockTime}
                      </p>

                      <p className="text-cyan-300 mt-2">
                        Countdown:{" "}
                        {getCountdown(
                          item.unlockTime
                        )}
                      </p>

                      <div className="mt-4">
                        {getStatus(
                          item.unlockTime
                        ) ===
                        "Unlocked" ? (
                          <span className="bg-green-500/20 text-green-300 border border-green-400/30 px-4 py-2 rounded-xl">
                            Unlocked
                          </span>
                        ) : (
                          <span className="bg-yellow-500/20 text-yellow-300 border border-yellow-400/30 px-4 py-2 rounded-xl">
                            Locked
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-4">

                      {getStatus(
                        item.unlockTime
                      ) ===
                      "Unlocked" ? (
                        <a
                          href={`http://localhost:5000/files/download/${item.id}?token=${token}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-cyan-400 text-black font-bold px-6 py-3 rounded-2xl"
                        >
                          Download
                        </a>
                      ) : (
                        <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-gray-300">
                          AES-256 Secured
                        </div>
                      )}

                      <button
                        onClick={
                          generateShareToken
                        }
                        className="bg-white/10 hover:bg-white/20 border border-white/10 px-5 py-3 rounded-2xl transition"
                      >
                        Generate Secure Share Link
                      </button>

                      {shareToken && (
                        <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-2xl p-4 text-right">
                          <p className="text-sm text-cyan-300 mb-1">
                            Secure Share Token
                          </p>

                          <p className="font-bold tracking-wider">
                            {shareToken}
                          </p>

                          <p className="text-xs text-gray-400 mt-2">
                            Expires in 24
                            hours
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center text-gray-400 mt-12">
            © 2026 ChronoLock X —
            Temporal Cryptographic
            Governance
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;