// main.jsx - starts React

import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.jsx';
import './styles.css';

// StrictMode helps find bugs during development --> remove for deployment
createRoot(document.getElementById('root')).render( // gets root element from index.html
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

