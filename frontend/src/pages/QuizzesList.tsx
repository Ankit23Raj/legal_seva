
import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { QUIZ_CATEGORIES } from '@/lib/constants/quizzes';
import { QuizCard } from '@/components/QuizCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function QuizzesList() {
  const { translate } = useLanguage();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {translate("Quizzes for Fun")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {translate("Test your legal knowledge with these interactive quizzes.")}
          </p>
        </div>

        <Tabs defaultValue={QUIZ_CATEGORIES[0].id}>
          <TabsList className="mb-6">
            {QUIZ_CATEGORIES.map(category => (
              <TabsTrigger key={category.id} value={category.id}>
                {translate(category.title)}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {QUIZ_CATEGORIES.map(category => (
            <TabsContent key={category.id} value={category.id} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {category.levels.map(level => (
                  <QuizCard 
                    key={level.id} 
                    categoryId={category.id} 
                    level={level} 
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
