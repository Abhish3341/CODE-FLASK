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
    <div className={`min-h-screen bg-[var(--color-bg-primary)]`}>
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
      <section className="py-12 md:py-20 text-center">
        <div className="container mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-5xl font-bold text-[var(--color-text-primary)] mb-4 sm:mb-6">
            Code, Compile, and Learn with
            <span className="text-indigo-500"> CodeFlask</span>
          </h1>
          <p className="text-base sm:text-xl text-[var(--color-text-secondary)] mb-6 sm:mb-8 max-w-2xl mx-auto">
            A powerful online IDE that helps you write, compile, and execute code in multiple languages.
            Perfect for learning, practicing, and mastering programming.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-lg"
          >
            Start Coding Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 md:py-20 bg-[var(--color-bg-secondary)]">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] text-center mb-8 sm:mb-12">
            Powerful Features for Modern Development
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="card p-6">
              <Terminal className="w-12 h-12 text-indigo-500 mb-4" />
              <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                Multiple Languages
              </h3>
              <p className="text-[var(--color-text-secondary)]">
                Support for C, C++, Python, and more languages with syntax highlighting and auto-completion.
              </p>
            </div>
            <div className="card p-6">
              <Zap className="w-12 h-12 text-indigo-500 mb-4" />
              <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                Real-time Compilation
              </h3>
              <p className="text-[var(--color-text-secondary)]">
                Instantly compile and run your code with our powerful cloud infrastructure.
              </p>
            </div>
            <div className="card p-6">
              <Shield className="w-12 h-12 text-indigo-500 mb-4" />
              <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                Secure Environment
              </h3>
              <p className="text-[var(--color-text-secondary)]">
                Docker containerization ensures safe and isolated code execution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[var(--color-border)]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Link to="/" onClick={handleRedirect} className="flex items-center gap-2">
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

export default Landing;
