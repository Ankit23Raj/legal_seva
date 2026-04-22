
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, User, Mail, Lock, Eye, EyeOff, Scale, GraduationCap, HelpCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { LanguageSelector } from '@/components/LanguageSelector';

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name cannot exceed 50 characters" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name should only contain letters and spaces",
    }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, {
      message: "Password must include at least one letter and one number",
    }),
  confirmPassword: z.string(),
  role: z.enum(['client', 'student'], { required_error: "Please select a role" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

export default function SignUp() {
  const { register } = useAuth();
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "client",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      console.log("Attempting registration with:", { email: values.email, name: values.name, role: values.role });
      await register(values.email, values.password, values.name, values.role);
      console.log("Registration successful!");
      toast({
        title: translate("Welcome!"),
        description: translate("You've successfully created an account."),
      });
      
      // Redirect based on role
      if (values.role === 'student') {
        navigate('/reply-client'); // Law student page
      } else {
        navigate('/share-issue'); // Client page to share issues
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: translate("Sign up failed"),
        description: error instanceof Error ? error.message : translate("There was a problem with your registration."),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative">
      {/* Language Selector */}
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>

      {/* Main Container - Split Screen Card */}
      <div className="w-full max-w-4xl">
        <Card className="flex flex-col md:flex-row overflow-hidden">
          {/* LEFT SIDE - Illustration & Branding */}
          <div className="hidden md:flex md:w-2/5 bg-gradient-to-br from-blue-50 to-blue-100 p-8 flex-col justify-between">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-6">
                <Scale className="text-blue-600" size={32} />
                <h2 className="text-2xl font-bold text-gray-900">{translate("Legal Seva")}</h2>
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-6 flex-1 flex flex-col justify-center">
              <h3 className="text-3xl font-bold text-gray-900 leading-tight">
                {translate("Bridge the gap to justice.")}
              </h3>
              <p className="text-gray-700 text-base leading-relaxed">
                {translate("Bridge the gap to justice. Legal seva legal insured to supporting and lower nesticwated connection.")}
              </p>

              {/* Illustration - SVG Placeholder */}
              <div className="mt-8 flex justify-center">
                <div className="w-64 h-48 bg-white/40 rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <HelpCircle className="text-blue-600 mx-auto" size={48} />
                    <p className="text-sm text-gray-600">{translate("Legal Guidance")}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Text */}
            <div className="text-sm text-gray-600">
              <p>{translate("Connect with verified law students and get expert guidance on your legal concerns.")}</p>
            </div>
          </div>

          {/* RIGHT SIDE - Form */}
          <div className="w-full md:w-3/5 p-8 md:p-12">
            <CardHeader className="px-0 pt-0 mb-6">
              <CardTitle className="text-2xl font-bold text-center text-gray-900">
                {translate("Legal Seva")}
              </CardTitle>
              <CardDescription className="text-center text-base">
                {translate("Create your account")}
              </CardDescription>
            </CardHeader>

            <CardContent className="px-0">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  {/* Full Name Field */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900">{translate("Full Name")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input 
                              {...field} 
                              placeholder={translate("Enter your full name")} 
                              disabled={isLoading}
                              className="pl-10 h-11 border-gray-200 rounded-lg focus:border-blue-500"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900">{translate("Email")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input 
                              {...field} 
                              type="email" 
                              placeholder="email@example.com" 
                              disabled={isLoading}
                              className="pl-10 h-11 border-gray-200 rounded-lg focus:border-blue-500"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900">{translate("Password")}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                              <Input 
                                {...field} 
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••" 
                                disabled={isLoading}
                                className="pl-10 pr-10 h-11 border-gray-200 rounded-lg focus:border-blue-500"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                              >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900">{translate("Confirm Password")}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                              <Input 
                                {...field} 
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••" 
                                disabled={isLoading}
                                className="pl-10 pr-10 h-11 border-gray-200 rounded-lg focus:border-blue-500"
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                              >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Role Selection - Modern Cards */}
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900">{translate("I am a")}</FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-2 gap-3">
                            {/* Client Card */}
                            <button
                              type="button"
                              onClick={() => field.onChange('client')}
                              className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                                field.value === 'client'
                                  ? 'border-blue-600 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300 bg-white'
                              }`}
                            >
                              <HelpCircle 
                                size={28} 
                                className={field.value === 'client' ? 'text-blue-600' : 'text-gray-400'}
                              />
                              <span className={`text-sm font-medium ${field.value === 'client' ? 'text-blue-600' : 'text-gray-700'}`}>
                                {translate("Client")}
                              </span>
                            </button>

                            {/* Law Student Card */}
                            <button
                              type="button"
                              onClick={() => field.onChange('student')}
                              className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                                field.value === 'student'
                                  ? 'border-blue-600 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300 bg-white'
                              }`}
                            >
                              <GraduationCap 
                                size={28} 
                                className={field.value === 'student' ? 'text-blue-600' : 'text-gray-400'}
                              />
                              <span className={`text-sm font-medium ${field.value === 'student' ? 'text-blue-600' : 'text-gray-700'}`}>
                                {translate("Law Student")}
                              </span>
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors mt-6"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {translate("Sign Up")}
                  </Button>
                </form>
              </Form>
            </CardContent>

            <CardFooter className="px-0 pt-6 justify-center border-t border-gray-200">
              <div className="text-sm text-center text-gray-600 mt-4">
                {translate("Already have an account?")}{" "}
                <Link to="/sign-in" className="text-blue-600 font-semibold hover:text-blue-700">
                  {translate("Sign In")}
                </Link>
              </div>
            </CardFooter>
          </div>
        </Card>
      </div>
    </div>
  );
}
