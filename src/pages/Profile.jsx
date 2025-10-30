import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  Camera,
  Mail,
  User,
  Shield,
  Calendar,
  CheckCircle2,
  Upload,
  MessageSquare,
  Settings,
} from "lucide-react";
import { Link } from "react-router";

const Profile = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="bg-gradient-to-br from-base-100 via-base-200 to-base-100">
      <div className="max-w-4xl mx-auto px-2 py-8">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-2 border-primary/30 shadow-lg shadow-primary/20">
              <User className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              My Profile
            </h1>
          </div>
          <p className="text-base text-base-content/70 font-medium">
            Manage your account information and settings
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Picture Card */}
          <div className="card bg-base-100 shadow-2xl border-2 border-base-300/50 hover:border-primary/30 transition-all duration-300">
            <div className="card-body p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2 text-base-content">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Camera className="w-5 h-5 text-primary" />
                  </div>
                  Profile Picture
                </h2>
                <div
                  className={`badge badge-lg gap-2 ${
                    isUpdatingProfile ? "badge-warning" : "badge-success"
                  } shadow-lg`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isUpdatingProfile
                        ? "bg-warning-content"
                        : "bg-success-content"
                    } ${isUpdatingProfile ? "animate-pulse" : "animate-ping"}`}
                  />
                  {isUpdatingProfile ? "Uploading..." : "Active"}
                </div>
              </div>

              {/* Avatar Upload Section */}
              <div className="flex flex-col sm:flex-row items-center gap-8 p-8 bg-gradient-to-br from-base-200/80 to-base-300/80 rounded-2xl border border-base-300/50">
                <div className="relative group">
                  {/* Glowing Background - Multiple Layers */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-full animate-pulse opacity-30 blur-2xl group-hover:opacity-50 transition-opacity duration-300" />
                  <div className="absolute -inset-2 bg-gradient-to-br from-primary to-secondary rounded-full opacity-20 blur-lg group-hover:opacity-30 transition-opacity duration-300" />

                  <img
                    src={selectedImg || authUser?.profilePic || "avatar3.png"}
                    alt="Profile"
                    className="relative w-40 h-40 rounded-full object-cover border-4 border-primary/50 shadow-2xl ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300"
                  />

                  {/* Camera Button */}
                  <label
                    htmlFor="avatar-upload"
                    className={`
                  absolute bottom-0 right-0
                  bg-gradient-to-br from-primary to-primary-focus
                  p-3.5 rounded-full cursor-pointer
                  transition-all duration-300 shadow-xl shadow-primary/40
                  border-4 border-base-100
                  ${
                    isUpdatingProfile
                      ? "animate-pulse pointer-events-none"
                      : "hover:scale-110 hover:shadow-2xl hover:shadow-primary/60"
                  }
                `}
                  >
                    {isUpdatingProfile ? (
                      <div className="w-6 h-6 border-2 border-primary-content border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Camera className="w-6 h-6 text-primary-content" />
                    )}
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUpdatingProfile}
                    />
                  </label>
                </div>

                <div className="flex-1 text-center sm:text-left space-y-3">
                  <h3 className="font-bold text-xl text-base-content">
                    Update Your Photo
                  </h3>
                  <p className="text-base text-base-content/70">
                    {isUpdatingProfile
                      ? "Uploading your new profile picture..."
                      : "Click the camera icon to upload a new profile picture"}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <div className="badge badge-outline badge-lg gap-2 border-2">
                      <Upload className="w-4 h-4" />
                      Max 10MB
                    </div>
                    <div className="badge badge-outline badge-lg border-2">
                      JPG, PNG, GIF
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information Card */}
          <div className="card bg-base-100 shadow-2xl border-2 border-base-300/50 hover:border-secondary/30 transition-all duration-300">
            <div className="card-body p-4">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-base-content">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <User className="w-5 h-5 text-secondary" />
                </div>
                Personal Information
              </h2>

              <div className="grid sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-base-content/70 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  <div className="px-5 py-4 bg-gradient-to-br from-base-200 to-base-300 rounded-xl border-2 border-base-300 font-semibold flex items-center gap-2 hover:border-primary/50 transition-colors">
                    {authUser?.fullName}
                    {/* Premium Verify Badge */}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="drop-shadow-lg flex-shrink-0"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="11"
                        fill="url(#verifyGradient)"
                      />
                      <path
                        d="M8 12.5l2.5 2.5L16 9"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <defs>
                        <linearGradient
                          id="verifyGradient"
                          x1="0"
                          y1="0"
                          x2="24"
                          y2="24"
                        >
                          <stop offset="0%" stopColor="#0088ff" />
                          <stop offset="100%" stopColor="#0066ff" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-base-content/70 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <div className="px-5 py-4 bg-gradient-to-br from-base-200 to-base-300 rounded-xl border-2 border-base-300 font-semibold hover:border-secondary/50 transition-colors">
                    {authUser?.email}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information Card */}
          <div className="card bg-base-100 shadow-2xl border-2 border-base-300/50 hover:border-accent/30 transition-all duration-300">
            <div className="card-body p-4">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-base-content">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                Account Information
              </h2>

              <div className="space-y-4">
                {/* Member Since */}
                <div className="flex items-center justify-between p-5 bg-gradient-to-br from-base-200 to-base-300 rounded-xl border-2 border-base-300 hover:border-primary/50 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-base-content/70">
                        Member Since
                      </p>
                      <p className="font-bold text-lg text-base-content">
                        {authUser?.createdAt?.split("T")[0]}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account Status */}
                <div className="flex items-center justify-between p-5 bg-gradient-to-br from-base-200 to-base-300 rounded-xl border-2 border-base-300 hover:border-success/50 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-success/20 to-success/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-base-content/70">
                        Account Status
                      </p>
                      <p className="font-bold text-lg text-success">Active</p>
                    </div>
                  </div>
                  <div className="badge badge-success badge-lg gap-2 shadow-lg">
                    <div className="w-2 h-2 bg-success-content rounded-full animate-pulse" />
                    Verified
                  </div>
                </div>

                {/* Account Type - Premium */}
                <div className="flex items-center justify-between p-5 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-xl border-2 border-primary/30 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/30">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-base-content/70">
                        Account Type
                      </p>
                      <p className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Premium User
                      </p>
                    </div>
                  </div>
                  <div className="badge badge-primary badge-lg shadow-lg shadow-primary/30">
                    PRO
                  </div>
                </div>
              </div>
            </div>
          </div>

        {/* Security Notice */}
<div className="alert bg-gradient-to-br from-base-100 to-base-200 border-2 border-primary/30 shadow-xl hover:shadow-2xl hover:border-primary/50 transition-all duration-300">
  <div className="p-2 rounded-lg bg-primary/10">
    <Shield className="w-6 h-6 text-primary" />
  </div>
  <div>
    <h3 className="font-bold text-lg text-base-content">Your account is secure</h3>
    <p className="text-sm text-base-content/70 font-medium">
      We use industry-standard encryption to protect your data
    </p>
  </div>
</div>

{/* Quick Links */}
<div className="grid sm:grid-cols-2 gap-4">
  <Link
    to="/"
    className="flex items-center gap-4 p-5 bg-gradient-to-br from-base-100 to-base-200 rounded-xl border-2 border-base-300 hover:border-primary/50 hover:shadow-xl transition-all duration-300 group"
  >
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
      <MessageSquare className="w-6 h-6 text-primary" />
    </div>
    <div className="flex-1">
      <h3 className="font-bold text-lg text-base-content">Go to Home</h3>
      <p className="text-sm text-base-content/60">Start chatting with friends</p>
    </div>
    <div className="text-primary group-hover:translate-x-1 transition-transform">
      →
    </div>
  </Link>

  <Link
    to="/settings"
    className="flex items-center gap-4 p-5 bg-gradient-to-br from-base-100 to-base-200 rounded-xl border-2 border-base-300 hover:border-secondary/50 hover:shadow-xl transition-all duration-300 group"
  >
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-90 transition-all duration-300 shadow-lg shadow-secondary/20">
      <Settings className="w-6 h-6 text-secondary" />
    </div>
    <div className="flex-1">
      <h3 className="font-bold text-lg text-base-content">Settings</h3>
      <p className="text-sm text-base-content/60">Customize your experience</p>
    </div>
    <div className="text-secondary group-hover:translate-x-1 transition-transform">
      →
    </div>
  </Link>
</div>


        </div>
      </div>
    </div>
  );
};

export default Profile;
