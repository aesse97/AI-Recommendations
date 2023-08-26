import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RecommendationForm from './components/RecommendationForm';
import Recommendations from './components/Recommendations';
import RecommendationContext from './components/RecommendationContext';
import { ThemeContext } from './components/theme';
import './App.css'
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

function App() {
  const [recommendations, setRecommendations] = useState({
    song_recommendations: [],
    album_recommendations: [],
    artist_recommendations: [],
    movie_recommendations: [],
    tv_show_recommendations: [],
    book_recommendations: [],
  });

  const [userQuery, setUserQuery] = useState("");

  const [{ themeName }] = useContext(ThemeContext);

  const [previousRecommendations, setPreviousRecommendations] = useState([]);

  const muiTheme = createTheme({
    palette: {
      mode: themeName === 'dark' ? 'dark' : 'light',
      background: {
        default: themeName === 'dark' ? '#0b0b15' : '#FFFFFF',
      },
      text: {
        primary: themeName === 'dark' ? '#E0E0E0' : '#333',
      },
      primary: {
        main: themeName === 'dark' ? '#e4e8ee' : '#04061a',
      },
      secondary: {
        main: themeName === 'dark' ? '#1945a9' : '#1f5ca2',
      },
    },
    components: {
      MuiTypography: {
        styleOverrides: {
          root: {
            color: themeName === 'dark' ? '#e4e8ee' : '#04061a',
          },
          body2: {
            color: themeName === 'dark' ? '#e4e8ee' : '#04061a',
          },
          h2: {
            "@media (max-width: 768px)": {
              fontSize: '1.5rem',
            }
          },
        },
      },
    },
});

  return (
    <MuiThemeProvider theme={muiTheme}>
      <div className={themeName}>
        <RecommendationContext.Provider
          value={{
            recommendations,
            setRecommendations,
            userQuery,
            setUserQuery,
            previousRecommendations,
            setPreviousRecommendations,
          }}
        >
          <Router>
            <Routes>
              <Route path="/" element={<RecommendationForm />} />
              <Route path="/recommendations" element={<Recommendations />} />
            </Routes>
          </Router>
        </RecommendationContext.Provider>
      </div>
    </MuiThemeProvider>
  );
}

export default App;




