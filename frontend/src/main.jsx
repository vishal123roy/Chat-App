import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'stream-chat-react/dist/css/v2/index.css';
import "@stream-io/video-react-sdk/dist/css/styles.css";
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
     <App />
    </BrowserRouter>
  </StrictMode>,
)
