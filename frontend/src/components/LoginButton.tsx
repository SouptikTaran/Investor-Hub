import React from 'react';
import { LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LoginButtonProps {
  onSignIn: (email: string) => void;
}

export const LoginButton: React.FC<LoginButtonProps> = ({ onSignIn }) => {
  const navigate = useNavigate()
    const handleLogin = () => {
      navigate("/auth");
    };

  return (
    <button
      onClick={handleLogin}
      className="group relative inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 text-lg font-medium overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <LogIn className="w-6 h-6 relative z-10" />
      <span className="relative z-10">Join Us</span>
    </button>
  );
};