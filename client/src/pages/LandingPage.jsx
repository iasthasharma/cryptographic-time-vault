import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import GrainBackground from "../components/GrainBackground";

function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* Animated Background */}
      <GrainBackground />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <div className="max-w-7xl mx-auto px-8 pt-10 pb-16 flex flex-col lg:flex-row items-center justify-between gap-16 min-h-[85vh]">
          {/* Left Content */}
          <div className="max-w-3xl">
            <p className="uppercase tracking-[0.3em] text-cyan-400 font-semibold mb-4">
              Secure Temporal File Governance
            </p>

            <h1 className="text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
              Protect Files With
              <span className="block text-cyan-400">
                Encryption + Time Locks
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              ChronoLock X is a next-generation cryptographic vault platform
              that encrypts sensitive files, enforces time-based access control,
              and maintains audit-grade security logs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/auth"
                className="bg-cyan-500/80 hover:bg-cyan-400 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-[0_0_30px_rgba(6,182,212,0.35)] hover:scale-105 transition-all duration-300 text-center"
              >
                Launch Vault
              </Link>

              <Link
                to="/auth"
                className="bg-white/10 backdrop-blur-2xl border border-cyan-400/20 hover:border-cyan-400/50 hover:bg-white/20 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 text-center"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Right Visual */}
          <div className="w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-2xl border border-cyan-400/20 rounded-3xl shadow-[0_0_40px_rgba(6,182,212,0.15)] p-10 hover:-translate-y-1 hover:border-cyan-400/40 transition-all duration-300">
              <h2 className="text-3xl font-bold mb-6 text-cyan-300">
                Security Features
              </h2>

              <ul className="space-y-5 text-gray-200 text-lg">
                <li className="flex items-center gap-3">
                  🔐 <span>AES File Encryption</span>
                </li>

                <li className="flex items-center gap-3">
                  ⏳ <span>Time-Locked Decryption</span>
                </li>

                <li className="flex items-center gap-3">
                  🛡️ <span>JWT Authentication</span>
                </li>

                <li className="flex items-center gap-3">
                  📜 <span>Security Audit Logs</span>
                </li>

                <li className="flex items-center gap-3">
                  👤 <span>User Vault Isolation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;