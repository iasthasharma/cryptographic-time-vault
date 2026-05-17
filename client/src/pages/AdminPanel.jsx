import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GrainBackground from "../components/GrainBackground";

function AdminPanel() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const [systemStatus, setSystemStatus] =
        useState("SECURE");

    const [activeUsers] = useState(18);

    const [vaultHealth] = useState(98);

    const [alerts] = useState([
        {
            level: "LOW",
            message:
                "Minor suspicious login pattern detected.",
        },
        {
            level: "MEDIUM",
            message:
                "High vault activity observed.",
        },
    ]);

    useEffect(() => {
        if (!token) {
            navigate("/auth");
        }
    }, []);

    return (
        <div className="relative min-h-screen overflow-hidden text-white">
            {/* Background */}
            <div className="fixed inset-0 -z-10">
                <GrainBackground />
            </div>

            <div className="relative z-10 p-8">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <p className="uppercase tracking-[0.3em] text-cyan-300 text-sm mb-3">
                                Global Monitoring Console
                            </p>

                            <h1 className="text-6xl font-black">
                                Admin Control Center
                            </h1>

                            <p className="text-gray-300 mt-3 text-lg">
                                Real-time vault intelligence
                                and governance
                            </p>
                        </div>

                        <button
                            onClick={() =>
                                navigate("/dashboard")
                            }
                            className="bg-cyan-400 text-black px-6 py-3 rounded-2xl font-bold"
                        >
                            Dashboard
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

                        <div className="bg-white/10 border border-white/10 backdrop-blur-2xl rounded-3xl p-8">
                            <p className="text-gray-300 mb-2">
                                System Status
                            </p>

                            <h2 className="text-5xl font-black text-green-300">
                                {systemStatus}
                            </h2>
                        </div>

                        <div className="bg-white/10 border border-white/10 backdrop-blur-2xl rounded-3xl p-8">
                            <p className="text-gray-300 mb-2">
                                Active Users
                            </p>

                            <h2 className="text-5xl font-black text-cyan-300">
                                {activeUsers}
                            </h2>
                        </div>

                        <div className="bg-white/10 border border-white/10 backdrop-blur-2xl rounded-3xl p-8">
                            <p className="text-gray-300 mb-2">
                                Vault Integrity
                            </p>

                            <h2 className="text-5xl font-black text-yellow-300">
                                {vaultHealth}%
                            </h2>
                        </div>
                    </div>

                    {/* Threat Feed */}
                    <div className="bg-white/10 border border-white/10 backdrop-blur-2xl rounded-3xl p-8 mb-10">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <p className="uppercase tracking-[0.3em] text-red-300 text-sm mb-2">
                                    AI Threat Intelligence
                                </p>

                                <h2 className="text-3xl font-black">
                                    Live Threat Feed
                                </h2>
                            </div>

                            <div className="bg-red-500/20 border border-red-400/20 px-5 py-2 rounded-2xl text-red-300">
                                LIVE
                            </div>
                        </div>

                        <div className="space-y-4">
                            {alerts.map((alert, index) => (
                                <div
                                    key={index}
                                    className="bg-black/20 border border-white/10 rounded-2xl p-5"
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-2xl font-bold">
                                                Threat Alert
                                            </h3>

                                            <p className="text-gray-300 mt-2">
                                                {alert.message}
                                            </p>
                                        </div>

                                        <span
                                            className={`px-4 py-2 rounded-xl font-bold ${alert.level === "LOW"
                                                    ? "bg-yellow-500/20 text-yellow-300"
                                                    : "bg-orange-500/20 text-orange-300"
                                                }`}
                                        >
                                            {alert.level}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Monitoring Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        <div className="bg-white/10 border border-white/10 backdrop-blur-2xl rounded-3xl p-8">
                            <h2 className="text-3xl font-bold mb-6">
                                Global Vault Network
                            </h2>

                            <div className="space-y-4">
                                <div className="bg-black/20 rounded-2xl p-5 border border-white/10">
                                    North America Node — Stable
                                </div>

                                <div className="bg-black/20 rounded-2xl p-5 border border-white/10">
                                    Europe Node — Stable
                                </div>

                                <div className="bg-black/20 rounded-2xl p-5 border border-white/10">
                                    Asia Node — Monitoring
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 border border-white/10 backdrop-blur-2xl rounded-3xl p-8">
                            <h2 className="text-3xl font-bold mb-6">
                                AI Security Insights
                            </h2>

                            <div className="space-y-4">
                                <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-2xl p-5">
                                    Behavioral analysis engine
                                    operational
                                </div>

                                <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-2xl p-5">
                                    Temporal lock validation
                                    active
                                </div>

                                <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-2xl p-5">
                                    Encryption integrity verified
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center text-gray-400 mt-12">
                        © 2026 Vaultix—
                        Administrative Intelligence Console
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPanel;