import React from "react";
import { Code2, Heart, Target, Users, Lightbulb, Award, Sun, Moon, Shield } from "lucide-react";
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
      icon: <Users className="w-8 h-8 text-yellow-400" />, // changed from blue to yellow
      title: "Community First",
      description: "Building a supportive community where developers of all levels can learn and grow together"
    },
    {
      icon: <Target className="w-8 h-8 text-green-500" />,
      title: "Accessibility",
      description: "Making powerful development tools accessible to everyone, regardless of their background"
    },
    {
      icon: <Award className="w-8 h-8 text-yellow-400" />,
      title: "Excellence",
      description: "Committed to delivering high-quality, reliable tools that developers can depend on"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-500" />, // changed from blue to green
      title: "Privacy",
      description: "The platform maintains user privacy and integrity by incorporating Encryption techniques."
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
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-50'
    }`}>
      {/* Header */}
      <header className={`border-b transition-colors duration-300 ${
        isDarkMode 
          ? 'border-slate-700 bg-slate-900/50 backdrop-blur-lg' 
          : 'border-slate-200 bg-white/50 backdrop-blur-lg'
      }`}>
        <nav className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2 cursor-pointer group">
                <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 group-hover:from-indigo-600 group-hover:to-purple-700 transition-all duration-300">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <span className={`text-xl font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>CodeFlask</span>
              </Link>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/features" className={`transition-colors duration-300 hover:text-indigo-500 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>Features</Link>
              <Link to="/about" className={`transition-colors duration-300 hover:text-indigo-500 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>About</Link>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                  isDarkMode 
                    ? 'hover:bg-slate-800 text-slate-300' 
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Link to="/login" className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Get Started
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 py-12 md:py-20 text-center">
        <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 transition-colors duration-300 ${
          isDarkMode ? 'text-white' : 'text-slate-900'
        }`}>
          Our Mission is to Make Coding{' '}
          <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Intuitive, Engaging, and Accessible
          </span>{' '}
          to All.
        </h1>
        <p className={`text-base sm:text-xl max-w-3xl mx-auto transition-colors duration-300 ${
          isDarkMode ? 'text-slate-300' : 'text-slate-600'
        }`}>
          At CodeFlask, we're building a modern online judge platform that empowers every developer — from beginners to pros — with intuitive design, structured learning, and a collaborative coding experience.
        </p>
      </div>

      {/* Values Section */}
      <div className={`py-12 md:py-20 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-slate-800/50 backdrop-blur-lg' 
          : 'bg-white/50 backdrop-blur-lg'
      }`}>
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className={`text-2xl sm:text-3xl font-bold text-center mb-4 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>Our Core Values</h2>
          <p className={`text-center text-base sm:text-xl mb-8 sm:mb-12 max-w-2xl mx-auto transition-colors duration-300 ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            These principles guide everything we do and shape the way we build products for the developer community.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 justify-items-center">
            {values.map((value, index) => (
              <div
                key={index}
                className={`group p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl w-full max-w-xs ${
                  isDarkMode 
                    ? 'bg-slate-800/60 backdrop-blur-lg border border-slate-700 hover:border-indigo-500/50' 
                    : 'bg-white/80 backdrop-blur-lg border border-slate-200 hover:border-indigo-300 shadow-lg'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 mb-4 group-hover:from-indigo-600 group-hover:to-purple-700 transition-all duration-300">
                    <div className="transform group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                      {value.icon}
                    </div>
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-3 group-hover:text-indigo-500 transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {value.title}
                  </h3>
                  
                  <p className={`text-center transition-colors duration-300 leading-relaxed ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className={`text-3xl font-bold mb-8 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>Our Story</h2>
            <div className={`prose prose-lg mx-auto transition-colors duration-300 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              <p className="mb-6">
                CodeFlask was born from a clear purpose: to rethink how developers <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>experience online judge platforms</strong>.
              </p>
              <p className="mb-6">
                While many online judge platforms offer great features, they often fall short in one key area — <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>user engagement </strong>
                whether it's uninspired UI/UX or an overwhelming learning curve, many aspiring developers struggle to stay motivated.
              </p>
              <p className="mb-6">
                We set out to change that. From day one, our goal was to build <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>a fully featured online judge platform</strong> that doesn't just work — but <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>feels great to use. </strong> 
                Clean design, intuitive workflows, and a distraction-free environment make solving problems feel less like a task and more like progress.
              </p>
              <p className="mb-6">
                But we didn't stop there. We also noticed that many learners get stuck not because they lack knowledge, but because they lack <em className="text-indigo-500">momentum</em>. 
                That's why CodeFlask introduces assignment-style questions designed to <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>rebuild coding fluency</strong> — ensuring users learn something meaningful with each step, and stay motivated to continue.
              </p>
              <p>
                Today, CodeFlask continues to grow with feedback from our developer community, united by a simple mission: to make coding platforms more <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>accessible</strong>, more <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>productive</strong>, and more <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>human</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Founder Section */}
      <div className={`py-12 md:py-20 flex flex-col items-center transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-slate-800/50 backdrop-blur-lg' 
          : 'bg-white/50 backdrop-blur-lg'
      }`}>
        <h2 className={`text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 transition-colors duration-300 ${
          isDarkMode ? 'text-white' : 'text-slate-900'
        }`}>Meet Our Founder</h2>
        <div className={`group p-4 sm:p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl rounded-2xl w-full max-w-xs ${
          isDarkMode 
            ? 'bg-slate-800/60 backdrop-blur-lg border border-slate-700 hover:border-indigo-500/50' 
            : 'bg-white/80 backdrop-blur-lg border border-slate-200 hover:border-indigo-300 shadow-lg'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {/* Clickable Image */}
          <a
            href={team[0].github}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative z-10"
          >
            <div className="relative">
              <img
                src={team[0].image}
                alt="Founder Image"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover transition-all duration-300 hover:scale-110 hover:shadow-xl ring-4 ring-transparent hover:ring-indigo-500/30"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </a>
          <h3 className={`text-lg font-bold mb-2 relative z-10 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>{team[0].name}</h3>
          <p className={`relative z-10 transition-colors duration-300 ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>{team[0].role}</p>
        </div>
      </div>

      {/* Footer */}
      <footer className={`py-8 border-t transition-colors duration-300 ${
        isDarkMode 
          ? 'border-slate-700 bg-slate-900/50' 
          : 'border-slate-200 bg-white/50'
      }`}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2 cursor-pointer group">
                <div className="p-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <span className={`font-semibold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>CodeFlask</span>
              </Link>
            </div>
            <div className={`text-center sm:text-right text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              © 2025 CodeFlask. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;