import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = createRoot(document.getElementById('root'));

root.render(
  <GoogleOAuthProvider clientId="697609246658-r9q0krnf978iaomv5ijrfhs3lo38i8jc.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
