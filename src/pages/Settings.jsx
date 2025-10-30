import { useState } from "react";
import {
  Send,
  Palette,
  Eye,
  Check,
  UserPlus,
  LogIn,
  UserCircle,
  Home,
  Sparkles,
} from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { THEMES } from "../themes";
import DeveloperProfile from "../components/DeveloperProfile";
import { Link } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  {
    id: 2,
    content: "I'm doing great! Just working on some new features.",
    isSent: true,
  },
];

const Settings = () => {
  const { theme, setTheme } = useThemeStore();
  const [hoveredTheme, setHoveredTheme] = useState(null);
  const { authUser } = useAuthStore();
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
      <div className="container mx-auto px-1 pt-2 pb-12 max-w-6xl">
     {/* Header Section */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-2 border-primary/30 shadow-lg shadow-primary/20">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Settings
            </h1>
          </div>
          <p className="text-base text-base-content/70 font-medium">
            Customize your experience and manage preferences
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Theme Selection Panel */}
          <div className="md:col-span-2 space-y-4">
            <div className="card bg-base-100 shadow-xl border border-primary">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <Palette className="w-5 h-5" />
                      Theme Selection
                    </h2>
                    <p className="text-sm text-base-content/60 mt-1">
                      Choose your preferred color theme
                    </p>
                  </div>
                  <div className="badge badge-primary badge-lg">
                    {THEMES.length} themes
                  </div>
                </div>

                {/* Theme Grid */}
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {THEMES.map((t) => (
                    <button
                      key={t}
                      className={`
                        group cursor-pointer relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200
                        ${
                          theme === t
                            ? "bg-primary/10 ring-2 ring-primary shadow-lg scale-105"
                            : "bg-base-200 hover:bg-base-300 hover:scale-105"
                        }
                      `}
                      onClick={() => setTheme(t)}
                      onMouseEnter={() => setHoveredTheme(t)}
                      onMouseLeave={() => setHoveredTheme(null)}
                    >
                      {/* Color Preview */}
                      <div
                        className="relative h-12 w-full rounded-lg overflow-hidden shadow-md"
                        data-theme={t}
                      >
                        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0.5 p-0.5">
                          <div className="rounded bg-primary"></div>
                          <div className="rounded bg-secondary"></div>
                          <div className="rounded bg-accent"></div>
                          <div className="rounded bg-neutral"></div>
                        </div>

                        {/* Selected Check */}
                        {theme === t && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-4 h-4 text-primary-content" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Theme Name */}
                      <span
                        className={`
                        text-xs font-medium truncate w-full text-center transition-colors
                        ${theme === t ? "text-primary" : "text-base-content"}
                      `}
                      >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </span>

                      {/* Hover Tooltip */}
                      {hoveredTheme === t && theme !== t && (
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-base-content text-base-100 text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                          Click to apply
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="md:col-span-1">
            <div className="card bg-base-100 shadow-xl border border-base-300 sticky top-24">
              <div className="card-body p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-sm ">Live Preview</h3>
                </div>

                {/* Mock Chat UI */}
                <div className="bg-base-200 rounded-xl overflow-hidden shadow-inner">
                  {/* Chat Header */}
                  <div className="px-3 py-2.5 bg-base-100 border-b border-base-300">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-content font-bold text-sm">
                        PK
                      </div>
                      <div>
                        <h4 className="font-medium text-lg">Akash PK</h4>
                        <p className="text-[13px] text-base-content/60">
                          Online
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="p-3 mb-4 space-y-2 h-40 overflow-y-auto bg-base-100">
                    {PREVIEW_MESSAGES.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.isSent ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`
                            max-w-[85%] rounded-lg p-2 shadow-sm text-md
                            ${
                              message.isSent
                                ? "bg-primary text-primary-content"
                                : "bg-base-200"
                            }
                          `}
                        >
                          <p>{message.content}</p>
                          <p
                            className={`
                              text-[12px] mt-1
                              ${
                                message.isSent
                                  ? "text-primary-content/70"
                                  : "text-base-content/60"
                              }
                            `}
                          >
                            12:00 PM
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div className="p-2  border-t border-base-300 bg-base-100">
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        className="input input-bordered input-sm flex-1 text-sm"
                        placeholder="Type a message..."
                        value="This is a preview"
                        readOnly
                      />
                      <button className="btn cursor-pointer btn-primary btn-sm min-h-0 h-8 w-8 p-0">
                        <Send size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Current Theme Info */}
                <div className="mt-3 p-2 bg-primary/10 rounded-lg">
                  <p className="text-base text-center">
                    <span className="font-semibold text-primary">
                      Current:{" "}
                    </span>
                    <span className="capitalize">{theme}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Developer Profile - Full Width Below Preview */}
        <div className="mt-6">
          <DeveloperProfile />
        </div>

        <div className="mt-8">
          {authUser ? (
            // Logged In User - Show Home & Profile
            <div className="grid sm:grid-cols-2 gap-4">
              <Link
                to="/"
                className="flex items-center gap-4 p-5 bg-gradient-to-br from-base-100 to-base-200 rounded-xl border-2 border-base-300 hover:border-primary/50 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                  <Home className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-base-content">
                    Go to Home
                  </h3>
                  <p className="text-sm text-base-content/60">
                    Start chatting with friends
                  </p>
                </div>
                <div className="text-primary group-hover:translate-x-1 transition-transform">
                  →
                </div>
              </Link>

              <Link
                to="/profile"
                className="flex items-center gap-4 p-5 bg-gradient-to-br from-base-100 to-base-200 rounded-xl border-2 border-base-300 hover:border-secondary/50 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-secondary/20">
                  <UserCircle className="w-6 h-6 text-secondary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-base-content">
                    My Profile
                  </h3>
                  <p className="text-sm text-base-content/60">
                    View and edit your profile
                  </p>
                </div>
                <div className="text-secondary group-hover:translate-x-1 transition-transform">
                  →
                </div>
              </Link>
            </div>
          ) : (
            // Not Logged In - Show Login & Sign Up
            <div className="grid sm:grid-cols-2 gap-4">
              <Link
                to="/login"
                className="flex items-center gap-4 p-5 bg-gradient-to-br from-base-100 to-base-200 rounded-xl border-2 border-base-300 hover:border-primary/50 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                  <LogIn className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-base-content">
                    Log In
                  </h3>
                  <p className="text-sm text-base-content/60">
                    Access your account
                  </p>
                </div>
                <div className="text-primary group-hover:translate-x-1 transition-transform">
                  →
                </div>
              </Link>

              <Link
                to="/signup"
                className="flex items-center gap-4 p-5 bg-gradient-to-br from-base-100 to-base-200 rounded-xl border-2 border-base-300 hover:border-secondary/50 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-secondary/20">
                  <UserPlus className="w-6 h-6 text-secondary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-base-content">
                    Create Account
                  </h3>
                  <p className="text-sm text-base-content/60">
                    Join our community
                  </p>
                </div>
                <div className="text-secondary group-hover:translate-x-1 transition-transform">
                  →
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
