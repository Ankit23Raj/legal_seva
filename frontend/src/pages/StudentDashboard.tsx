import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, BookOpen, Scale } from "lucide-react";

type DashboardUser = {
  name: string;
  role?: string;
};

export default function StudentDashboard({ user }: { user: DashboardUser }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8 px-4 md:px-0">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Welcome, {user.name}! <span className="text-blue-600">(Law Student)</span>
          </h1>
          <p className="text-lg text-gray-600">
            Help clients by reviewing and responding to legal issues.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1: View Client Issues */}
          <Card className="border-0 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-white rounded-2xl overflow-hidden group">
            <CardHeader className="space-y-4 pb-6">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Scale className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl text-gray-900">View Client Issues</CardTitle>
                <CardDescription className="text-base text-gray-600 mt-2">
                  Browse issues posted by clients
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] active:scale-95"
                onClick={() => navigate("/reply-client")}
              >
                View Issues
              </Button>
            </CardContent>
          </Card>

          {/* Card 2: Respond to Clients */}
          <Card className="border-0 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-white rounded-2xl overflow-hidden group">
            <CardHeader className="space-y-4 pb-6">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <MessageSquare className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-2xl text-gray-900">Respond to Clients</CardTitle>
                <CardDescription className="text-base text-gray-600 mt-2">
                  Chat with clients and provide guidance
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] active:scale-95"
                onClick={() => navigate("/messages")}
              >
                Open Messages
              </Button>
            </CardContent>
          </Card>

          {/* Card 3: Study Legal Modules */}
          <Card className="border-0 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-white rounded-2xl overflow-hidden group">
            <CardHeader className="space-y-4 pb-6">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-2xl text-gray-900">Study Legal Modules</CardTitle>
                <CardDescription className="text-base text-gray-600 mt-2">
                  Improve your legal knowledge
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
