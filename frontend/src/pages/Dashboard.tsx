import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import ClientDashboard from './ClientDashboard';
import StudentDashboard from './StudentDashboard';

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") as string);

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
