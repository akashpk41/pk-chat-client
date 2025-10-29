import { MessageSquare, Sparkles, Users, Zap, Heart } from "lucide-react";
import { Link } from "react-router";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-1 bg-base-100/50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Gradient Orbs */}
        <div
          className="absolute top-[20%] left-[10%] w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "4s" }}
        ></div>
        <div
          className="absolute bottom-[25%] right-[15%] w-48 h-48 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "5s", animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-[60%] left-[70%] w-32 h-32 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-2xl animate-pulse"
          style={{ animationDuration: "4.5s", animationDelay: "1s" }}
        ></div>

        {/* Floating Sparkles with Bounce Animation */}
        <div
          className="absolute top-[15%] right-[20%] animate-bounce opacity-50"
          style={{ animationDuration: "4s", animationDelay: "0s" }}
        >
          <Sparkles className="w-5 h-5 text-purple-500" />
        </div>
        <div
          className="absolute bottom-[30%] left-[25%] animate-bounce opacity-50"
          style={{ animationDuration: "4.5s", animationDelay: "2s" }}
        >
          <Sparkles className="w-6 h-6 text-pink-500" />
        </div>
        <div
          className="absolute top-[45%] right-[35%] animate-bounce opacity-40"
          style={{ animationDuration: "5s", animationDelay: "1s" }}
        >
          <Sparkles className="w-4 h-4 text-blue-500" />
        </div>
        <div
          className="absolute top-[35%] left-[15%] animate-bounce opacity-40"
          style={{ animationDuration: "4.2s", animationDelay: "1.5s" }}
        >
          <Zap className="w-5 h-5 text-cyan-500" />
        </div>
        <div
          className="absolute bottom-[15%] right-[25%] animate-bounce opacity-35"
          style={{ animationDuration: "4.8s", animationDelay: "2.5s" }}
        >
          <Heart className="w-4 h-4 text-pink-500" />
        </div>
      </div>

      <div className="max-w-md text-center space-y-6 relative z-10">
        {/* PK Icon with Colorful Pulsing Effects */}
        <div
          className="flex justify-center gap-4 mb-4 animate-bounce"
          style={{ animationDuration: "5s" }}
        >
          <div className="relative">
            {/* Multi-layered Pulsing Glow Rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-purple-500/30 animate-pulse blur-xl"
                style={{ animationDuration: "4s" }}
              ></div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500/40 via-cyan-500/40 to-blue-500/40 animate-pulse blur-lg"
                style={{ animationDuration: "5s", animationDelay: "1s" }}
              ></div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-500/30 via-purple-500/30 to-pink-500/30 animate-pulse blur-md"
                style={{ animationDuration: "4.5s", animationDelay: "2s" }}
              ></div>
            </div>

            {/* PK Container with Enhanced Styling */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border-2 border-purple-500/50 flex items-center justify-center shadow-2xl shadow-purple-500/30">
                {/* PK Text with Vibrant Gradient */}
                <div className="text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]">
                  PK
                </div>
              </div>
            </div>

            {/* Animated Corner Dots with Colors */}
            <div
              className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full animate-ping"
              style={{ animationDuration: "4s" }}
            ></div>
            <div
              className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full animate-ping"
              style={{ animationDuration: "5s", animationDelay: "1s" }}
            ></div>
            <div
              className="absolute -top-2 -left-2 w-3 h-3 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full animate-ping"
              style={{ animationDuration: "4.5s", animationDelay: "2s" }}
            ></div>
            <div
              className="absolute -bottom-2 -right-2 w-3 h-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full animate-ping"
              style={{ animationDuration: "4.8s", animationDelay: "1.5s" }}
            ></div>
          </div>
        </div>

        {/* Welcome Text with Floating Animation */}
        <div
          className="space-y-3 animate-bounce"
          style={{ animationDuration: "4s", animationDelay: "0.5s" }}
        >
          <h2 className="text-3xl font-bold">
            <span
              className="inline-block bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(168,85,247,0.7)]"
              style={{ WebkitTextStroke: "0.8px rgba(168,85,247,0.5)" }}
            >
              Welcome to PK Chat!
            </span>
          </h2>
        </div>

        {/* Enhanced Feature Pills with Icons */}
        <div
          className="flex flex-wrap justify-center gap-3 pt-4 animate-bounce"
          style={{ animationDuration: "4.5s", animationDelay: "1s" }}
        >
          <div className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-2 border-purple-500/60 backdrop-blur-sm flex items-center gap-2 hover:scale-110 hover:shadow-xl transition-all duration-300 shadow-lg cursor-pointer">
            <MessageSquare className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-bold text-purple-600">
              Real-time Chat
            </span>
          </div>
          <div className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/30 to-cyan-500/30 border-2 border-blue-500/60 backdrop-blur-sm flex items-center gap-2 hover:scale-110 hover:shadow-xl transition-all duration-300 shadow-lg cursor-pointer">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-bold text-blue-600">
              Premium Features
            </span>
          </div>
          <div className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/30 to-purple-500/30 border-2 border-pink-500/60 backdrop-blur-sm flex items-center gap-2 hover:scale-110 hover:shadow-xl transition-all duration-300 shadow-lg cursor-pointer">
            <Users className="w-4 h-4 text-pink-500" />
            <span className="text-sm font-bold text-pink-600">
              Connect Instantly
            </span>
          </div>
        </div>
        <div className="-pt-6">
          <div
            className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 border-2 border-purple-500/30 backdrop-blur-sm shadow-md "
            style={{ animationDuration: "4s" }}
          >
            <p className=" text-blue-600 font-medium text-center">
             ✨ Select a Conversation From The Sidebar To Start Chatting
            </p>
          </div>
        </div>

        {/* Animated Tip Box */}
        <div
          className="pt-0 "
          style={{ animationDuration: "5s", animationDelay: "2s" }}
        >
          <div className="inline-block px-1 py-3 rounded-xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 border-2 border-purple-500/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
            <p className="text-base font-semibold  ">
              <span className="text-purple-700">
                💡 Visit{" "}
                <Link
                  to="/profile"
                  className="underline font-bold hover:text-purple-900"
                >
                  Profile
                </Link>{" "}
                To Update Your Information
              </span>
            </p>
          </div>
        </div>

        {/* Status Indicator */}
        <div
          className="pt-4 mb-3 animate-pulse"
          style={{ animationDuration: "4s", animationDelay: "3s" }}
        >
          <div className="flex items-center justify-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            <span className="text-base-content/60 font-medium">
              Online & Ready
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;
