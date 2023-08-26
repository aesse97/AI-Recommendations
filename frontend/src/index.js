import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from './components/theme'; // Make sure to import ThemeProvider
import App from './App';
import './index.css'
import './App.css'

ReactDOM.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
  document.getElementById('root')
);
