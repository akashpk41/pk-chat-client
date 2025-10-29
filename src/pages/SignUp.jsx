import { useState } from "react";
import { motion } from "framer-motion";

import { useAuthStore } from "../store/useAuthStore";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  User,
} from "lucide-react";
import { Link } from "react-router";

import AuthImagePattern from "../components/common/AuthImagePattern";
import toast from "react-hot-toast";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signUp, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim())
      return toast.error("Full Name Is Required🙂");
    if (!formData.email.trim()) return toast.error("Email Is Required😎");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid Email Format😒");
    if (!formData.password) return toast.error("Password Is Required😒");
    if (formData.password.length < 6)
      return toast.error("Password Must Be At Least 6 Characters😭");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) signUp(formData);
  };

  return (
   <div className="mt-2 grid md:grid-cols-2 ">
  {/* left side */}
  <div className="flex flex-col justify-center items-center p-6 sm:p-12">
    <div className="w-full max-w-md space-y-8">
      {/* LOGO */}
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

          <h1 className=" text-4xl md:text-5xl font-extrabold mt-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Create <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Account</span>
          </h1>
          <p className="text-base-content/70 text-lg font-medium">
            Get started with your free account
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold text-base">Full Name</span>
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none
              transition-colors group-focus-within:text-primary">
              <User className="size-5 text-base-content/50 group-focus-within:text-primary
                transition-colors duration-200" />
            </div>
            <input
              type="text"
              className="input input-bordered w-full pl-12 h-12 rounded-xl
                bg-base-200 border-2 border-base-300
                focus:border-primary focus:bg-base-100 focus:outline-none
                transition-all duration-200 text-base
                hover:border-primary/50"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
          </div>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold text-base">Email</span>
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none
              transition-colors group-focus-within:text-primary">
              <Mail className="size-5 text-base-content/50 group-focus-within:text-primary
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
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center
              transition-colors text-primary">
             <Lock className="h-5 bg-red-700 w-5 text-base-content/50 group-focus-within:text-primary transition-colors duration-200" />
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
                <EyeOff className="size-5" />
              ) : (
                <Eye className="size-5" />
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
          disabled={isSigningUp}
        >
          {isSigningUp ? (
            <>
              <Loader2 className="size-6 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              <span>Create Account</span>
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

      <div className="text-center pt-0">
        <p className="text-xl text-base-content/70">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-primary hover:text-primary/80
              transition-colors duration-200 underline  underline-offset-4"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  </div>

  {/* right side */}
  <AuthImagePattern
    title="Join our community"
    subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
  />
</div>
  );
};
export default SignUp;
