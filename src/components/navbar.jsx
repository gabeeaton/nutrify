import React, { useState } from "react";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "./index.css";

function Navbar({ user }) {
  const handleSignOut = () => {
    signOut(auth)
      .then(() => console.log("Sign Out"))
      .catch((error) => console.log(error));
  };

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 left-0 w-full z-50 bg-gradient-to-r from-cyan-500 to-blue-500 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[70px]">
          {/* Logo */}
          <Link
            to="/"
            style={{ textDecoration: "none" }}
            className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent"
          >
            <span className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
  Nutrify
</span>

          </Link>


          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6">
            {[
              { to: "/", icon: <Home />, label: "Home" },
              { to: "/food", icon: <Journal />, label: "Log Food" },
              { to: "/view", icon: <Chart />, label: "Dashboard" },
              { to: "/settings", icon: <Settings />, label: "Settings" },
            ].map(({ to, icon, label }) => (
              <Link
                key={label}
                to={to}
                className="flex items-center gap-2 text-white font-medium text-sm uppercase px-3 py-2 rounded-lg hover:bg-white/10 hover:ring-1 hover:ring-white transition-all duration-200"
              >
                {icon}
                {label}
              </Link>
            ))}
          </div>

          {/* User Auth Info */}
          <div className="hidden sm:flex items-center space-x-3">
            {user ? (
              <>
                <span className="text-white font-medium">{user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-gradient-to-r from-teal-400 to-blue-500 text-white font-semibold rounded-full shadow-md hover:scale-[1.03] hover:shadow-lg transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-gradient-to-r from-teal-400 to-blue-500 text-white font-semibold rounded-full shadow-md hover:scale-[1.03] hover:shadow-lg transition"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex flex-col justify-between w-6 h-5 focus:outline-none"
            >
              <span className={`h-[3px] w-full bg-white rounded transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-[8px]" : ""}`} />
              <span className={`h-[3px] w-full bg-white rounded transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`h-[3px] w-full bg-white rounded transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-[8px]" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gradient-to-r from-cyan-500 to-blue-500 backdrop-blur-md px-6 py-4 space-y-4 transition-all duration-300">
          {[
            { to: "/", icon: <Home />, label: "Home" },
            { to: "/food", icon: <Journal />, label: "Log Food" },
            { to: "/view", icon: <Chart />, label: "Dashboard" },
            { to: "/settings", icon: <Settings />, label: "Settings" },
          ].map(({ to, icon, label }) => (
            <Link
              key={label}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-white text-lg font-medium px-3 py-2 rounded-lg hover:bg-white/10 hover:ring-1 hover:ring-white transition"
            >
              {icon}
              {label}
            </Link>
          ))}

          {/* Auth Mobile */}
          <div className="mt-4">
            {user ? (
              <button
                onClick={() => {
                  handleSignOut();
                  setMenuOpen(false);
                }}
                className="w-full px-4 py-2 bg-white text-blue-600 font-semibold rounded-full shadow hover:bg-gray-200 transition"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="w-full block text-center px-4 py-2 bg-white text-blue-600 font-semibold rounded-full shadow hover:bg-gray-200 transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Home() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="white" className="bi bi-house" viewBox="0 0 16 16">
      <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" />
    </svg>
  )
}

function Journal() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-journal-text" viewBox="0 0 16 16">
      <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
      <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2" />
      <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z" />
    </svg>
  )
}

function Chart() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-bar-chart" viewBox="0 0 16 16">
      <path d="M4 11H2v3h2zm5-4H7v7h2zm5-5v12h-2V2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1z" />
    </svg>
  )
}

function Settings() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-gear" viewBox="0 0 16 16">
      <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0" />
      <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z" />
    </svg>
  )
}

export default Navbar;
