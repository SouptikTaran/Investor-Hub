import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;

const GoogleAuth = () => {
  const navigate = useNavigate()
  const handleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    try {
      const response = await axios.post(`${API_URL}/google`, { token });
      console.log("Login Successful:", response.data);
      localStorage.setItem("token", response.data.token);
      // setTimeout(() => navigate("/dashboard"), 500);
      window.location.href = "/dashboard";

    } catch (error) {
      console.error("Login failed:", error?.response?.data);
    }
  };

  return <GoogleLogin onSuccess={handleSuccess} onError={() => console.log("Google Auth Failed")} />;
};

export default GoogleAuth;
