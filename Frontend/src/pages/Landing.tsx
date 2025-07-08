import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Terminal, Zap, Shield, ArrowRight, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Landing = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  const handleRedirect = () => {
    window.scrollTo(0, 0);
  };

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
              <Link to="/" onClick={handleRedirect} className="flex items-center gap-2 cursor-pointer group">
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
      <section className="py-12 md:py-20 text-center">
        <div className="container mx-auto px-4 sm:px-6">
          <h1 className={`text-3xl sm:text-5xl font-bold mb-4 sm:mb-6 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Code, Compile, and Learn with
            <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent"> CodeFlask</span>
          </h1>
          <p className={`text-base sm:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto transition-colors duration-300 ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            A powerful online IDE that helps you write, compile, and execute code in multiple languages.
            Perfect for learning, practicing, and mastering programming.
          </p>
          <Link
            to="/login"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg font-semibold"
          >
            Start Coding Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-12 md:py-20 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-slate-800/50 backdrop-blur-lg' 
          : 'bg-white/50 backdrop-blur-lg'
      }`}>
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className={`text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Powerful Features you'll{' '}
            <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Love
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className={`group p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
              isDarkMode 
                ? 'bg-slate-800/60 backdrop-blur-lg border border-slate-700 hover:border-indigo-500/50' 
                : 'bg-white/80 backdrop-blur-lg border border-slate-200 hover:border-indigo-300 shadow-lg'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 mb-4 group-hover:from-indigo-600 group-hover:to-purple-700 transition-all duration-300">
                  <Terminal className="w-7 h-7 text-white" />
                </div>
                <h3 className={`text-xl font-semibold mb-2 group-hover:text-indigo-500 transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Multiple Languages
                </h3>
                <p className={`transition-colors duration-300 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Support for C, C++, Python, and more languages with syntax highlighting and auto-completion.
                </p>
              </div>
            </div>
            <div className={`group p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
              isDarkMode 
                ? 'bg-slate-800/60 backdrop-blur-lg border border-slate-700 hover:border-indigo-500/50' 
                : 'bg-white/80 backdrop-blur-lg border border-slate-200 hover:border-indigo-300 shadow-lg'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 mb-4 group-hover:from-indigo-600 group-hover:to-purple-700 transition-all duration-300">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className={`text-xl font-semibold mb-2 group-hover:text-indigo-500 transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Real-time Compilation
                </h3>
                <p className={`transition-colors duration-300 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Instantly compile and run your code with our powerful cloud infrastructure.
                </p>
              </div>
            </div>
            <div className={`group p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
              isDarkMode 
                ? 'bg-slate-800/60 backdrop-blur-lg border border-slate-700 hover:border-indigo-500/50' 
                : 'bg-white/80 backdrop-blur-lg border border-slate-200 hover:border-indigo-300 shadow-lg'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 mb-4 group-hover:from-indigo-600 group-hover:to-purple-700 transition-all duration-300">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className={`text-xl font-semibold mb-2 group-hover:text-indigo-500 transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Secure Environment
                </h3>
                <p className={`transition-colors duration-300 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Docker containerization ensures safe and isolated code execution.
                </p>
              </div>
            </div>
          </div>

          {/* See All Features Button */}
          <div className="mt-10 flex justify-center">
            <Link
              to="/features"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
            >
              See All Features
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

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
            {/* Button below Our Story */}
            <div className="mt-10 flex justify-center">
              <Link
                to="/about"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
              >
                See to Know About Us
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
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
              <Link to="/" onClick={handleRedirect} className="flex items-center gap-2 cursor-pointer group">
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

export default Landing;