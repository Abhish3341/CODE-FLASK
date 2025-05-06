import React from 'react';
import { Code2, Terminal, Zap, Shield, Cloud, Clock, Layout } from 'lucide-react';
import { Link } from 'react-router-dom';


const CodeFlaskLogo = "/codeflask.svg";

const Features = () => {
  const handleRedirect = () => {
    console.log("Redirecting to the homepage...");
  };

  const features = [
    {
      icon: Terminal,
      title: 'Multiple Language Support',
      description: 'Write code in Python, JavaScript, Java, C++, and more. Full syntax highlighting and intelligent code completion support for all major programming languages.'
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
    {
      icon: Cloud,
      title: 'Cloud Storage',
      description: 'All your code is automatically saved and synced to the cloud. Access your projects from anywhere, anytime.'
    },
    {
      icon: Clock,
      title: 'Version Control',
      description: 'Built-in version control helps you track changes and maintain different versions of your code. Never lose your work again.'
    },
    {
      icon: Layout,
      title: 'Customizable Interface',
      description: 'Personalize your coding environment with themes, and layout options that suit your workflow.'
    },
    {
      icon: Code2,
      title: 'Debugging Tools',
      description: 'Powerful debugging capabilities with breakpoints, variable inspection, and step-through execution to find and fix bugs quickly.'
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* Logo Section with Redirect */}
      <Link to="/" className="absolute top-4 left-4 flex items-center gap-2 hover:opacity-80 transition-opacity">
        <img src={CodeFlaskLogo} alt="CodeFlask Logo" className="h-8" />
        <span className="text-xl font-bold text-[var(--color-text-primary)]">CodeFlask</span>
      </Link>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-[var(--color-text-primary)] mb-6">
          Features that Empower Your Coding Journey
        </h1>
        <p className="text-xl text-center text-[var(--color-text-secondary)] max-w-3xl mx-auto">
          CodeFlask provides all the tools you need to write, test, and deploy your code efficiently.
          Discover our powerful features designed for modern development.
        </p>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card p-6 hover:shadow-lg transition-shadow">
              <feature.icon className="w-12 h-12 text-indigo-500 mb-4" />
              <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">
                {feature.title}
              </h3>
              <p className="text-[var(--color-text-secondary)]">
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
            Join thousands of developers who trust CodeFlask for their coding needs.
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
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link to="/" onClick={handleRedirect} className="flex items-center gap-2">
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

export default Features;