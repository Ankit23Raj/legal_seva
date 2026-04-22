import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Lightbulb, Briefcase } from "lucide-react";

type DashboardUser = {
  name: string;
  role?: string;
};

export default function ClientDashboard({ user }: { user: DashboardUser }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8 px-4 md:px-0">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Welcome, {user.name}!
          </h1>
          <p className="text-lg text-gray-600">
            Explore legal resources and get help from law students.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1: Share Your Legal Issue */}
          <Card className="border-0 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-white rounded-2xl overflow-hidden group">
            <CardHeader className="space-y-4 pb-6">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Briefcase className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl text-gray-900">Share Your Legal Issue</CardTitle>
                <CardDescription className="text-base text-gray-600 mt-2">
                  Post your legal problem and get advice from students.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] active:scale-95"
                onClick={() => navigate("/share-issue")}
              >
                Share Issue
              </Button>
            </CardContent>
          </Card>

          {/* Card 2: Test Your Knowledge */}
          <Card className="border-0 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-white rounded-2xl overflow-hidden group">
            <CardHeader className="space-y-4 pb-6">
              <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                <Lightbulb className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-2xl text-gray-900">Test Your Knowledge</CardTitle>
                <CardDescription className="text-base text-gray-600 mt-2">
                  Fun quizzes about different legal topics.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full h-12 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] active:scale-95"
                onClick={() => navigate("/quizzes")}
              >
                Take Quizzes
              </Button>
            </CardContent>
          </Card>

          {/* Card 3: Legal Modules */}
          <Card className="border-0 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-white rounded-2xl overflow-hidden group">
            <CardHeader className="space-y-4 pb-6">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-2xl text-gray-900">Legal Modules</CardTitle>
                <CardDescription className="text-base text-gray-600 mt-2">
                  Informative resources about various legal topics.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] active:scale-95"
                onClick={() => navigate("/legal-modules")}
              >
                Explore Modules
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
