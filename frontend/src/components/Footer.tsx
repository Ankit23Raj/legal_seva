import React from 'react';
import { BookOpen, Facebook, Twitter, Linkedin, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const Footer = () => {
  const { translate } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 md:pl-56">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-white text-lg">Legal Seva</span>
            </div>
            <p className="text-sm text-gray-400">
              {translate('Connecting people with legal guidance from law students')}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">{translate('Quick Links')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  {translate('Home')}
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-blue-400 transition-colors">
                  {translate('Features')}
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-blue-400 transition-colors">
                  {translate('About')}
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-blue-400 transition-colors">
                  {translate('Contact')}
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-4">{translate('Resources')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  {translate('Privacy Policy')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  {translate('Terms of Service')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  {translate('FAQ')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  {translate('Blog')}
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-white mb-4">{translate('Follow Us')}</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:info@legalseva.com"
                className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          {/* Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>
              &copy; {currentYear} {translate('Legal Seva')}. {translate('All rights reserved.')}
            </p>
            <p className="mt-4 md:mt-0">
              {translate('Made with')} ❤️ {translate('for legal accessibility')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
