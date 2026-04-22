import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';

export default function RoleSelection() {
  const navigate = useNavigate();
  const { translate } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/5 flex flex-col">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">{translate("Legal Seva")}</h1>
          </div>
          <LanguageSelector />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              {translate("Welcome to Legal Seva")}
            </h2>
            <p className="text-xl text-muted-foreground">
              {translate("Choose your role to get started")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Client Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/sign-in?role=client')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Users className="h-6 w-6 text-blue-600" />
                  {translate("Client")}
                </CardTitle>
                <CardDescription>
                  {translate("Seeking Legal Advice")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>{translate("Get guidance from law students")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>{translate("Share your legal issues")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>{translate("Chat and connect with advisors")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>{translate("Learn through interactive quizzes")}</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" size="lg">
                  {translate("Sign In as Client")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Student Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/sign-in?role=student')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <BookOpen className="h-6 w-6 text-emerald-600" />
                  {translate("Law Student")}
                </CardTitle>
                <CardDescription>
                  {translate("Provide Legal Guidance")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>{translate("Help clients with legal questions")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>{translate("Reply to client inquiries")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>{translate("Build your profile and ratings")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>{translate("Become a Prime advisor")}</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" size="lg">
                  {translate("Sign In as Student")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-12">
            <p className="text-muted-foreground">
              {translate("Don't have an account?")}{" "}
              <button 
                onClick={() => navigate('/sign-up')}
                className="text-primary font-medium hover:underline"
              >
                {translate("Sign Up")}
              </button>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 px-6 bg-white/50">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2026 Legal Seva. {translate("All rights reserved.")}</p>
        </div>
      </footer>
    </div>
  );
}
