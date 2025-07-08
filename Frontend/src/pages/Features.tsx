import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Brain, BookOpen, Trophy, Layout, Zap, Shield, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext'; // <-- Use the context

const Features = () => {
  const { isDarkMode, toggleTheme } = useTheme(); // <-- Use context values

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Hints',
      description: 'Get intelligent hints and suggestions while solving problems. Our AI analyzes your code and provides contextual guidance to help you learn and improve.'
    },
    {
      icon: BookOpen,
      title: 'Built-in Learning Package',
      description: 'Comprehensive learning resources for beginners. Interactive tutorials, code examples, and step-by-step guides to master programming concepts.'
    },
    {
      icon: Trophy,
      title: 'Dynamic Scoreboard',
      description: 'Track your progress and compete with peers. Real-time leaderboards, achievement badges, and performance analytics to motivate your coding journey.'
    },
    {
      icon: Layout,
      title: 'Enhanced UI/UX',
      description: 'Modern, intuitive interface that surpasses traditional coding platforms. Clean design, customizable themes, and seamless user experience.'
    },
    {
      icon: Zap,
      title: 'Real-time Compilation',
      description: 'Instantly compile and run your code with lightning-fast performance. Get immediate feedback with our powerful cloud infrastructure.'
    },
    {
      icon: Shield,
      title: 'Secure Environment',
      description: 'Your code runs in isolated containers ensuring maximum security. Each execution environment is sandboxed and protected from external threats.'
    }
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
                }`}>
                  CodeFlask
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/features" className={`transition-colors duration-300 hover:text-indigo-500 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Features
              </Link>
              <Link to="/about" className={`transition-colors duration-300 hover:text-indigo-500 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>
                About
              </Link>
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
      <div className="container mx-auto px-4 sm:px-6 py-12 md:py-20">
        <div className="text-center mb-16">
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-6 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Features that{' '}
            <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Empower
            </span>{' '}
            Your Coding Journey
          </h1>
          <p className={`text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed transition-colors duration-300 ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            CodeFlask provides all the cutting-edge tools you need to write, test, and deploy your code efficiently.
            Discover our powerful features designed for the modern developer.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`group relative p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                isDarkMode 
                  ? 'bg-slate-800/60 backdrop-blur-lg border border-slate-700 hover:border-indigo-500/50' 
                  : 'bg-white/80 backdrop-blur-lg border border-slate-200 hover:border-indigo-300 shadow-lg'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 mb-4 group-hover:from-indigo-600 group-hover:to-purple-700 transition-all duration-300">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className={`text-xl font-bold mb-3 group-hover:text-indigo-500 transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {feature.title}
                </h3>
                
                <p className={`transition-colors duration-300 leading-relaxed ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className={`py-20 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-slate-800/50 backdrop-blur-lg' 
          : 'bg-white/50 backdrop-blur-lg'
      }`}>
        <div className="container mx-auto px-6 text-center">
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Ready to Start{' '}
            <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Coding?
            </span>
          </h2>
          <p className={`text-lg mb-8 max-w-2xl mx-auto leading-relaxed transition-colors duration-300 ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Join thousands of developers who trust CodeFlask for their coding needs.
            Start your journey today and experience the difference.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg font-semibold"
          >
            Get Started Free
            <Zap className="w-5 h-5 ml-2" />
          </Link>
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
                }`}>
                  CodeFlask
                </span>
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

export default Features;