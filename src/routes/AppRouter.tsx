import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProtectedRoute from "../components/ProtectedRoute";
import LibraryApp from "../LibraryApp";
import PublicHomePage from "../pages/PublicHomePage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Aplikasi utama: warga & pengelola (portal desa dikunci per role di dalam) */}
        <Route path="/" element={<PublicHomePage />} />
        <Route path="/app" element={<Navigate to="/login" replace />} />
        <Route
          path="/app/:username/*"
          element={
            <ProtectedRoute>
              <LibraryApp />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
