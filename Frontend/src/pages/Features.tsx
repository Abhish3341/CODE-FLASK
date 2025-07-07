import React from 'react';
import { Code2, Terminal, Zap, Shield, Cloud, Clock, Layout, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Features = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  const handleRedirect = () => {
    window.scrollTo(0, 0);
  };

  const features = [
    {
      icon: Terminal,
      title: 'Multiple Language Support',
      description: 'Write code in Python, Java, C, and C++. Full code template support for all major programming languages.'
    },
    {
      icon: Zap,
      title: 'Real-time Compilation',
      description: 'Instantly compile and run your code with our powerful cloud infrastructure. Get immediate feedback and see your results in real-time.'
    },
    {
      icon: Shield,
      title: 'Secure Environment',
      description: 'Your code runs in isolated containers ensuring maximum security. Each execution environment is fresh and separate from others.'
    },
    
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* Header */}
      <header className="border-b border-[var(--color-border)]">
        <nav className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
            <div className="flex items-center gap-2">
              <Link to="/" onClick={handleRedirect} className="flex items-center gap-2">
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
      <div className="container mx-auto px-4 sm:px-6 py-12 md:py-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-[var(--color-text-primary)] mb-4 sm:mb-6">
          Features that Empower Your Coding Journey
        </h1>
        <p className="text-base sm:text-xl text-center text-[var(--color-text-secondary)] max-w-3xl mx-auto">
          CodeFlask provides all the tools you need to write, test, and deploy your code efficiently.
          Discover our powerful features designed for modern development.
        </p>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 sm:px-6 pb-12 md:pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card p-4 sm:p-6 hover:shadow-lg transition-shadow rounded-lg bg-[var(--color-bg-primary)]">
              <feature.icon className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-500 mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-text-primary)] mb-2 sm:mb-3">
                {feature.title}
              </h3>
              <p className="text-[var(--color-text-secondary)] text-sm sm:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[var(--color-bg-secondary)] py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-6">
            Ready to Start Coding?
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-8 max-w-2xl mx-auto">
            Join developers who trust CodeFlask for their coding needs.
            Start coding now and experience the difference.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-lg font-medium"
          >
            Get Started Free
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-[var(--color-border)]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Link to="/" onClick={handleRedirect} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
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

export default Features;