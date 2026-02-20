
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Award, MessageSquare, BrainCircuit, BookMarked } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LanguageSelector } from '@/components/LanguageSelector';
import { ChatbotButton } from '@/components/ChatbotButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { translate } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">{translate("Legal Seva")}</h1>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <div className="hidden sm:flex gap-2">
              <Button variant="outline" onClick={() => navigate('/role-selection')}>
                {translate("Sign In")}
              </Button>
              <Button onClick={() => navigate('/sign-up')}>
                {translate("Sign Up")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            {translate("Get Legal Guidance from Law Students")}
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {translate("Connect with law students for advice on legal matters. Ask questions, get guidance, and learn about your rights.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/sign-up')} className="text-lg">
              {translate("Get Started")}
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/role-selection')} className="text-lg">
              {translate("Sign In")}
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-secondary">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            {translate("Key Features")}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  {translate("Share Legal Issues")}
                </CardTitle>
                <CardDescription>
                  {translate("Post your legal problems and get personalized advice.")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {translate("Describe your situation, upload documents, and connect with law students who can help you understand your options.")}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  {translate("Connect with Students")}
                </CardTitle>
                <CardDescription>
                  {translate("Chat and schedule calls with law students.")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {translate("Engage with verified law students through our secure messaging system and schedule video calls for complex issues.")}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  {translate("Prime Student Access")}
                </CardTitle>
                <CardDescription>
                  {translate("Connect with top-rated student advisors.")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {translate("Students with exceptional ratings become Prime Users, offering premium advice for those with complex legal needs.")}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                  {translate("Interactive Quizzes")}
                </CardTitle>
                <CardDescription>
                  {translate("Test your legal knowledge with fun quizzes.")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {translate("Challenge yourself with quizzes covering different legal topics and difficulty levels to increase your understanding.")}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookMarked className="h-5 w-5 text-primary" />
                  {translate("Legal Modules")}
                </CardTitle>
                <CardDescription>
                  {translate("Access informative resources about various legal topics.")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {translate("Explore comprehensive guides on Indian constitution, criminal law, family law, cyber law, property rights, and consumer rights.")}
                </p>
              </CardContent>
            </Card>
            

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-6">
            {translate("Ready to Get Legal Guidance?")}
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            {translate("Join our community today and connect with law students who can help you navigate your legal concerns.")}
          </p>
          <Button size="lg" onClick={() => navigate('/sign-up')} className="text-lg">
            {translate("Create Your Account")}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2023 Legal Seva. {translate("All rights reserved.")}</p>
        </div>
      </footer>

      {/* AI Chatbot */}
      <ChatbotButton />
    </div>
  );
};

export default Index;
