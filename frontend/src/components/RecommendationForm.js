import React, { useState, useEffect, useContext,} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, FormControl, InputLabel, Select, MenuItem, TextField, Button, Typography, Box } from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
import RecommendationContext from './RecommendationContext';
import { ThemeContext } from './theme';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import BookIcon from '@mui/icons-material/Book';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import '../App.css';
import { useTheme } from '@mui/material/styles';
import LoadingText from './LoadingText';
import { WelcomeMessages } from './LoadingText';
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import Brightness2Icon from '@mui/icons-material/Brightness2';
import './RecommendationForm.css'


function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function RecommendationForm() {
  const [category, setCategory] = useState('music');
  const [query, setQuery] = useState('');
  const [{themeName, toggleTheme}] = useContext(ThemeContext);
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {setRecommendations, setPreviousRecommendations, setUserQuery} = useContext(RecommendationContext);

  const controls = useAnimation();
  useEffect(() => {
    controls.start({
      y: [100, 0],
      transition: {type: 'spring', stiffness: 100},
    });
  }, [controls]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  const csrftoken = getCookie('csrftoken');

  const requestData = {
    category: category,
    query: query,
  };

  try {
    const response = await axios.post('/api/recommendations/', requestData, {
      headers: {
        'X-CSRFToken': csrftoken,
      },
      withCredentials: true,
    });

    setRecommendations(response.data);
    setUserQuery(query);

    const initialTitles = Object.values(response.data).reduce((acc, curr) => acc.concat(curr), []).map(recommendation => recommendation.title || recommendation.name);
    setPreviousRecommendations(initialTitles);
    console.log("Updated Previous Recommendations:", initialTitles);

    navigate('/recommendations');
  } catch (error) {
    console.error('Network error:', error);
  }
  setIsLoading(false);
};


let label;
switch (category) {
  case 'music':
    label = "Tell me your favorite song, artist, album..";
    break;
  case 'books':
    label = "Tell me your favorite book, genre, author...";
    break;
  case 'movies':
    label = "Tell me your favorite movie, actor, genre...";
    break;
  case 'tv':
    label = "Tell me your favorite TV show, actor, genre...";
    break;
  default:
    label = "Type your favorite item...";
}

return (
    <Box className={`main-container ${themeName === 'dark' ? 'dark-background' : 'light-background'}`}>
        <Button onClick={toggleTheme} variant="text" color="inherit" className="toggle-theme-btn">
            {themeName === 'dark' ? <WbSunnyRoundedIcon /> : <Brightness2Icon />}
        </Button>

        <Box className="welcome-message-box">
            {!isLoading && <WelcomeMessages className="welcome-message-text" />}
        </Box>

        <Box className="loading-or-content-box">
            {isLoading ? (
                <>
                    <Box className="loading-text-box">
                        <Typography variant="h4">
                            Loading...
                        </Typography>
                    </Box>
                    <motion.div className="motion-div"
                        animate={{
                            y: [100, 0],
                            transition: { type: 'spring', stiffness: 100 },
                        }}
                    >
                        <LoadingText />
                    </motion.div>
                </>
            ) : (
                <motion.div animate={controls}>
                      <Container style={{ boxShadow: theme.shadows[10] }} className={`content-container ${themeName === 'dark' ? 'dark-content' : 'light-content'}`}>
                        <form onSubmit={handleSubmit}>
                            <motion.div initial={{y: -50}} animate={{y: 0}} transition={{type: 'spring', stiffness: 150}}>
                            </motion.div>
                            <FormControl fullWidth variant="outlined" margin="normal">
                                <InputLabel id="category-label">Category</InputLabel>
                                <Select
                                    labelId="category-label"
                                    id="id_category"
                                    value={category}
                                    onChange={(e) => {
                                        setCategory(e.target.value);
                                    }}
                                    label="Category"
                                >
                                    <MenuItem value="music">
                                        <MusicNoteIcon/> Music
                                    </MenuItem>
                                    <MenuItem value="books">
                                        <BookIcon/> Books
                                    </MenuItem>
                                    <MenuItem value="movies">
                                        <MovieIcon/> Movies
                                    </MenuItem>
                                    <MenuItem value="tv">
                                        <TvIcon/> TV Shows
                                    </MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                fullWidth
                                id="id_query"
                                label={label}
                                variant="outlined"
                                margin="normal"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                margin="normal"
                                className="submit-btn"
                            >
                                Submit
                            </Button>
                        </form>
                    </Container>
                </motion.div>
            )}
        </Box>

        <Box className="flex-spacer"></Box>
    </Box>
);

}

export default RecommendationForm;
