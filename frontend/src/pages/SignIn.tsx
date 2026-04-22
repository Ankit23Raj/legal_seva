
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, Lock, Eye, EyeOff, Scale } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { LanguageSelector } from '@/components/LanguageSelector';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function SignIn() {
  const { login, user } = useAuth();
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      await login(values.email, values.password);
      
      // Get user role from localStorage (set by login)
      const savedUser = localStorage.getItem("user");
      const userData = savedUser ? JSON.parse(savedUser) : null;
      
      toast({
        title: translate("Welcome back!"),
        description: translate("You've successfully signed in."),
      });
      
      // Redirect based on role
      if (userData?.role === 'student') {
        navigate('/reply-client'); // Law student page
      } else {
        navigate('/share-issue'); // Client page to share issues
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : translate("Please check your credentials and try again.");
      toast({
        variant: "destructive",
        title: translate("Sign in failed"),
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white relative overflow-hidden">
      {/* Language Selector */}
      <div className="absolute top-6 right-6">
        <LanguageSelector />
      </div>

      {/* Container */}
      <div className="w-full max-w-5xl flex gap-8 lg:gap-16">
        {/* LEFT SIDE - Branding Section */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-start space-y-8">
          {/* Icon */}
          <div className="text-blue-600">
            <Scale size={56} strokeWidth={1.5} />
          </div>

          {/* Heading */}
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            {translate("Legal Seva - Your gateway to legal excellence.")}
          </h1>

          {/* Subtext */}
          <p className="text-lg text-gray-600 font-light leading-relaxed">
            {translate("Securely connect to your professional network.")}
          </p>

          {/* Decorative Elements */}
          <div className="mt-12 space-y-4 text-sm text-gray-500">
            <div className="flex items-center gap-3">
              <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
              <span>{translate("Trusted by legal professionals")}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
              <span>{translate("Secure & confidential connections")}</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Login Card */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
          <Card className="w-full max-w-md border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="space-y-2 pt-12 pb-8">
              <CardTitle className="text-3xl font-bold text-center text-gray-900">
                {translate("Legal Seva")}
              </CardTitle>
              <CardDescription className="text-center text-base text-gray-600">
                {translate("Sign In")}
              </CardDescription>
            </CardHeader>

            <CardContent className="pb-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900 font-medium">{translate("Email")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <Input 
                              {...field} 
                              type="email" 
                              placeholder="name@example.com" 
                              disabled={isLoading}
                              className="pl-10 h-12 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 text-base"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  {/* Password Field */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900 font-medium">{translate("Password")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <Input 
                              {...field} 
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••" 
                              disabled={isLoading}
                              className="pl-10 pr-10 h-12 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 text-base"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  {/* Forgot Password Link */}
                  <div className="flex justify-end">
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      {translate("Forgot Password?")}
                    </Link>
                  </div>

                  {/* Sign In Button */}
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-blue-700 hover:bg-blue-800 text-white font-bold text-lg rounded-full transition-colors mt-8"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-3 h-5 w-5 animate-spin" />}
                    {translate("SIGN IN")}
                  </Button>
                </form>
              </Form>
            </CardContent>

            <CardFooter className="flex flex-col items-center space-y-4 pb-8 border-t border-gray-100 pt-8">
              <div className="text-sm text-center text-gray-700">
                {translate("Not registered yet?")}{" "}
                <Link to="/sign-up" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
                  {translate("Create your account")}
                </Link>
              </div>
              <p className="text-xs text-gray-500 text-center">
                {translate("Built for legal professionals and clients")}
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
