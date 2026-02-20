
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LANGUAGES from '@/lib/constants/languages';
import { apiFetch } from '@/lib/api';

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }).max(100),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  preferredLanguage: z.string().min(1, { message: "Please select your preferred language" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ShareIssue() {
  const { translate, language } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      preferredLanguage: language,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      
      let documentUrls: string[] = [];
      
      // Upload documents first if any
      if (files.length > 0) {
        for (const file of files) {
          const formData = new FormData();
          formData.append('document', file);

          const uploadData = await apiFetch('/upload/issue-document', {
            method: 'POST',
            body: formData,
          });

          if (uploadData?.file?.url) {
            documentUrls.push(uploadData.file.url);
          }
        }
      }
      
      // Submit issue with document URLs
      await apiFetch("/issues", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          documents: documentUrls
        }),
      });
      
      toast({
        title: translate("Issue Shared Successfully"),
        description: translate("Your legal issue has been posted. Law students will review it soon."),
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: "destructive",
        title: translate("Submission Failed"),
        description: error instanceof Error ? error.message : translate("There was a problem sharing your issue. Please try again."),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {translate("Share Your Legal Issue")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {translate("Describe your legal problem to get help from law students.")}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{translate("Issue Details")}</CardTitle>
            <CardDescription>
              {translate("Please provide as much detail as possible to get the best advice.")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translate("Title")}</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder={translate("Brief summary of your legal issue")} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translate("Category")}</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={translate("Select a legal category")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="consumer">{translate("Consumer Rights")}</SelectItem>
                          <SelectItem value="property">{translate("Property Law")}</SelectItem>
                          <SelectItem value="family">{translate("Family Law")}</SelectItem>
                          <SelectItem value="criminal">{translate("Criminal Law")}</SelectItem>
                          <SelectItem value="cyber">{translate("Cyber Law")}</SelectItem>
                          <SelectItem value="constitutional">{translate("Constitutional Law")}</SelectItem>
                          <SelectItem value="other">{translate("Other")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="preferredLanguage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translate("Preferred Language for Responses")}</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={translate("Select your preferred language")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60">
                          {LANGUAGES.map(lang => (
                            <SelectItem key={lang.code} value={lang.code}>
                              {lang.name} ({lang.nativeName})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translate("Description")}</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder={translate("Describe your legal issue in detail...")} 
                          className="min-h-32 resize-y"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-2">
                  <FormLabel>{translate("Supporting Documents (Optional)")}</FormLabel>
                  
                  <div className="flex flex-col gap-3">
                    <div className="border-2 border-dashed rounded-md p-6 text-center">
                      <Input
                        type="file"
                        multiple
                        className="hidden"
                        id="file-upload"
                        onChange={handleFileChange}
                        disabled={isLoading}
                      />
                      <label
                        htmlFor="file-upload"
                        className="flex flex-col items-center gap-2 cursor-pointer"
                      >
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm font-medium">
                          {translate("Click to upload files")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {translate("PDF, JPG, PNG up to 10MB")}
                        </p>
                      </label>
                    </div>
                    
                    {files.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">{translate("Uploaded Files")}</p>
                        <ul className="text-sm space-y-1">
                          {files.map((file, i) => (
                            <li key={i} className="flex items-center justify-between p-2 border rounded">
                              <span className="truncate max-w-[200px]">{file.name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(i)}
                                disabled={isLoading}
                              >
                                &times;
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                
                <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  <Send className="h-4 w-4" />
                  {translate("Submit Your Issue")}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
