import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/shared/api/supabase";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { CourseCatalogPage } from "@/pages/CourseCatalogPage";
import { TaskPage } from "@/pages/TaskPage";
import { ResultPage } from "@/pages/ResultPage";

function AuthGuard() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAuthenticated(!!data.session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthGuard />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "courses", element: <CourseCatalogPage /> },
      { path: "task/:taskId", element: <TaskPage /> },
      { path: "result", element: <ResultPage /> },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
]);

export function AppRouterProvider() {
  return <RouterProvider router={router} />;
}
