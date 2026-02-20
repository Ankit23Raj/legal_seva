
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  MessageSquare, 
  BookOpen, 
  User, 
  LogOut, 
  HelpCircle, 
  Menu, 
  X,
  Share2,
  Reply,
  BrainCircuit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChatbotButton } from '@/components/ChatbotButton';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      href: '/dashboard',
      label: translate('Dashboard'),
      icon: <User className="h-5 w-5" />,
      roles: ['local', 'student', 'admin'],
    },
    {
      href: '/share-issue',
      label: translate('Share Issue'),
      icon: <Share2 className="h-5 w-5" />,
      roles: ['local'],
    },
    {
      href: '/reply-client',
      label: translate('Reply to Client'),
      icon: <Reply className="h-5 w-5" />,
      roles: ['student'],
    },
    {
      href: '/quizzes',
      label: translate('Quizzes'),
      icon: <BrainCircuit className="h-5 w-5" />,
      roles: ['local', 'student', 'admin'],
    },
    {
      href: '/legal-modules',
      label: translate('Legal Modules'),
      icon: <BookOpen className="h-5 w-5" />,
      roles: ['local', 'student', 'admin'],
    },
    {
      href: '/messages',
      label: translate('Messages'),
      icon: <MessageSquare className="h-5 w-5" />,
      roles: ['local', 'student', 'admin'],
    },
    {
      href: '/help',
      label: translate('Help'),
      icon: <HelpCircle className="h-5 w-5" />,
      roles: ['local', 'student', 'admin'],
    },
  ];

  const filteredMenuItems = menuItems.filter(
    item => !user?.role || item.roles.includes(user.role)
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r bg-sidebar">
        <div className="p-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">{translate("Legal Seva")}</h1>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                location.pathname === item.href
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2" 
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            {translate("Sign Out")}
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0 border-r bg-sidebar w-64">
          <SheetHeader className="p-6 border-b">
            <SheetTitle className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span>{translate("Legal Seva")}</span>
            </SheetTitle>
          </SheetHeader>
          
          <nav className="flex-1 px-4 py-4 space-y-1">
            {filteredMenuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                  location.pathname === item.href
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="p-4 border-t">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2" 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              {translate("Sign Out")}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 flex items-center justify-between border-b px-6">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h2 className="font-semibold lg:hidden">
              {translate("Legal Seva")}
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <LanguageSelector />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium text-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-sm font-medium">
                  {user?.name || 'User'}
                </div>
                <div className="px-2 text-xs text-muted-foreground">
                  {user?.email}
                </div>
                <hr className="my-2" />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  {translate("Sign Out")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </main>

      {/* AI Chatbot */}
      <ChatbotButton />
    </div>
  );
}
