import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative">
        {/* Outer Rotating Rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-40 h-40 rounded-full border-4 border-transparent border-t-purple-500 border-r-pink-500 animate-spin"></div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border-4 border-transparent border-t-blue-500 border-l-cyan-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>

        {/* Glowing Background Circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 opacity-30 blur-2xl animate-pulse"></div>
        </div>

        {/* 3D Card Container */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl transform rotate-3 shadow-2xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl backdrop-blur-sm border border-purple-500/30"></div>

          {/* PK Text with 3D Effect */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="text-6xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 animate-pulse drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" style={{
              textShadow: '0 4px 8px rgba(168,85,247,0.3), 0 8px 16px rgba(168,85,247,0.2), 0 -2px 4px rgba(59,130,246,0.3)',
              transform: 'perspective(500px) rotateX(10deg)'
            }}>
              PK
            </div>

            {/* Loading Dots */}
            <div className="flex gap-1 mt-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-1 h-1 bg-purple-500 rounded-full top-[20%] left-[10%] animate-ping" style={{ animationDuration: '2s' }}></div>
          <div className="absolute w-1 h-1 bg-pink-500 rounded-full top-[70%] right-[15%] animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}></div>
          <div className="absolute w-1 h-1 bg-blue-500 rounded-full bottom-[25%] left-[85%] animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
        </div>

        {/* Bottom Glow */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 blur-xl opacity-50 animate-pulse"></div>
      </div>
    </div>
  );
};

export default Loading;