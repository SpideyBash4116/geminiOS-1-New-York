import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { OSProvider } from './context/OSContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OSProvider>
      <App />
    </OSProvider>
  </StrictMode>,
);
