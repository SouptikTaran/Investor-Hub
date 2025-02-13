import React, { useEffect, useState } from 'react';
const API_URL = import.meta.env.VITE_API_URL; // ✅ Get from Vite env
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import PrivateRoute from './components/PrivateRoute';
import Loader from './components/Loader';

const App = () => {
  console.log(import.meta.env.VITE_API_URL)

  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Prevents immediate redirect on refresh

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (token) {
      fetchUserDetails(token);
    } else {
      setLoading(false); // No token, stop loading
    }
  }, [token]);

  const fetchUserDetails = async (jwtToken: string) => {
    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      setUser({ name: data.user.name, email: data.user.email });
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem('token'); // Remove invalid token
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleSignIn = (jwtToken: string) => {
    console.log("token = ", jwtToken);
    localStorage.setItem('token', jwtToken);
    setToken(jwtToken);
    setLoading(true); // Set loading to true until user is fetched
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  if (loading) return <Loader/>; // Prevent redirect until user state is determined

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={token ? <Navigate to="/dashboard" replace /> : <AuthPage onSignIn={handleSignIn} />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute token={token} user={user}>
                <DashboardPage user={user} onSignOut={handleSignOut} />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
