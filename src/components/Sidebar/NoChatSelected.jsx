import { MessageSquare, Sparkles, Users, Zap, Heart } from "lucide-react";
import { Link } from "react-router";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-2 sm:p-4 bg-gradient-to-br from-base-100 via-base-200 to-base-100 relative overflow-hidden">
      {/* Animated Background Elements - Theme Aware */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Gradient Orbs */}
        <div
          className="absolute top-[20%] left-[10%] w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-[25%] right-[15%] w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "5s", animationDelay: "2s" }}
        />
        <div
          className="absolute top-[60%] left-[70%] w-28 h-28 bg-accent/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDuration: "4.5s", animationDelay: "1s" }}
        />

        {/* Floating Icons with Bounce Animation */}
        <div
          className="absolute top-[15%] right-[20%] animate-bounce opacity-40"
          style={{ animationDuration: "4s", animationDelay: "0s" }}
        >
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <div
          className="absolute bottom-[30%] left-[25%] animate-bounce opacity-40"
          style={{ animationDuration: "4.5s", animationDelay: "2s" }}
        >
          <Sparkles className="w-5 h-5 text-secondary" />
        </div>
        <div
          className="absolute top-[45%] right-[35%] animate-bounce opacity-35"
          style={{ animationDuration: "5s", animationDelay: "1s" }}
        >
          <Sparkles className="w-3 h-3 text-accent" />
        </div>
        <div
          className="absolute top-[35%] left-[15%] animate-bounce opacity-35"
          style={{ animationDuration: "4.2s", animationDelay: "1.5s" }}
        >
          <Zap className="w-4 h-4 text-primary" />
        </div>
        <div
          className="absolute bottom-[15%] right-[25%] animate-bounce opacity-30"
          style={{ animationDuration: "4.8s", animationDelay: "2.5s" }}
        >
          <Heart className="w-3 h-3 text-secondary" />
        </div>
      </div>

      <div className="max-w-md w-full text-center space-y-5 relative z-10 px-2">
        {/* PK Icon with Theme-Aware Pulsing Effects */}
        <div
          className="flex justify-center mb-4 animate-bounce"
          style={{ animationDuration: "5s" }}
        >
          <div className="relative">
            {/* Multi-layered Pulsing Glow Rings - Theme Colors */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-24 h-24 rounded-full bg-primary/20 animate-pulse blur-xl"
                style={{ animationDuration: "4s" }}
              />
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-20 h-20 rounded-full bg-secondary/20 animate-pulse blur-lg"
                style={{ animationDuration: "5s", animationDelay: "1s" }}
              />
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-16 h-16 rounded-full bg-accent/20 animate-pulse blur-md"
                style={{ animationDuration: "4.5s", animationDelay: "2s" }}
              />
            </div>

            {/* PK Container - Theme Aware */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-base-200 to-base-300 backdrop-blur-sm border-2 border-primary/50 flex items-center justify-center shadow-2xl shadow-primary/30">
                {/* PK Text with Theme Gradient */}
                <div className="text-4xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-br from-primary via-secondary to-accent">
                  PK
                </div>
              </div>
            </div>

            {/* Animated Corner Dots - Theme Colors */}
            <div
              className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-ping opacity-60"
              style={{ animationDuration: "4s" }}
            />
            <div
              className="absolute -bottom-1 -left-1 w-3 h-3 bg-secondary rounded-full animate-ping opacity-60"
              style={{ animationDuration: "5s", animationDelay: "1s" }}
            />
            <div
              className="absolute -top-1 -left-1 w-2 h-2 bg-accent rounded-full animate-ping opacity-60"
              style={{ animationDuration: "4.5s", animationDelay: "2s" }}
            />
            <div
              className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary rounded-full animate-ping opacity-60"
              style={{ animationDuration: "4.8s", animationDelay: "1.5s" }}
            />
          </div>
        </div>

        {/* Welcome Text */}
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent drop-shadow-lg">
            Welcome to PK Chat!
          </h2>
          <p className="text-sm sm:text-base text-base-content/70 font-medium">
            Connect, chat, and share moments with friends
          </p>
        </div>

        {/* Feature Pills with Theme Colors */}
        <div className="flex flex-wrap justify-center gap-2 pt-1">
          <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 border-2 border-primary/40 backdrop-blur-sm flex items-center gap-1.5 hover:scale-105 hover:shadow-lg transition-all duration-300 shadow-md hover:border-primary/60 group">
            <MessageSquare className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-primary">
              Real-time Chat
            </span>
          </div>
          <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-secondary/20 to-secondary/10 border-2 border-secondary/40 backdrop-blur-sm flex items-center gap-1.5 hover:scale-105 hover:shadow-lg transition-all duration-300 shadow-md hover:border-secondary/60 group">
            <Sparkles className="w-4 h-4 text-secondary group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-secondary">
              Premium Features
            </span>
          </div>
          <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-accent/20 to-accent/10 border-2 border-accent/40 backdrop-blur-sm flex items-center gap-1.5 hover:scale-105 hover:shadow-lg transition-all duration-300 shadow-md hover:border-accent/60 group">
            <Users className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-accent">
              Connect Instantly
            </span>
          </div>
        </div>

        {/* Main Instruction Card */}
        <div className="pt-2">
          <div className="px-4 py-3 rounded-xl bg-gradient-to-br from-base-100 to-base-200 border-2 border-primary/30 backdrop-blur-sm shadow-lg hover:shadow-xl hover:border-primary/50 transition-all duration-300">
            <p className="text-sm font-semibold text-base-content flex items-center gap-2 justify-center">
              <Sparkles className="w-4 h-4 text-primary animate-pulse flex-shrink-0" />
              <span>Select a conversation from the sidebar to start chatting</span>
            </p>
          </div>
        </div>

        {/* Profile Tip Card */}
        <div className="pt-1">
          <div className="px-4 py-3 rounded-xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-2 border-primary/30 backdrop-blur-sm shadow-lg hover:shadow-xl hover:border-primary/50 transition-all duration-300">
            <p className="text-sm font-semibold text-base-content">
              💡 Visit{" "}
              <Link
                to="/profile"
                className="text-primary underline font-bold hover:text-primary/80 transition-colors"
              >
                Profile
              </Link>{" "}
              to update your information
            </p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="-mt-2">
          <div className="flex items-center justify-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping opacity-75" />
              <div className="relative w-2.5 h-2.5 bg-success rounded-full shadow-lg" />
            </div>
            <span className="text-xs  text-base-content/70 font-semibold">
              Online & Ready to Chat
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;