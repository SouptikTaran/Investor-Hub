import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import axios from "axios";
import GoogleAuth from '../components/GoogleAuth';

const API_URL = import.meta.env.VITE_API_URL;

const AuthPage = ({ onSignIn }: { onSignIn: (jwtToken: string) => void }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [profileName, setProfileName] = useState('');
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('USER');
    const [category, setCategory] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [categories, setCategories] = useState<string[]>([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${API_URL}/categories`);
                setCategories(response.data.map((category: { category: string }) => category));
            } catch (error) {
                setError('Failed to load categories');
            }
        };

        fetchCategories();
    }, []);

    const handleSignIn = async () => {
        setError('');
        if (!email || !password) {
            setError('Email and password are required');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                onSignIn(data.token);
                navigate('/dashboard');
            } else {
                setError(data.error || 'Sign-in failed');
            }
        } catch (err) {
            setError('Network error');
        }
    };

    const handleSignUp = async () => {
        setError('');
        if (!email || !password || (role !== 'USER' && (!profileName || !category))) {
            setError('All fields are required');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/signup`, {
                email,
                password,
                role,
                profileName: role !== "USER" ? profileName : "USER",
                category: role !== "USER" ? (category === 'new' ? newCategory : category) : undefined,
            });

            const data = response.data;
            if (response.data.error) {
                setError(data.error || 'Sign-up failed');
            } else if (response.status === 200 && data.token !== "") {
                onSignIn(data.token);
                navigate('/dashboard');
            } else {
                setError(data.error || 'Sign-up failed');
            }
        } catch (err) {
            setError('Network error');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6">{isSignUp ? 'Create Account' : 'Sign In'}</h1>

                {error && <p className="text-red-600 text-center bg-red-100 p-2 rounded-md mb-4">{error}</p>}

                <div className="space-y-4">
                    {isSignUp && role !== 'USER' && (
                        <input
                            type="text"
                            placeholder="Profile Name"
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                        />
                    )}

                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <div className="relative w-full">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="w-full p-3 border border-gray-300 rounded-lg pr-10"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                        </button>
                    </div>

                    {isSignUp && role !== 'USER' && (
                        <div className="space-y-2 text-black">
                            <label className="text-sm font-semibold">Category</label>
                            {categories.length > 0 ? (
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg text-black"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat, index) => (
                                        <option key={`${cat}-${index}`} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                    <option value="new">New Category</option>
                                </select>
                            ) : (
                                <p>Loading categories...</p>
                            )}

                            {category === 'new' && (
                                <input
                                    type="text"
                                    placeholder="Enter new category"
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                />
                            )}
                        </div>
                    )}

                    {isSignUp && (
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">User Role</label>
                            <div className="flex space-x-6">
                                {['USER', 'MENTOR', 'INVESTOR'].map((type) => (
                                    <div key={type} className="flex items-center">
                                        <input
                                            type="radio"
                                            id={type}
                                            name="role"
                                            value={type}
                                            checked={role === type}
                                            onChange={(e) => setRole(e.target.value)}
                                            className="mr-2"
                                        />
                                        <label htmlFor={type} className="text-sm">{type}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={isSignUp ? handleSignUp : handleSignIn}
                        className="w-full bg-blue-600 text-white font-semibold p-3 rounded-lg"
                    >
                        {isSignUp ? 'Sign Up' : 'Sign In'}
                    </button>
                </div>

                <div className="relative flex items-center justify-center my-4">
                    <span className="absolute bg-white px-2 text-gray-500 text-sm">or</span>
                    <div className="w-full border-t border-gray-300"></div>
                </div>

                <GoogleAuth />

                <p className="text-center mt-4">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button onClick={() => setIsSignUp(!isSignUp)} className="text-blue-600 font-semibold">
                        {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
