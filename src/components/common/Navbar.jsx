import { Link } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
// import logo from '../../assets/pk_chat_logo.png'

const Navbar = () => {
  const { logOutUser, authUser } = useAuthStore();

  return (
    <header className="  z-50 bg-base-100/80 backdrop-blur-lg border-b border-base-300">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 transition-all">
              <div className="relative size-9">
                {/* Outer Glowing Ring */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-40 blur-sm animate-pulse"></div>
                </div>

                {/* Rotating Glow Effect */}
                <div
                  className="absolute inset-0 flex items-center justify-center animate-spin"
                  style={{ animationDuration: "3s" }}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 via-transparent to-transparent opacity-60 blur-md"></div>
                </div>

                {/* Inner Pulsing Glow */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 opacity-30 blur-lg animate-pulse"
                    style={{ animationDuration: "2s" }}
                  ></div>
                </div>

                {/* PK Container */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-purple-500/40 flex items-center justify-center shadow-lg shadow-purple-500/20">
                    {/* PK Text */}
                    <span className="text-sm font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 animate-pulse">
                      PK
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-lg font-bold">PK Chat</h1>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/settings"
              className={`
              btn btn-sm gap-2 transition-colors

              `}
            >
              <Settings className="w-6 h-6" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to="/profile" className={`btn btn-sm gap-2`}>
                  <User className="size-6" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={logOutUser}>
                  <LogOut className="size-6" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
            {/* <Link
              to="/settings"
              className={`
              btn btn-sm gap-2 transition-colors

              `}
            >
              <Settings className="w-6 h-6" />
              <span className="hidden sm:inline">Settings</span>
            </Link> */}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
