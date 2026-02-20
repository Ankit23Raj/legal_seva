import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

type DashboardUser = {
  name: string;
  role?: string;
};

export default function ClientDashboard({ user }: { user: DashboardUser }) {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Welcome, {user.name}!</h1>
      <p className="text-muted-foreground mt-2">
        Explore legal resources and get help from law students.
      </p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold">Share Your Legal Issue</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Post your legal problem and get advice from students.
          </p>
          <div className="mt-4">
            <Button className="w-full" onClick={() => navigate("/share-issue")}>
              Share Issue
            </Button>
          </div>
        </div>

        <div className="border rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold">Test Your Knowledge</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Fun quizzes about different legal topics.
          </p>
          <div className="mt-4">
            <Button className="w-full" onClick={() => navigate("/quizzes")}>
              Take Quizzes
            </Button>
          </div>
        </div>

        <div className="border rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold">Legal Modules</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Informative resources about various legal topics.
          </p>
          <div className="mt-4">
            <Button className="w-full" onClick={() => navigate("/legal-modules")}>
              Explore Modules
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
