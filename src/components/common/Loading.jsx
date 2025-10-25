import { Loader, Loader2 } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <motion.div
        className="relative flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
      >
        {/* Outer Gradient Ring */}
        <div className="absolute w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 animate-spin-slow blur-[2px]"></div>

        {/* Lucide Loader Icon */}
        <Loader2
          size={24}
          className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 animate-pulse"
        />
      </motion.div>
    </div>
  );
};

export default Loading;
