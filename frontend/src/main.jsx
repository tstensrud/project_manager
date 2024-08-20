import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './css/index.css';
import './css/form.css';
import './css/popups.css';
import './css/print.css';
import './css/tables.css';
import './css/cards.css';
import './css/login.css';
import { GlobalProvider } from './GlobalContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </React.StrictMode>,
)
