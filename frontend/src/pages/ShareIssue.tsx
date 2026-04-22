
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, Upload, Loader2, FileText, X } from 'lucide-react';
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
      {/* Background Gradient */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-12 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              {translate("Share Your Legal Issue")}
            </h1>
            <p className="text-lg text-gray-600">
              {translate("Describe your legal problem to get help from law students.")}
            </p>
          </div>

          {/* Main Form Card */}
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-b border-blue-200 px-8 py-8">
              <CardTitle className="text-2xl text-gray-900">{translate("Issue Details")}</CardTitle>
              <CardDescription className="text-base text-gray-600 mt-2">
                {translate("Please provide as much detail as possible to get the best advice.")}
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 py-10">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Title Field */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900 font-semibold">{translate("Title")}</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder={translate("Brief summary of your legal issue")} 
                            disabled={isLoading}
                            className="h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Category and Language Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category Field */}
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 font-semibold">{translate("Category")}</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={isLoading}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white">
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

                    {/* Preferred Language Field */}
                    <FormField
                      control={form.control}
                      name="preferredLanguage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 font-semibold">{translate("Preferred Language")}</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={isLoading}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white">
                                <SelectValue placeholder={translate("Select language")} />
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
                  </div>

                  {/* Description Field */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900 font-semibold">{translate("Description")}</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder={translate("Describe your legal issue in detail...")} 
                            className="min-h-40 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-y bg-white"
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Supporting Documents Section */}
                  <div className="space-y-3">
                    <FormLabel className="text-gray-900 font-semibold">{translate("Supporting Documents (Optional)")}</FormLabel>
                    
                    {/* Upload Area */}
                    <div className="flex flex-col gap-4">
                      <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group">
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
                          className="flex flex-col items-center gap-3 cursor-pointer"
                        >
                          <div className="bg-blue-100 rounded-full p-4 group-hover:bg-blue-200 transition-colors">
                            <Upload className="h-7 w-7 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {translate("Click to upload files")}
                            </p>
                            <p className="text-sm text-gray-500 mt-0.5">
                              {translate("PDF, JPG, PNG up to 10MB")}
                            </p>
                          </div>
                        </label>
                      </div>

                      {/* Listed Files */}
                      {files.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <p className="text-sm font-semibold text-gray-900 mb-3">{translate("Uploaded Files")} ({files.length})</p>
                          <ul className="space-y-2">
                            {files.map((file, i) => (
                              <li 
                                key={i} 
                                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                  <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                  <span className="text-xs text-gray-500 flex-shrink-0">
                                    ({(file.size / 1024 / 1024).toFixed(2)}MB)
                                  </span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(i)}
                                  disabled={isLoading}
                                  className="ml-2 hover:bg-red-50 hover:text-red-600"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg gap-2 transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-xl" 
                      disabled={isLoading}
                    >
                      {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
                      <Send className="h-5 w-5" />
                      {translate("Submit Your Issue")}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
