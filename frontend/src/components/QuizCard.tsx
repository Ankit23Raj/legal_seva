
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QuizLevel } from '@/lib/constants/quizzes';
import { useLanguage } from '@/contexts/LanguageContext';

interface QuizCardProps {
  categoryId: string;
  level: QuizLevel;
}

export function QuizCard({ categoryId, level }: QuizCardProps) {
  const { translate } = useLanguage();
  const navigate = useNavigate();

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{translate(level.title)}</CardTitle>
            <CardDescription>{translate(level.description)}</CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{level.attempts}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {translate("This quiz contains")} {level.questions.length} {translate("questions to test your knowledge")}
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full gap-1"
          onClick={() => navigate(`/quizzes/${categoryId}/${level.id}`)}
        >
          {translate("Start Quiz")}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
