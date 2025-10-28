import { User, Sparkles } from "lucide-react";
import {
  FaFacebookF,
  FaWhatsapp,
  FaFacebookMessenger,
  FaGithub,
  FaLinkedinIn,
  FaRocket,
  FaCode,
  FaHeart,
} from "react-icons/fa";

const DeveloperProfile = () => {
  const akashSocialLinks = [
    {
      icon: FaFacebookF,
      href: "https://www.facebook.com/atapk41/",
      color: "hover:text-blue-600",
      bg: "hover:bg-blue-500/10",
      name: "Facebook",
    },
    {
      icon: FaWhatsapp,
      href: "https://wa.me/8801405700935?text=Hello%20I%20am%20interested",
      color: "hover:text-green-500",
      bg: "hover:bg-green-500/10",
      name: "WhatsApp",
    },
    {
      icon: FaFacebookMessenger,
      href: "https://m.me/atapk41",
      color: "hover:text-blue-500",
      bg: "hover:bg-blue-500/10",
      name: "Messenger",
    },
    {
      icon: FaGithub,
      href: "https://github.com/akashpk41",
      color: "hover:text-gray-700",
      bg: "hover:bg-gray-500/10",
      name: "GitHub",
    },
    {
      icon: FaLinkedinIn,
      href: "https://linkedin.com/in/akashpk41",
      color: "hover:text-blue-700",
      bg: "hover:bg-blue-700/10",
      name: "LinkedIn",
    },
  ];

  return (
    <div className="card bg-gradient-to-br from-base-100 to-base-200 shadow-2xl border border-base-300 overflow-hidden">
      <div className="card-body p-6">
        {/* Profile Content */}
        <div className="relative">
          {/* Background Gradient Orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/10 rounded-full blur-2xl" />
          </div>

          <div className="relative z-10 text-center">
            {/* Profile Image */}
            <div className="relative w-72 h-72 mx-auto mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full animate-pulse opacity-20 blur-md" />
              <img
                src="https://i.ibb.co.com/GhZWtVc/1740218980929.jpg"
                alt="Akash PK"
                className="relative w-full h-full rounded-full object-cover border-4 border-primary shadow-xl"
              />
              {/* Online Status */}
              <div className="absolute bottom-3 right-12 w-7 h-7 bg-green-500 rounded-full border-4 border-base-100 animate-pulse" />
            </div>

            {/* Name & Title */}
            <h3 className="text-5xl font-bold mb-1">Akash PK</h3>
            <div className="flex items-center justify-center gap-2 text-primary mb-2">
              <FaCode className="animate-pulse" />
              <span className="font-semibold text-xl mt-2">
                MERN Stack Developer
              </span>
            </div>

            {/* Experience Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full mb-4">
              <FaRocket className="text-primary" />
              <span className="text-md font-medium">Since 2021</span>
            </div>

            {/* Description */}
            <div className="space-y-3 mb-8">
              <p className="text-md text-base-content/80 leading-relaxed max-w-md mx-auto">
                MERN stack developer building full-stack web applications with{" "}
                <span className="font-semibold text-primary">
                  MongoDB, Express.js, React, and Node.js
                </span>
                .
              </p>

              <div className="p-2 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-primary/20">
                <p className="text-sm font-medium flex items-center justify-center gap-2 text-primary">
                  <FaRocket className="animate-pulse h-6 w-6" />
                  Working towards launching a software startup — very soon,
                  InshaAllah.
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-4">
              <p className="text-sm text-base-content/60 mb-3 uppercase tracking-wider">
                Connect with me
              </p>
              <div className="flex justify-center gap-2 flex-wrap">
                {akashSocialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative p-3 bg-base-200 rounded-xl ${social.color} ${social.bg} transition-all duration-300 hover:scale-110 hover:shadow-lg border border-base-300`}
                      title={social.name}
                    >
                      <Icon className="text-3xl" />
                      {/* Tooltip */}
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-base-content text-base-100 text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        {social.name}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperProfile;
