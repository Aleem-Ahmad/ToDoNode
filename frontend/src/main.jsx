import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { FlashProvider } from './context/FlashContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <FlashProvider>
        <App />
      </FlashProvider>
    </BrowserRouter>
  </StrictMode>,
);
