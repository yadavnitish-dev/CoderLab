import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import HomePage from "./page/HomePage";
import LoginPage from "./page/LoginPage";
import SignUpPage from "./page/SignupPage";
import { useAuthStore } from "./store/useAuthStore";
import { Loader2 } from "lucide-react";
import Layout from "./layout/Layout";
import AdminRoute from "./components/AdminRoute";
import AddProblem from "./page/AddProblem";
import ProblemPage from "./page/ProblemPage";
import RoadmapPage from "./page/RoadmapPage";
import SettingsPage from "./page/SettingsPage";

import DashboardPage from "./page/DashboardPage";
import PlaylistPage from "./page/PlaylistPage";
import PlaylistsPage from "./page/PlaylistsPage";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0a]">
        <Loader2 className="size-8 animate-spin text-zinc-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a]">
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={authUser ? <Navigate to={"/roadmap"} /> : <HomePage />}
          />
          <Route
            path="/roadmap"
            element={authUser ? <RoadmapPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/dashboard"
            element={authUser ? <DashboardPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/settings"
            element={authUser ? <SettingsPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/playlists"
            element={authUser ? <PlaylistsPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/playlist/:id"
            element={authUser ? <PlaylistPage /> : <Navigate to="/login" />}
          />
        </Route>

        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
        />

        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />}
        />

        <Route
          path="/problem/:id"
          element={authUser ? <ProblemPage /> : <Navigate to={"/login"} />}
        />

        <Route element={<Layout />}>
          <Route element={<AdminRoute />}>
            <Route
              path="/add-problem"
              element={authUser ? <AddProblem /> : <Navigate to="/" />}
            />
            <Route
              path="/problem/:id/edit"
              element={authUser ? <AddProblem /> : <Navigate to="/" />}
            />
          </Route>
        </Route>
      </Routes>
    </div>
  );
};

export default App;
