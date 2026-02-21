
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Upload, Eye, Search, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DashboardLayout } from '@/components/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { apiFetch, API_ORIGIN } from '@/lib/api';

// Mock legal issues
const MOCK_ISSUES = [
  {
    id: "1",
    title: "Dispute with landlord over security deposit",
    description: "My landlord is refusing to return my security deposit despite leaving the property in good condition. Need advice on how to proceed.",
    category: "property",
    language: "en",
    createdAt: new Date(2023, 10, 15),
    status: "open",
  },
  {
    id: "2",
    title: "Defective product sold online",
    description: "I purchased a laptop online which arrived with defects. The seller is refusing to replace or refund. What consumer rights do I have?",
    category: "consumer",
    language: "hi",
    createdAt: new Date(2023, 10, 14),
    status: "open",
  },
  {
    id: "3",
    title: "Traffic accident insurance claim denied",
    description: "I was involved in a traffic accident. My insurance company denied my claim saying I violated terms. Need legal guidance.",
    category: "other",
    language: "mr",
    createdAt: new Date(2023, 10, 12),
    status: "open",
  },
  {
    id: "4",
    title: "Harassment at workplace",
    description: "I'm facing harassment at my workplace from my supervisor. HR isn't taking appropriate action. What legal options do I have?",
    category: "other",
    language: "en",
    createdAt: new Date(2023, 10, 10),
    status: "in-progress",
  },
];

export default function ReplyClient() {
  const { translate } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [issues, setIssues] = useState<any[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchIssues();
  }, []);
  
  const fetchIssues = async () => {
    try {
      setIsLoading(true);
      const data = await apiFetch("/issues");
      const normalized = (data?.issues || []).map((issue: any) => ({
        ...issue,
        id: issue.id || issue._id,
      }));
      setIssues(normalized);
      setFilteredIssues(normalized);
    } catch (error) {
      toast({
        variant: "destructive",
        title: translate("Error"),
        description: translate("Failed to fetch issues"),
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredIssues(issues);
    } else {
      const filtered = issues.filter(
        issue => 
          issue.title.toLowerCase().includes(term) || 
          issue.description.toLowerCase().includes(term) ||
          issue.category.toLowerCase().includes(term)
      );
      setFilteredIssues(filtered);
    }
  };
  
  const handleReplyClick = (issueId: string) => {
    // Navigate to chat page (in a real app)
    navigate(`/messages/${issueId}`);
  };
  
  // Get language name from code
  const getLanguageName = (code: string) => {
    const languages: Record<string, string> = {
      en: "English",
      hi: "Hindi",
      mr: "Marathi",
      // Add more as needed
    };
    return languages[code] || code;
  };
  
  const getCategoryLabel = (category: string) => {
    const categories: Record<string, { label: string, color: string }> = {
      property: { label: "Property Law", color: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100" },
      consumer: { label: "Consumer Rights", color: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100" },
      family: { label: "Family Law", color: "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100" },
      criminal: { label: "Criminal Law", color: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100" },
      cyber: { label: "Cyber Law", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100" },
      constitutional: { label: "Constitutional Law", color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100" },
      other: { label: "Other", color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100" },
    };
    return categories[category] || { label: "Other", color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100" };
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {translate("Reply to Clients")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {translate("Provide legal guidance to people seeking advice.")}
          </p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={translate("Search legal issues...")}
            className="pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <Tabs defaultValue="open">
          <TabsList className="mb-4">
            <TabsTrigger value="open">{translate("Open Issues")}</TabsTrigger>
            <TabsTrigger value="my-responses">{translate("My Responses")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="open" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                {translate("Loading issues...")}
              </div>
            ) : filteredIssues.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {issues.length === 0 
                  ? translate("No issues available yet. Check back later!")
                  : translate("No issues match your search")}
              </div>
            ) : (
              filteredIssues.map(issue => (
                <Card key={issue.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-lg">{issue.title}</CardTitle>
                      <Badge variant="outline" className={getCategoryLabel(issue.category).color}>
                        {translate(getCategoryLabel(issue.category).label)}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <span>
                        {translate("Posted")}: {new Date(issue.createdAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>
                        {translate("Language")}: {getLanguageName(issue.preferredLanguage || issue.language || 'en')}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm line-clamp-2">{issue.description}</p>
                  </CardContent>
                  <CardFooter className="flex gap-2 pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Eye className="h-4 w-4" />
                          {translate("View Details")}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{issue.title}</DialogTitle>
                          <DialogDescription>
                            {translate("Posted")}: {new Date(issue.createdAt).toLocaleDateString()} • 
                            {translate("Language")}: {getLanguageName(issue.preferredLanguage || issue.language || 'en')}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <Badge variant="outline" className={getCategoryLabel(issue.category).color}>
                              {translate(getCategoryLabel(issue.category).label)}
                            </Badge>
                          </div>
                          <p className="text-sm">{issue.description}</p>
                          
                          {issue.documents && issue.documents.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-sm font-medium">{translate("Attached Documents")}:</p>
                              <div className="space-y-1">
                                {issue.documents.map((doc: string, idx: number) => (
                                  <a
                                    key={idx}
                                    href={/^https?:\/\//.test(doc) ? doc : `${API_ORIGIN}${doc}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {translate("Document")} {idx + 1}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <DialogFooter>
                          <Button onClick={() => handleReplyClick(issue.id)}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            {translate("Reply to this Issue")}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Button variant="default" size="sm" className="gap-1" onClick={() => handleReplyClick(issue.id)}>
                      <MessageSquare className="h-4 w-4" />
                      {translate("Reply")}
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="my-responses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {translate("Harassment at workplace")}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <span>{translate("Started")}: 2 days ago</span>
                  <span>•</span>
                  <span>{translate("Last reply")}: 6 hours ago</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm line-clamp-2">
                  {translate("You have an ongoing conversation with this client about workplace harassment issues.")}
                </p>
              </CardContent>
              <CardFooter className="flex gap-2 pt-2">
                <Button variant="default" size="sm" className="gap-1">
                  <MessageSquare className="h-4 w-4" />
                  {translate("Continue Chat")}
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Phone className="h-4 w-4" />
                  {translate("Schedule Call")}
                </Button>
              </CardFooter>
            </Card>
            
            <div className="text-center py-4 text-muted-foreground">
              {translate("You haven't responded to any other issues yet.")}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
