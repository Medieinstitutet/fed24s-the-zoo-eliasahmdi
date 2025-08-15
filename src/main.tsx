import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { DjurProvider } from './context/DjurContext';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <DjurProvider>
      <App />
    </DjurProvider>
  </React.StrictMode>
);