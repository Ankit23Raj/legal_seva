
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2, Reply, BrainCircuit, BookOpen, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { translate } = useLanguage();
  const navigate = useNavigate();

  const isStudent = user?.role === 'student';
  const isPrime = user?.isPrime;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {translate("Welcome")}, {user?.name}!
          </h1>
          <p className="text-muted-foreground mt-2">
            {isStudent 
              ? translate("Access tools and resources to provide legal guidance.") 
              : translate("Explore legal resources and get help from law students.")}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {!isStudent && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-primary" />
                  {translate("Share Your Legal Issue")}
                </CardTitle>
                <CardDescription>
                  {translate("Post your legal problem and get advice from students.")}
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-3">
                <Button className="w-full" onClick={() => navigate('/share-issue')}>
                  {translate("Share Issue")}
                </Button>
              </CardFooter>
            </Card>
          )}

          {isStudent && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Reply className="h-5 w-5 text-primary" />
                  {translate("Reply to Clients")}
                </CardTitle>
                <CardDescription>
                  {translate("Find people who need legal guidance and help them.")}
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-3 flex flex-col gap-2">
                <Button className="w-full" onClick={() => navigate('/reply-client')}>
                  {translate("Browse Issues")}
                </Button>
                {isPrime && (
                  <div className="text-xs text-muted-foreground flex items-center gap-1 justify-center">
                    <Award className="h-3 w-3 text-warning" />
                    {translate("You are a Prime User")}
                  </div>
                )}
              </CardFooter>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-primary" />
                {translate("Test Your Knowledge")}
              </CardTitle>
              <CardDescription>
                {translate("Fun quizzes about different legal topics.")}
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-3">
              <Button className="w-full" onClick={() => navigate('/quizzes')}>
                {translate("Take Quizzes")}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                {translate("Legal Modules")}
              </CardTitle>
              <CardDescription>
                {translate("Informative resources about various legal topics.")}
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-3">
              <Button className="w-full" onClick={() => navigate('/legal-modules')}>
                {translate("Explore Modules")}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {isStudent && user?.rating !== undefined && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">{translate("Your Profile")}</h2>
            <Card>
              <CardHeader>
                <CardTitle>{translate("Rating & Reviews")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">{user.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground ml-1">/ 5.0</span>
                  </div>
                  <div className="text-sm">
                    <p>{user.reviewCount || 0} {translate("reviews")}</p>
                    {isPrime ? (
                      <p className="flex items-center gap-1 text-warning mt-1">
                        <Award className="h-4 w-4" />
                        {translate("Prime User Status")}
                      </p>
                    ) : (
                      <p className="text-muted-foreground mt-1">
                        {translate("Need 4.5+ rating and 20+ reviews for Prime status")}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
