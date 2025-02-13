import React, { useRef, useState } from 'react';
import { Search } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from './Loader';

const API_URL = import.meta.env.VITE_API_URL; 

export const SearchBox: React.FC = () => {
  const [query, setQuery] = useState('');
  const [msg, setMsg] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toastId = useRef(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        setResults([]);
        return;
      }

      const response = await axios.post(
        `${API_URL}/investors`,
        { query },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.warn(response.data.msg, { position: "top-right", autoClose: 5000 });
      
      if (response.data.msg === "No credits Left") {
        setMsg(response.data.msg);
        toast.warn(response.data.msg, { position: "top-right", autoClose: 5000 });
      }

      setResults(response.data.users || []);
      setMsg(response.data.msg);
    } catch (error) {
      console.error('Error searching:', error);
      if (error?.response?.data?.error === "Invalid or expired token.") {
        toast.warn("Invalid or expired token", { position: "top-right", autoClose: 5000 });
        localStorage.removeItem('token');
        navigate('/auth');
      }
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe your startup and investment needs..."
          className="w-full px-6 py-4 pl-14 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-lg transition-all shadow-sm"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 transition-colors" />
      </div>

      <button
        onClick={handleSearch}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl text-lg font-medium shadow-sm flex items-center justify-center gap-3"
      >
        {isLoading ? (
          <>
            <Loader /> {/* Custom Loader Component */}
            <span>Finding your match...</span>
          </>
        ) : (
          <>
            <Search className="w-6 h-6" />
            <span>Find Investors</span>
          </>
        )}
      </button>

      {isLoading && <Loader />} {/* Show Loader while fetching */}

      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {results.map((investor, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
              <div className="flex items-center mb-4">
                <img
                  src={investor.profilePhoto || `https://avatar.iran.liara.run/username?username=${investor.name}`}
                  alt={investor.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">{investor.name}</h4>
                  <p className="text-gray-600">Category: {investor.category}</p>
                  <p className="text-gray-600">Type: {investor.type}</p>
                </div>
              </div>
              <div className="mt-4 text-right">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {results.length === 0 && query && !isLoading && (
        <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-gray-100">
          <p className="text-lg text-gray-700">{msg ?? "No matching investors found"}</p>
        </div>
      )}
    </div>
  );
};
