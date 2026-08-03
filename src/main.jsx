import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

import { ThemeProvider } from './context/ThemeContext'
import { SearchProvider } from './context/SearchContext'
import './index.css'
import { HelmetProvider } from 'react-helmet-async';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/">
      <ThemeProvider>
        <SearchProvider>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </SearchProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)