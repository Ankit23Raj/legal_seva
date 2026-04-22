import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';

export const Navbar = () => {
  const { translate } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search - you can navigate to a search results page if needed
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 md:left-56 bg-white border-b border-gray-200 shadow-sm z-20">
      <div className="px-4 md:px-6 py-3 flex items-center justify-between gap-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder={translate('Search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>
        </form>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <LanguageSelector />

          {/* Auth Buttons */}
          {!isAuthenticated ? (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/sign-in')}
                className="text-gray-600 hover:text-gray-900"
              >
                {translate('Sign In')}
              </Button>
              <Button
                size="sm"
                onClick={() => navigate('/sign-up')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {translate('Sign Up')}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
