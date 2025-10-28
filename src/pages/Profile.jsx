import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Shield, Calendar, CheckCircle2, Upload } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 pt-20">
      <div className="max-w-3xl mx-auto p-4 py-8">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">My Profile</h1>
          </div>
          <p className="text-sm text-base-content/60">
            Manage your account information and settings
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Picture Card */}
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Profile Picture
                </h2>
                <div className="badge badge-primary">
                  {isUpdatingProfile ? "Uploading..." : "Active"}
                </div>
              </div>

              {/* Avatar Upload Section */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-gradient-to-br from-base-200 to-base-300 rounded-xl">
                <div className="relative group">
                  {/* Glowing Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full animate-pulse opacity-20 blur-md" />

                  <img
                    src={selectedImg || authUser?.profilePic || "/avatar.png"}
                    alt="Profile"
                    className="relative size-32 rounded-full object-cover border-4 border-primary shadow-xl"
                  />

                  {/* Camera Button */}
                  <label
                    htmlFor="avatar-upload"
                    className={`
                      absolute bottom-0 right-0
                      bg-primary hover:bg-primary-focus
                      p-3 rounded-full cursor-pointer
                      transition-all duration-200 shadow-lg
                      border-4 border-base-100
                      ${isUpdatingProfile ? "animate-pulse pointer-events-none" : "hover:scale-110"}
                    `}
                  >
                    {isUpdatingProfile ? (
                      <div className="w-5 h-5 border-2 border-primary-content border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Camera className="w-5 h-5 text-primary-content" />
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

                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-semibold text-lg mb-2">Update Your Photo</h3>
                  <p className="text-sm text-base-content/60 mb-3">
                    {isUpdatingProfile
                      ? "Uploading your new profile picture..."
                      : "Click the camera icon to upload a new profile picture"}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <div className="badge badge-outline gap-1">
                      <Upload className="w-3 h-3" />
                      Max 10MB
                    </div>
                    <div className="badge badge-outline">JPG, PNG, GIF</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information Card */}
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                <User className="w-5 h-5" />
                Personal Information
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-base-content/70 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  <div className="px-4 py-3 bg-base-200 rounded-lg border border-base-300 font-medium">
                    {authUser?.fullName}
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-base-content/70 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <div className="px-4 py-3 bg-base-200 rounded-lg border border-base-300 font-medium">
                    {authUser?.email}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information Card */}
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5" />
                Account Information
              </h2>

              <div className="space-y-3">
                {/* Member Since */}
                <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-base-content/70">Member Since</p>
                      <p className="font-semibold">{authUser?.createdAt?.split("T")[0]}</p>
                    </div>
                  </div>
                </div>

                {/* Account Status */}
                <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-base-content/70">Account Status</p>
                      <p className="font-semibold text-success">Active</p>
                    </div>
                  </div>
                  <div className="badge badge-success gap-1">
                    <div className="w-2 h-2 bg-success-content rounded-full animate-pulse" />
                    Verified
                  </div>
                </div>

                {/* Account Type */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-base-content/70">Account Type</p>
                      <p className="font-semibold text-primary">Premium User</p>
                    </div>
                  </div>
                  <div className="badge badge-primary">PRO</div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="alert bg-base-100 border border-base-300 shadow-lg">
            <Shield className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-semibold">Your account is secure</h3>
              <p className="text-sm text-base-content/70">
                We use industry-standard encryption to protect your data
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;