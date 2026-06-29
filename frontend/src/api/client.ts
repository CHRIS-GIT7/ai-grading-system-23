import axios from 'axios';

// This picks up the environment variable you set in Netlify
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export default axios.create({ 
  baseURL: API_BASE, 
  headers: { 'Content-Type': 'application/json' }
});