import React from 'react';
import ReactDOM from 'react-dom/client';
// Удаляем Provider и ThemeProvider, так как они перенесены в App.tsx
// import { Provider } from 'react-redux';
// import { store } from './redux/store';
import App from './App';
import './index.css';
// import { ThemeProvider } from './components/theme/ThemeProvider'; // ThemeProvider также внутри App

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Вся логика обертки теперь находится внутри App */}
    <App />
  </React.StrictMode>
);