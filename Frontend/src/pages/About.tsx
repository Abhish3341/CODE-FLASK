import React from "react";
import { Code2, Heart, Target, Users, Lightbulb, Award, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const CodeFlaskLogo = "/codeflask.svg";

const About = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  const values = [
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: "Passion for Code",
      description: "We're driven by our love for programming and helping others discover the joy of coding"
    },
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      title: "Community First",
      description: "Building a supportive community where developers of all levels can learn and grow together"
    },
    {
      icon: <Target className="w-8 h-8 text-green-500" />,
      title: "Accessibility",
      description: "Making powerful development tools accessible to everyone, regardless of their background"
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-yellow-500" />,
      title: "Innovation",
      description: "Constantly pushing boundaries to create better tools and experiences for developers"
    },
    {
      icon: <Award className="w-8 h-8 text-purple-500" />,
      title: "Excellence",
      description: "Committed to delivering high-quality, reliable tools that developers can depend on"
    },
   
  ];

  const team = [
    {
      name: "Abhinav Sharma",
      role: "Founder & CEO",
      image: "/founder.jpg",
      github: "https://github.com/Abhish3341",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      {/* Header */}
      <header className="border-b border-[var(--color-border)]">
        <nav className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Code2 className="w-8 h-8 text-indigo-500" />
                <span className="text-xl font-bold text-[var(--color-text-primary)]">CodeFlask</span>
              </Link>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/features" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Features</Link>
              <Link to="/about" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">About</Link>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Link to="/login" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 py-12 md:py-20 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
          Our Mission is to Make Coding Intuitive, Engaging, and Accessible to All.
        </h1>
        <p className="text-base sm:text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto">
          At CodeFlask, we’re building a modern online judge platform that empowers every developer — from beginners to pros — with intuitive design, structured learning, and a collaborative coding experience.
        </p>
      </div>

      {/* Values Section */}
      <div className="bg-[var(--color-bg-secondary)] py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">Our Core Values</h2>
          <p className="text-center text-[var(--color-text-secondary)] text-base sm:text-xl mb-8 sm:mb-12 max-w-2xl mx-auto">
            These principles guide everything we do and shape the way we build products for the developer community.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 justify-items-center">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-[var(--color-bg-primary)] p-6 rounded-lg border border-[var(--color-border)] hover:shadow-lg transition-all duration-300 hover:scale-105 w-full max-w-xs flex flex-col items-center"
              >
                <div className="flex items-center gap-3 mb-4">
                  {value.icon}
                  <h3 className="text-lg font-semibold">{value.title}</h3>
                </div>
                <p className="text-[var(--color-text-secondary)] text-center">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
<div className="py-20">
  <div className="container mx-auto px-6">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-8">Our Story</h2>
      <div className="prose prose-lg mx-auto text-[var(--color-text-secondary)]">
        <p className="mb-6">
          CodeFlask was born from a clear purpose: to rethink how developers experience online coding platforms.
        </p>
        <p className="mb-6">
          While many online judge platforms offer great features, they often fall short in one key area — <strong>user engagement </strong>
          whether it’s uninspired UI/UX or an overwhelming learning curve, many aspiring developers struggle to stay motivated.
        </p>
        <p className="mb-6">
          We set out to change that. From day one, our goal was to build <strong>a fully featured online judge platform</strong> that doesn’t just work — but <strong>feels great to use. </strong> 
          Clean design, intuitive workflows, and a distraction-free environment make solving problems feel less like a task and more like progress.
        </p>
        <p className="mb-6">
          But we didn’t stop there. We also noticed that many learners get stuck not because they lack knowledge, but because they lack <em>momentum</em>. 
          That’s why CodeFlask introduces assignment-style questions designed to <strong>rebuild coding fluency</strong> — ensuring users learn something meaningful with each step, and stay motivated to continue.
        </p>
        <p>
          Today, CodeFlask continues to grow with feedback from our developer community, united by a simple mission: to make coding platforms more <strong>accessible</strong>, more <strong>productive</strong>, and more <strong>human</strong>.
        </p>
      </div>
    </div>
  </div>
</div>


      {/* Founder Section */}
      <div className="py-12 md:py-20 flex flex-col items-center bg-[var(--color-bg-secondary)]">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Meet Our Founder</h2>
        <div className="card p-4 sm:p-6 text-center hover:shadow-lg transition-shadow bg-[var(--color-bg-primary)] rounded-lg border border-[var(--color-border)] w-full max-w-xs">
          {/* Clickable Image */}
          <a
            href={team[0].github}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <img
              src={team[0].image}
              alt="Founder Image"
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover hover:opacity-80 transition-opacity"
            />
          </a>
          <h3 className="text-lg font-bold mb-2">{team[0].name}</h3>
          <p className="text-[var(--color-text-secondary)]">{team[0].role}</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-[var(--color-border)]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2">
                <Code2 className="w-6 h-6 text-indigo-500" />
                <span className="text-[var(--color-text-primary)] font-semibold">CodeFlask</span>
              </Link>
            </div>
            <div className="text-[var(--color-text-secondary)] text-center sm:text-right text-sm">
              © 2025 CodeFlask. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;