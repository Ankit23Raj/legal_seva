import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

type DashboardUser = {
  name: string;
  role?: string;
};

export default function StudentDashboard({ user }: { user: DashboardUser }) {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">
        Welcome, {user.name} (Law Student)
      </h1>
      <p className="text-muted-foreground mt-2">
        Help clients by reviewing and responding to legal issues.
      </p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold">View Client Issues</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Browse issues posted by clients
          </p>
          <div className="mt-4">
            <Button className="w-full" onClick={() => navigate("/reply-client")}>
              View Issues
            </Button>
          </div>
        </div>

        <div className="border rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold">Respond to Clients</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Chat with clients and provide guidance
          </p>
          <div className="mt-4">
            <Button className="w-full" onClick={() => navigate("/messages")}>
              Open Messages
            </Button>
          </div>
        </div>

        <div className="border rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold">Study Legal Modules</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Improve your legal knowledge
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
