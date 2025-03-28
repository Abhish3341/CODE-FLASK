import React from "react";
import { Code2 } from "lucide-react";
import { Link } from "react-router-dom";

const CodeFlaskLogo = "/codeflask.svg";

const About = () => {
  const stats = [
    { number: "100K+", label: "Active Users" },
    { number: "50+", label: "Countries" },
    { number: "1M+", label: "Code Executions" },
    { number: "99.9%", label: "Uptime" },
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "Founder & CEO",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    },
    {
      name: "Michael Rodriguez",
      role: "CTO",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    },
    {
      name: "Emily Williams",
      role: "Head of Product",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    },
    {
      name: "David Kim",
      role: "Lead Engineer",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      {/* Logo Section with Redirect */}
      <Link
        to="/"
        className="absolute top-4 left-4 flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <img src={CodeFlaskLogo} alt="CodeFlask Logo" className="h-8" />
        <span className="text-xl font-bold">CodeFlask</span>
      </Link>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Our Mission is to Make Coding Accessible to Everyone
        </h1>
        <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto">
          At CodeFlask, we believe that everyone should have access to powerful development tools.
          We're building the future of collaborative coding and learning.
        </p>
      </div>

      {/* Stats Section */}
      <div className="bg-[var(--color-bg-secondary)] py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold text-indigo-500">{stat.number}</div>
                <div className="text-[var(--color-text-secondary)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="card p-6 text-center hover:shadow-lg transition-shadow bg-[var(--color-bg-secondary)]"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-[var(--color-text-secondary)]">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-[var(--color-border)]">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2">
                <Code2 className="w-6 h-6 text-indigo-500" />
                <span className="text-[var(--color-text-primary)] font-semibold">CodeFlask</span>
              </Link>
            </div>
            <div className="text-[var(--color-text-secondary)]">
              © 2025 CodeFlask. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;