import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, Role } from '../context/AuthContext';
import api from '../api/client';

export default function Login() {
  const [role, setRole] = useState<Role>('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { role, identifier, password });
      const data = response.data;

      login(data.user, data.role);
      navigate(data.role === 'admin' ? '/dashboard' : '/exams');
    } catch (err: any) {
      console.error('Login error', err, err?.toJSON?.());
      setError(err.response?.data?.error || err.message || JSON.stringify(err?.toJSON?.()) || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="card mb-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">Portal Login</h2>
            <p className="text-slate-600 text-sm">Lead City University AI Grading System</p>
          </div>
          
          <div className="flex gap-3 mb-6">
            <button
              type="button"
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${role === 'student' ? 'btn btn-primary' : 'btn btn-outline'}`}
              onClick={() => setRole('student')}
            >
              Student
            </button>
            <button
              type="button"
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${role === 'admin' ? 'btn btn-primary' : 'btn btn-outline'}`}
              onClick={() => setRole('admin')}
            >
              Admin
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {role === 'student' ? 'Matric Number' : 'Email Address'}
              </label>
              <input
                type={role === 'student' ? 'text' : 'email'}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="input"
                placeholder={role === 'student' ? 'LCU/19/0001' : 'admin@lcu.edu.ng'}
                required
              />
              <p className="mt-2 text-xs text-slate-500">
                {role === 'student' ? 'Enter your matric number' : 'Enter your admin email'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required 
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary w-full py-3 text-base"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : 'Login'}
            </button>
          </form>
        </div>
        <div className="text-center text-xs text-slate-500">
          API base: {(import.meta as any).env?.VITE_API_BASE || '/api'}
        </div>
      </div>
    </div>
  );
}
