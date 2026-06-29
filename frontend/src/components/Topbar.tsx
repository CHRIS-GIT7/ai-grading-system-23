import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-16 flex items-center justify-between px-6 bg-white/80 backdrop-blur-sm border-b border-slate-200 rounded-lg mb-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-primary m-0">AI-Assisted Grading</h2>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">{user.name?.charAt(0) || 'U'}</span>
              </div>
              <span className="text-sm font-medium text-slate-700">{user.name}</span>
            </div>
            <button 
              onClick={handleLogout} 
              className="btn btn-secondary text-sm px-3 py-1.5"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary text-sm px-3 py-1.5">Login</Link>
        )}
      </div>
    </div>
  );
}
