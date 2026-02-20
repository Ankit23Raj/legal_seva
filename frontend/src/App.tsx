import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RoleSelection from "./pages/RoleSelection";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import QuizzesList from "./pages/QuizzesList";
import QuizPage from "./pages/QuizPage";
import ShareIssue from "./pages/ShareIssue";
import ReplyClient from "./pages/ReplyClient";
import LegalModules from "./pages/LegalModules";
import Messages from "./pages/Messages";
import { Chatbot } from "./components/Chatbot";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("token") !== null;

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }

  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/role-selection" element={<RoleSelection />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route
                path="/chatbot"
                element={
                  <div className="h-screen">
                    <Chatbot />
                  </div>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quizzes"
                element={
                  <ProtectedRoute>
                    <QuizzesList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quizzes/:categoryId/:levelId"
                element={
                  <ProtectedRoute>
                    <QuizPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/share-issue"
                element={
                  <ProtectedRoute>
                    <ShareIssue />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reply-client"
                element={
                  <ProtectedRoute>
                    <ReplyClient />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/legal-modules"
                element={
                  <ProtectedRoute>
                    <LegalModules />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
