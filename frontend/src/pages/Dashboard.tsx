import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import ClientDashboard from './ClientDashboard';
import StudentDashboard from './StudentDashboard';

export default function Dashboard() {
  let user: any = null;
  try {
    const raw = localStorage.getItem("user");
    user = raw ? JSON.parse(raw) : null;
  } catch {
    // If storage is corrupted, clear it to avoid a redirect loop.
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    user = null;
  }

  if (!user) {
    window.location.href = "/sign-in";
    return null;
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {user.role === "student" ? (
          <StudentDashboard user={user} />
        ) : (
          <ClientDashboard user={user} />
        )}
      </div>
    </DashboardLayout>
  );
}
