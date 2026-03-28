import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Home, Zap, Info, Mail, Menu, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export const Sidebar = () => {
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Zap, label: 'Key Features', path: '#features' },
    { icon: Info, label: 'About', path: '#about' },
    { icon: Mail, label: 'Contact', path: '#contact' },
  ];

  const handleClick = (path: string) => {
    if (path.startsWith('#')) {
      // Scroll to section
      const element = document.querySelector(path);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(path);
    }
    setIsOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-40 md:hidden bg-blue-600 text-white p-2 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-56 bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-2xl transform transition-transform duration-300 z-30 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-blue-700 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="bg-white rounded-lg p-2">
            <BookOpen className="h-6 w-6 text-blue-900" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Legal Seva</h1>
            <p className="text-xs text-blue-200">Your Legal Guide</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleClick(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-white text-blue-900 font-semibold shadow-lg'
                    : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span>{translate(item.label)}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700">
          <p className="text-xs text-blue-200 text-center mb-3">
            {translate('Get professional legal guidance from law students')}
          </p>
          <div className="space-y-2">
            <Button
              className="w-full bg-white text-blue-900 hover:bg-blue-50 font-semibold"
              onClick={() => {
                navigate('/sign-in');
                setIsOpen(false);
              }}
            >
              {translate('Sign In')}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
