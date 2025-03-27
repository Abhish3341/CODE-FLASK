import React from "react";
import { Link } from "react-router-dom";
import { Code2 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 border-t border-gray-800">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:text-indigo-500 transition-colors">
          <Code2 className="w-6 h-6 text-indigo-500" />
          <span className="text-white font-semibold">CodeFlask</span>
        </Link>
        <div className="text-gray-400">© 2025 CodeFlask. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;
