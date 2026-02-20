
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, AlertTriangle, ArrowLeft, ArrowRight, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { QUIZ_CATEGORIES } from '@/lib/constants/quizzes';
import { toast } from '@/components/ui/use-toast';
import { apiFetch } from '@/lib/api';

export default function QuizPage() {
  const { categoryId, levelId } = useParams<{ categoryId: string; levelId: string; }>();
  const navigate = useNavigate();
  const { translate } = useLanguage();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState<number>(Date.now());
  
  // Find the quiz data
  const category = QUIZ_CATEGORIES.find(c => c.id === categoryId);
  const level = category?.levels.find(l => l.id === levelId);
  const questions = level?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  
  // Redirect if quiz not found
  useEffect(() => {
    if (!category || !level) {
      toast({
        variant: "destructive",
        title: translate("Quiz not found"),
        description: translate("The requested quiz could not be found."),
      });
      navigate('/quizzes');
    }
  }, [category, level, navigate, translate]);
  
  // Initialize answers array
  useEffect(() => {
    if (questions.length > 0) {
      setAnswers(new Array(questions.length).fill(null));
      // Set timer based on number of questions (2 minutes per question)
      setTimeLeft(questions.length * 120);
      setQuizStartTime(Date.now());
    }
  }, [questions]);
  
  // Timer functionality
  useEffect(() => {
    if (timeLeft <= 0 || isQuizFinished) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Automatically finish quiz if time runs out
          if (!isQuizFinished) {
            setIsQuizFinished(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, isQuizFinished]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
  };
  
  const handleCheckAnswer = () => {
    if (!selectedAnswer) return;
    
    setIsAnswered(true);
    
    // Update answers array
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedAnswer;
    setAnswers(newAnswers);
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Quiz finished - submit results
      submitQuizResults();
    }
  };

  const submitQuizResults = async () => {
    setIsSubmitting(true);
    const score = calculateScore();
    const timeTaken = Math.floor((Date.now() - quizStartTime) / 1000); // in seconds

    try {
      await apiFetch('/quiz-results/submit', {
        method: 'POST',
        body: JSON.stringify({
          categoryId,
          levelId,
          score: score.correct,
          totalQuestions: score.total,
          answers: answers,
          timeTaken
        })
      });

      setIsQuizFinished(true);
      toast({
        title: translate("Quiz Completed!"),
        description: translate("Your results have been saved."),
      });
    } catch (error) {
      console.error('Error submitting quiz results:', error);
      // Still show results even if submission fails
      setIsQuizFinished(true);
      toast({
        variant: "destructive",
        title: translate("Warning"),
        description: translate("Quiz completed but failed to save results."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(answers[currentQuestionIndex - 1]);
      setIsAnswered(true);
    }
  };
  
  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.answer) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100)
    };
  };
  
  if (!currentQuestion || !level) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <p>{translate("Loading quiz...")}</p>
        </div>
      </DashboardLayout>
    );
  }
  
  const isCorrect = selectedAnswer === currentQuestion.answer;
  const score = calculateScore();
  
  return (
    <DashboardLayout>
      {!isQuizFinished ? (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate('/quizzes')}>
              <ArrowLeft className="h-4 w-4" />
              {translate("Back to Quizzes")}
            </Button>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Timer className="h-4 w-4 text-muted-foreground" />
              <span className={`${timeLeft < 60 ? 'text-destructive font-bold' : ''}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">
                {translate("Question")} {currentQuestionIndex + 1} {translate("of")} {questions.length}
              </h3>
              <span className="text-sm text-muted-foreground">
                {translate(level.title)} - {translate(category?.title || '')}
              </span>
            </div>
            <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="h-2" />
          </div>
          
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                {translate(currentQuestion.question)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedAnswer || ""}
                onValueChange={handleAnswerSelect}
                className="space-y-3"
                disabled={isAnswered}
              >
                {currentQuestion.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center space-x-2 p-3 rounded-md border cursor-pointer
                      ${isAnswered && option === currentQuestion.answer ? 'correct-answer' : ''}
                      ${isAnswered && option === selectedAnswer && option !== currentQuestion.answer ? 'incorrect-answer' : ''}
                      ${!isAnswered ? 'hover:bg-secondary' : ''}
                    `}
                  >
                    <RadioGroupItem value={option} id={`option-${index}`} disabled={isAnswered} />
                    <span className="font-medium">{translate(option)}</span>
                  </label>
                ))}
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {translate("Previous")}
              </Button>
              
              {!isAnswered ? (
                <Button onClick={handleCheckAnswer} disabled={!selectedAnswer}>
                  {translate("Check Answer")}
                </Button>
              ) : (
                <Button onClick={handleNextQuestion} disabled={isSubmitting}>
                  {currentQuestionIndex < questions.length - 1 ? (
                    <>
                      {translate("Next")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    isSubmitting ? translate("Submitting...") : translate("Finish Quiz")
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
          
          {isAnswered && (
            <Alert className={isCorrect ? 'border-success' : 'border-error'}>
              {isCorrect ? (
                <CheckCircle className="h-4 w-4 text-success" />
              ) : (
                <XCircle className="h-4 w-4 text-error" />
              )}
              <AlertTitle>
                {isCorrect ? translate("Correct!") : translate("Incorrect!")}
              </AlertTitle>
              <AlertDescription>
                {isCorrect 
                  ? translate("You selected the right answer.") 
                  : `${translate("The correct answer is")}: ${translate(currentQuestion.answer)}`}
              </AlertDescription>
            </Alert>
          )}
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-6">
          <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate('/quizzes')}>
            <ArrowLeft className="h-4 w-4" />
            {translate("Back to Quizzes")}
          </Button>
          
          <Card className="shadow-md">
            <CardHeader className="text-center pb-2 border-b">
              <CardTitle className="text-2xl font-bold">
                {translate("Quiz Results")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      className="text-muted stroke-current"
                      strokeWidth="10"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                    ></circle>
                    {/* Progress circle */}
                    <circle
                      className="text-primary stroke-current"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={Math.PI * 80}
                      strokeDashoffset={Math.PI * 80 * (1 - score.percentage / 100)}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      transform="rotate(-90 50 50)"
                    ></circle>
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{score.percentage}%</span>
                    <span className="text-sm text-muted-foreground">
                      {score.correct}/{score.total}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4 w-full">
                  <Alert className={score.percentage >= 70 ? 'border-success' : 'border-warning'}>
                    {score.percentage >= 70 ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    )}
                    <AlertTitle>
                      {score.percentage >= 70 
                        ? translate("Congratulations!") 
                        : translate("Not Bad!")}
                    </AlertTitle>
                    <AlertDescription>
                      {score.percentage >= 70 
                        ? translate("You have good knowledge in this area.") 
                        : translate("Keep learning to improve your score.")}
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3 pt-6">
              <Button 
                className="w-full"
                onClick={() => {
                  setCurrentQuestionIndex(0);
                  setSelectedAnswer(null);
                  setAnswers(new Array(questions.length).fill(null));
                  setIsAnswered(false);
                  setIsQuizFinished(false);
                  setTimeLeft(questions.length * 120);
                  setQuizStartTime(Date.now());
                }}
              >
                {translate("Attempt Again")}
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate('/quizzes')}
              >
                {translate("Try Different Quiz")}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
