import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
   <div className="w-full flex flex-1 flex-col items-center justify-center p-0 bg-base-100/50">
  <div className="max-w-md text-center space-y-6">
    {/* PK Icon with Rotating Circles */}
    <div className="flex justify-center gap-4 mb-4">
      <div className="relative">
        {/* Outer Rotating Ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border-4 border-transparent border-t-purple-500 border-r-pink-500 animate-spin"></div>
        </div>

        {/* Inner Rotating Ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-20 h-20 rounded-full border-4 border-transparent border-t-blue-500 border-l-cyan-500 animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
          ></div>
        </div>

        {/* Glowing Background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 opacity-20 blur-xl"></div>
        </div>

        {/* PK Container */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-purple-500/30 flex items-center justify-center shadow-lg">
            {/* PK Text */}
            <div className="text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400">
              PK
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Welcome Text */}
    <h2 className="text-2xl font-bold">Welcome to PK Chat!</h2>
    <p className="text-base-content/60">
      Select a conversation from the sidebar to start chatting
    </p>
  </div>
</div>
  );
};

export default NoChatSelected;
