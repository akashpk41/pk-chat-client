import { useState } from "react";
import { motion } from "framer-motion";

import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/common/AuthImagePattern";
import { Link } from "react-router";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };
return (
  <div className="mt-2 grid md:grid-cols-2 ">
    {/* Left Side - Form */}
    <div className="flex flex-col justify-center items-center p-6 sm:p-12">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-2 group">
            <motion.div
              className="size-24 rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/10
                flex items-center justify-center group-hover:shadow-2xl group-hover:shadow-primary/30
                transition-all duration-300 relative overflow-hidden border-2 border-primary/20"
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Animated glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 rounded-2xl blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              >
                <MessageSquare className="size-16 text-primary relative z-10 drop-shadow-lg" />
              </motion.div>
            </motion.div>

            <h1 className="text-5xl font-extrabold mt-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Welcome <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Back</span>
            </h1>
            <p className="text-base-content/70 text-lg font-medium">
              Log in to continue your journey
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-base">Email</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none
                transition-colors group-focus-within:text-primary">
                <Mail className="h-5 w-5 text-base-content/50 group-focus-within:text-primary
                  transition-colors duration-200" />
              </div>
              <input
                type="email"
                className="input input-bordered w-full pl-12 h-12 rounded-xl
                  bg-base-200 border-2 border-base-300
                  focus:border-primary focus:bg-base-100 focus:outline-none
                  transition-all duration-200 text-base
                  hover:border-primary/50"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-base">Password</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none
                transition-colors group-focus-within:text-primary">
                <Lock className="h-5 w-5 text-base-content/50 group-focus-within:text-primary
                  transition-colors duration-200" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="input input-bordered w-full pl-12 pr-12 h-12 rounded-xl
                  bg-base-200 border-2 border-base-300
                  focus:border-primary focus:bg-base-100 focus:outline-none
                  transition-all duration-200 text-base
                  hover:border-primary/50"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center
                  text-base-content/50 hover:text-primary transition-colors duration-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full h-14 text-lg font-semibold rounded-xl
              shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40
              hover:scale-[1.02] active:scale-[0.98]
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <span>Log In</span>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.div>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-base text-base-content/70">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-primary hover:text-primary/80
                transition-colors duration-200 hover:underline underline-offset-4"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>

    {/* Right Side - Image/Pattern */}
    <AuthImagePattern
      title={"Welcome back!"}
      subtitle={
        "Log in to continue your conversations and catch up with your messages."
      }
    />
  </div>
);
};
export default Login;
