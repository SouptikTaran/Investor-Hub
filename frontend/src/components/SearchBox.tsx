import React, { useRef, useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const API_URL = import.meta.env.VITE_API_URL; 

export const SearchBox: React.FC = () => {
  const [query, setQuery] = useState('');
  const [msg, setMsg] = useState('')
  const [results, setResults] = useState<any[]>([]); // Store multiple results
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()
  // const API_URL = ; // Replace with your back`end URL
  const toastId = useRef(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      // Get token from local storage
      const token = localStorage.getItem('token'); // Get token from localStorage
      if (!token) {
        console.error('No token found');
        setResults([]); // Optionally handle the error here
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
      // console.log("response : ", response)
      toast.warn(response.data.msg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      if (response.data.msg === "No credits Left") {
        setMsg(response.data.msg);
        toast.warn(response.data.msg, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      
      // Check if the response contains users
      if (response.data && Array.isArray(response.data.users)) {
        setResults(response.data.users); // Store the array of users
      } else {
        setResults([]);
      }
      setMsg(response.data.msg);
    } catch (error) {
      console.error('Error searching:', error);
      if (error?.response?.data?.error === "Invalid or expired token.") {
        toast.warn("Invalid or expired token", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,

        });
        localStorage.removeItem('token');
        navigate('/auth')
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
          className="w-full px-6 py-4 pl-14 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none text-lg transition-all shadow-sm"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
      </div>

      <button
        onClick={handleSearch}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-blue-700 text-lg font-medium shadow-sm flex items-center justify-center gap-3"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Finding your match...</span>
          </>
        ) : (
          <>
            <Search className="w-6 h-6" />
            <span>Find Investors</span>
          </>
        )}
      </button>

      {/* Display results as cards */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {results.map((investor, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
              <div className="flex items-center mb-4">
                {/* Display profile photo */}
                <img
                  src={investor.profilePhoto || `https://avatar.iran.liara.run/username?username=${investor.name}`}
                  alt={investor.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">{investor.name}</h4>
                  <p className="text-gray-600">Category: {investor.category.charAt(0).toUpperCase() + investor.category.slice(1).toLowerCase()}</p>

                  <p className="text-gray-600">Type: {investor.type}</p>
                </div>
              </div>
              <div className="mt-4 text-right">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* If no results */}
      {results.length === 0 && query && !isLoading && (
        <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-gray-100">
          <p className="text-lg text-gray-700">{msg ?? "No matching investors found"}</p>
        </div>
      )}
    </div>
  );
};
