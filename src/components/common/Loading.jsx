import React from "react";

const Loading = () => {
  return (
   <div className="flex items-center justify-center h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-100 relative overflow-hidden">
  {/* Animated Background Orbs - Theme Aware */}
  <div className="absolute inset-0 pointer-events-none">
    {/* Large Floating Orbs */}
    <div
      className="absolute top-[10%] left-[15%] w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"
      style={{ animationDuration: "4s" }}
    />
    <div
      className="absolute bottom-[15%] right-[20%] w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-pulse"
      style={{ animationDuration: "5s", animationDelay: "1s" }}
    />
    <div
      className="absolute top-[50%] right-[10%] w-56 h-56 bg-accent/15 rounded-full blur-3xl animate-pulse"
      style={{ animationDuration: "6s", animationDelay: "2s" }}
    />
    <div
      className="absolute bottom-[40%] left-[25%] w-48 h-48 bg-primary/15 rounded-full blur-2xl animate-pulse"
      style={{ animationDuration: "4.5s", animationDelay: "0.5s" }}
    />

    {/* Floating Particles */}
    <div
      className="absolute w-2 h-2 bg-primary rounded-full top-[20%] left-[10%] animate-ping"
      style={{ animationDuration: "2s" }}
    />
    <div
      className="absolute w-2 h-2 bg-secondary rounded-full top-[70%] right-[15%] animate-ping"
      style={{ animationDuration: "2.5s", animationDelay: "0.5s" }}
    />
    <div
      className="absolute w-2 h-2 bg-accent rounded-full bottom-[25%] left-[85%] animate-ping"
      style={{ animationDuration: "3s", animationDelay: "1s" }}
    />
    <div
      className="absolute w-1.5 h-1.5 bg-primary rounded-full top-[40%] right-[30%] animate-ping"
      style={{ animationDuration: "3.5s", animationDelay: "1.5s" }}
    />
    <div
      className="absolute w-1.5 h-1.5 bg-secondary rounded-full bottom-[60%] left-[40%] animate-ping"
      style={{ animationDuration: "2.8s", animationDelay: "0.8s" }}
    />
  </div>

  <div className="relative z-10">
    {/* Outer Rotating Rings - Theme Colors */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="w-40 h-40 rounded-full border-4 border-transparent border-t-primary border-r-secondary animate-spin"
        style={{ animationDuration: "2s" }}
      />
    </div>

    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="w-32 h-32 rounded-full border-4 border-transparent border-t-secondary border-l-accent animate-spin"
        style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
      />
    </div>

    {/* Multi-layer Glowing Background Circles */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="w-36 h-36 rounded-full bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 opacity-40 blur-3xl animate-pulse"
        style={{ animationDuration: "3s" }}
      />
    </div>
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 opacity-50 blur-2xl animate-pulse"
        style={{ animationDuration: "2s", animationDelay: "0.5s" }}
      />
    </div>

    {/* 3D Card Container - Same as Before */}
    <div className="relative w-32 h-32 flex items-center justify-center">
      {/* 3D Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-base-200 to-base-300 rounded-2xl transform rotate-3 shadow-2xl" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl backdrop-blur-sm border-2 border-primary/30" />

      {/* PK Text with 3D Effect */}
      <div className="relative z-10 flex flex-col items-center">
        <div
          className="text-6xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-br from-primary via-secondary to-accent animate-pulse drop-shadow-2xl"
          style={{
            textShadow:
              "0 4px 8px rgba(var(--p), 0.3), 0 8px 16px rgba(var(--p), 0.2)",
            transform: "perspective(500px) rotateX(10deg)",
          }}
        >
          PK
        </div>

        {/* Loading Dots - Theme Colors */}
        <div className="flex gap-1.5 mt-3">
          <div
            className="w-2 h-2 bg-primary rounded-full animate-bounce shadow-lg"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 bg-secondary rounded-full animate-bounce shadow-lg"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2 h-2 bg-accent rounded-full animate-bounce shadow-lg"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>

    {/* Bottom Glow - Theme Colors */}
    <div
      className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-32 h-3 bg-gradient-to-r from-primary via-secondary to-accent blur-xl opacity-60 animate-pulse"
      style={{ animationDuration: "2s" }}
    />

    {/* Corner Accent Glows */}
    <div
      className="absolute -top-8 -left-8 w-16 h-16 bg-primary/30 rounded-full blur-2xl animate-pulse"
      style={{ animationDuration: "3s", animationDelay: "0.5s" }}
    />
    <div
      className="absolute -bottom-8 -right-8 w-16 h-16 bg-secondary/30 rounded-full blur-2xl animate-pulse"
      style={{ animationDuration: "3s", animationDelay: "1s" }}
    />
  </div>

</div>
  );
};

export default Loading;