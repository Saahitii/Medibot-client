import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import loginImg from '../assets/login.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Login failed');
      } else {
        // Save token and user info in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userId', data.user._id);
        navigate('/');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w- screen px-4 bg-gradient-to-tl from-blue-400 via-white to-purple-400">
      <div className="w-180 h-130  p-8 bg-white rounded-2xl shadow-xl border-2 border-indigo-400">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-8">
          Login
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-4">
            {error}
          </p>
        )}
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'row',gap:40}}>
        <div style={{marginRight:20}}>
        <img
          src={loginImg}
          alt="Robot Doctor"
          className="w-60 h-90 m-0 rounded-2xl"
        />
        </div>
        
      <div> 
        <form onSubmit={handleLogin} className="space-y-4">
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="example@mail.com"
              className="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300  text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-600 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
      </div>
      </div>
    </div>
  );
}
