import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'

// Clear any stale cached data from previous localhost sessions 
// This ensures that when the app is opened for the first time, it doesn't use old data.
if (!localStorage.getItem('aki_cache_cleared_v2')) {
  localStorage.clear();
  localStorage.setItem('aki_cache_cleared_v2', 'true');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
