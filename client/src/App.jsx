import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogsPage from "./pages/LogsPage";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Grainient from "./components/Grainient";

function App() {
  return (
    <Router>
      <div className="relative min-h-screen overflow-hidden text-white">

        {/* Animated Background */}
        <div className="fixed inset-0 z-0">
          <Grainient />
        </div>

        {/* Dark Overlay */}
        <div className="fixed inset-0 bg-black/40 z-0" />

        {/* Main App */}
        <div className="relative z-10">
          <Routes>

            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Authentication */}
            <Route path="/auth" element={<AuthPage />} />

            {/* Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Logs */}
            <Route path="/logs" element={<LogsPage />} />

            {/* Admin Panel */}
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password/:token" element={<ResetPassword />} />

          </Routes>
        </div>

      </div>
    </Router>
  );
}

export default App;