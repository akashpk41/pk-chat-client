import { Link } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";
import { LogOut, Settings, User2, UserCircle } from "lucide-react";

const Navbar = () => {
  const { logOutUser, authUser } = useAuthStore();

  return (
    <header className=" z-50 bg-base-100/95 backdrop-blur-xl border-b border-base-300 shadow-sm">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
            >
              <div className="relative size-10">
                {/* Outer Glowing Ring */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary/40 to-secondary/40 opacity-50 blur-sm group-hover:opacity-70 transition-opacity"></div>
                </div>

                {/* Rotating Glow Effect */}
                <div
                  className="absolute inset-0 flex items-center justify-center animate-spin"
                  style={{ animationDuration: "4s" }}
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/60 via-transparent to-transparent opacity-50 blur-md"></div>
                </div>

                {/* Inner Pulsing Glow */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-7 h-7 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30 opacity-40 blur-lg animate-pulse"
                    style={{ animationDuration: "2s" }}
                  ></div>
                </div>

                {/* PK Container */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-base-200 to-base-300 backdrop-blur-sm border-2 border-primary/30 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-shadow">
                    {/* PK Text */}
                    <span className="text-base font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-br from-primary via-secondary to-accent">
                      PK
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h1 className="text-xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  PK Chat
                </h1>
                <p className="text-[10px] text-base-content/60 font-medium -mt-1">
                  Stay Connected
                </p>
              </div>
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <Link
              to="/settings"
              className="btn btn-ghost btn-sm gap-2 rounded-xl hover:bg-base-200 transition-all group"
            >
              <div className="relative">
                <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-200 transition-opacity"></div>
              </div>
              <span className="hidden sm:inline font-medium">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link
                  to="/profile"
                  className="btn btn-ghost btn-sm gap-2 rounded-xl hover:bg-base-200 transition-all group"
                >
                  {authUser.profilePic ? (
                    <div className="avatar">
                      <div className="w-10 h-10 rounded-full ring-2 ring-primary/80 group-hover:ring-primary/60 transition-all">
                        <img
                          src={authUser.profilePic}
                          alt="profile"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="avatar">
                        <div className="w-10 h-10 rounded-full ring-2 ring-primary/80 group-hover:ring-primary/60 transition-all">
                          <img
                            src="/avatar3.png"
                            alt="default avatar"
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-secondary/20 rounded-full blur-md opacity-0 group-hover:opacity-200 transition-opacity"></div>
                    </div>
                  )}
                  <span className="hidden sm:inline font-medium">Profile</span>
                </Link>

                <button
                  className="btn btn-ghost btn-sm gap-2 rounded-xl hover:bg-error/10 hover:text-error transition-all group"
                  onClick={logOutUser}
                >
                  <div className="relative">
                    <LogOut className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    <div className="absolute inset-0 bg-error/20 rounded-full blur-md opacity-0 group-hover:opacity-200 transition-opacity"></div>
                  </div>
                  <span className="hidden sm:inline font-medium">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
