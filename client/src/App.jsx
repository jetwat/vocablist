// App.jsx
//
// จุดเดียวที่กำหนด routes ทั้งหมด
// PrivateRoute = wrapper ที่ redirect ไป /login ถ้าไม่ได้ login

import { Routes, Route, Navigate } from "react-router-dom";
import useAuth from "./hooks/useAuth.js";
import Navbar from "./components/Navbar.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ExtractPage from "./pages/ExtractPage.jsx";
import SavedPage from "./pages/SavedPage.jsx";

// ถ้าไม่ได้ login → redirect ไป /login
// loading = true ยังไม่รู้สถานะ → รอก่อน ไม่ redirect
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <ExtractPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/saved"
            element={
              <PrivateRoute>
                <SavedPage />
              </PrivateRoute>
            }
          />
          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
