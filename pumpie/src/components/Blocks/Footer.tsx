import React from 'react';
import {
  Twitter,
  Github,
  Linkedin,
  Mail
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center bg-white">
      <footer className="w-full">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1">
              <h3 className="text-lg font-semibold text-gray-900">Angelpoop</h3>
              <p className="mt-4 text-sm text-gray-600">
                AI-Powered Launchpad for TON Chain Projects
              </p>
            </div>

            {/* Links */}
            <div className="col-span-1">
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Platform</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#features" className="text-base text-gray-500 hover:text-gray-900">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-span-1">
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Company</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#about" className="text-base text-gray-500 hover:text-gray-900">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div className="col-span-1">
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Connect</h3>
              <div className="mt-4 flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Twitter</span>
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">GitHub</span>
                  <Github className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">LinkedIn</span>
                  <Linkedin className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Email</span>
                  <Mail className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-base text-gray-400 text-center">
              &copy; {new Date().getFullYear()}AngelPoop. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
