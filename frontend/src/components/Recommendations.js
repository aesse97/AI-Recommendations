import React, { useContext, useState } from 'react';
import { Button, Box, Typography, Card, CardActionArea, CardMedia, CardContent } from '@mui/material'; // Import Button
import RecommendationContext from './RecommendationContext';
import { ThemeContext } from './theme'; // Import ThemeContext
import './Recommendations.css';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import Brightness2Icon from '@mui/icons-material/Brightness2';
import { motion, useAnimation } from 'framer-motion';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

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

function Recommendations() {
  const [{ themeName, toggleTheme }] = useContext(ThemeContext); // Access theme context
  const theme = useTheme();
  const [sortPreference, setSortPreference] = useState('alphabetical');
  const [sortOrder, setSortOrder] = useState('ascending');
  const [loadingMore, setLoadingMore] = useState(false);
  const { recommendations, setRecommendations, userQuery, previousRecommendations, setPreviousRecommendations } = useContext(RecommendationContext);


const fetchMoreRecommendations = async (backendCategory, currentRecommendations, csrftoken) => {
  const categoryMap = {
    song: 'song_recommendations',
    album: 'album_recommendations',
    artist: 'artist_recommendations',
    movies: 'movie_recommendations',
    tv: 'tv_show_recommendations',
    books: 'book_recommendations'
  };

  const frontendCategory = categoryMap[backendCategory];

  try {
    const response = await axios.post('/api/recommendations/', {
      category: backendCategory,
      query: userQuery,
      exclude: previousRecommendations
    }, {
      headers: {
        'X-CSRFToken': csrftoken,
      },
      withCredentials: true,
    });

    console.log("Fetched Data:", response.data);
    return response.data[frontendCategory];
  } catch (error) {
    console.error("Error fetching more recommendations:", error);
  }
};



const handleLoadMore = async (backendCategory) => {
  const categoryMap = {
    song: 'song_recommendations',
    album: 'album_recommendations',
    artist: 'artist_recommendations',
    movies: 'movie_recommendations',
    tv: 'tv_show_recommendations',
    books: 'book_recommendations'
  };

  const frontendCategory = categoryMap[backendCategory];

  const csrftoken = getCookie('csrftoken');
  console.log("Previous Recommendations Before Loading More:", previousRecommendations);
  setLoadingMore(true);
  const newRecommendations = await fetchMoreRecommendations(backendCategory, recommendations[frontendCategory], csrftoken);

  if (!newRecommendations) {
    console.error("No new recommendations were fetched.");
    setLoadingMore(false);
    return;
  }

  setRecommendations(prevRecommendations => ({
    ...prevRecommendations,
    [frontendCategory]: [...prevRecommendations[frontendCategory], ...newRecommendations]
  }));


  const newTitles = newRecommendations.map(recommendation => recommendation.title || recommendation.name);
  setPreviousRecommendations([...previousRecommendations, ...newTitles]);

  setLoadingMore(false);
};

  return (
    <Box
      className="recommendations-container"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
            background: themeName === 'dark'
                        ? 'linear-gradient(45deg, #1e1e2f, #1a1a25)'
                        : 'linear-gradient(135deg, #eaf0fa, #f5f7fa)',
          color: theme.palette.primary.main,
      }}
    >
      <Button
        onClick={toggleTheme}
        variant="outlined"
        color="inherit"
        sx={{ position: 'absolute', top: 2, right: 2 }}
      >
        {themeName === 'dark' ? <WbSunnyRoundedIcon /> : <Brightness2Icon />}
      </Button>

{/* Music Recommendations */}
{recommendations.song_recommendations && recommendations.song_recommendations.length > 0 && (
    <>
        <Typography variant="h2" className="recommendations-h2" sx={{ marginBottom: '16px' }}>
            Music Recommendations:
        </Typography>
        <Box className="music-recommendations-container" sx={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {["song", "album", "artist"].map((type) => (
                recommendations[`${type}_recommendations`].map((recommendation) => (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Card className="music-card" elevation={3}>
                        <CardActionArea component="a" href={recommendation.url} target="_blank" rel="noopener noreferrer" sx={{ height: '100%' }}>
                            <Box className='music-image-container' display="flex">
                                <CardMedia
                                    component="img"
                                    className="music-image"
                                    image={recommendation.image_url}
                                    alt={recommendation.name}
                                    sx={{
                                        maxWidth: '100%',
                                        height: 'auto',
                                        display: 'block'
                                    }}
                                />
                            </Box>
                            <CardContent className="music-details">
                                <Typography variant="body1">{recommendation.name}</Typography>
                                <Typography variant="body2" color="textSecondary">{type.charAt(0).toUpperCase() + type.slice(1)}</Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                    </motion.div>
                ))
            ))}
        </Box>
    </>
)}


<>
    {/* Movie Recommendations */}
    {recommendations.movie_recommendations && recommendations.movie_recommendations.length > 0 && (
        <>
            <Typography variant="h2" className="recommendations-h2" sx={{ marginBottom: '16px' }}>
                Movie Recommendations:
            </Typography>

            {/* Sorting Controls for Movies */}
            <div className="sorting-controls">
                <label>
                    Sort by:
                    <select value={sortPreference} onChange={(e) => setSortPreference(e.target.value)}>
                        <option value="alphabetical">Alphabetical</option>
                        <option value="ratings">Ratings</option>
                    </select>
                </label>

                <label>
                    Order:
                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                        <option value="ascending">Ascending</option>
                        <option value="descending">Descending</option>
                    </select>
                </label>
            </div>

            {/* Movie Recommendations Content */}
            <Box className="movie-recommendations-container">
                {recommendations.movie_recommendations
                    .sort((a, b) => {
                        if (sortPreference === 'alphabetical') {
                            return sortOrder === 'ascending' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
                        } else {  // 'ratings'
                            return sortOrder === 'ascending' ? a.rating_percentage - b.rating_percentage : b.rating_percentage - a.rating_percentage;
                        }
                    })
                    .map((recommendation) => {
                        const tmdbMovieUrl = `https://www.themoviedb.org/movie/${recommendation.id}`;
                        return (
                            <Box className="movie-card" key={recommendation.title}>
                                <a href={`${tmdbMovieUrl}/watch`} target="_blank" rel="noopener noreferrer">
                                    <img className="movie-poster" src={recommendation.poster_path} alt={recommendation.title} />
                                </a>
                                <Box className="movie-details">
                                    <Typography variant="body1">{recommendation.title}</Typography>
                                    <Typography variant="body2" color="textSecondary">{recommendation.overview}</Typography>
                                    <Typography variant="body2" color="textSecondary">Rating: {recommendation.rating_percentage}%</Typography>
                                    <Box className="streaming-providers">
                                        {recommendation.watch_providers.map(provider => (
                                            provider.logo &&
                                            <a href={tmdbMovieUrl} target="_blank" rel="noopener noreferrer">
                                                <img className="provider-logo" src={provider.logo} alt={provider.name} />
                                            </a>
                                        ))}
                                    </Box>
                                    <Typography variant="body2" color="textSecondary">
                                        For renting or buying, <a href={tmdbMovieUrl} target="_blank" rel="noopener noreferrer">click here</a>.
                                    </Typography>
                                </Box>
                            </Box>
                        );
                    })
                }
            </Box>
            <Button onClick={() => handleLoadMore('movies')} variant="outlined" disabled={loadingMore}>
                  Load More Movies
              </Button>
              {loadingMore && <CircularProgress />}
            </>
    )}

    {/* TV Show Recommendations */}
    {recommendations.tv_show_recommendations && recommendations.tv_show_recommendations.length > 0 && (
        <>
            <Typography variant="h2" className="recommendations-h2" sx={{ marginBottom: '16px' }}>
                TV Show Recommendations:
            </Typography>

            {/* Sorting Controls for TV Shows */}
            <div className="sorting-controls">
                <label>
                    Sort by:
                    <select value={sortPreference} onChange={(e) => setSortPreference(e.target.value)}>
                        <option value="alphabetical">Alphabetical</option>
                        <option value="ratings">Ratings</option>
                    </select>
                </label>

                <label>
                    Order:
                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                        <option value="ascending">Ascending</option>
                        <option value="descending">Descending</option>
                    </select>
                </label>
            </div>

            {/* TV Show Recommendations Content */}
            <Box className="tvshow-recommendations-container">
                {recommendations.tv_show_recommendations
                    .sort((a, b) => {
                        if (sortPreference === 'alphabetical') {
                            return sortOrder === 'ascending' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
                        } else {  // 'ratings'
                            return sortOrder === 'ascending' ? a.rating_percentage - b.rating_percentage : b.rating_percentage - a.rating_percentage;
                        }
                    })
                    .map((recommendation) => {
                        const tmdbTVShowUrl = `https://www.themoviedb.org/tv/${recommendation.id}`;
                        return (
                            <Box className="movie-card" key={recommendation.title}>
                                <a href={tmdbTVShowUrl} target="_blank" rel="noopener noreferrer">
                                    <img className="movie-poster" src={recommendation.poster_path} alt={recommendation.title} />
                                </a>
                                <Box className="movie-details">
                                    <Typography variant="body1">{recommendation.title}</Typography>
                                    <Typography variant="body2" color="textSecondary">{recommendation.overview}</Typography>
                                    <Typography variant="body2" color="textSecondary">Rating: {recommendation.rating_percentage}%</Typography>
                                    <Box className="streaming-providers">
                                        {recommendation.watch_providers.map(provider => (
                                            provider.logo &&
                                            <a href={tmdbTVShowUrl} target="_blank" rel="noopener noreferrer">
                                                <img className="provider-logo" src={provider.logo} alt={provider.name} />
                                            </a>
                                        ))}
                                    </Box>
                                    <Typography variant="body2" color="textSecondary">
                                        For renting or buying, <a href={tmdbTVShowUrl} target="_blank" rel="noopener noreferrer">click here</a>.
                                    </Typography>
                                </Box>
                            </Box>
                        );
                    })
                }
            </Box>
              <Button onClick={() => handleLoadMore('tv')} variant="outlined" disabled={loadingMore}>
                  Load More TV Shows
              </Button>
              {loadingMore && <CircularProgress />}
            </>
    )}

    {/* Book Recommendations */}
    {recommendations.book_recommendations && recommendations.book_recommendations.length > 0 && (
        <>
            <Typography variant="h2" className="recommendations-h2" sx={{ marginBottom: '16px' }}>
                Book Recommendations:
            </Typography>

            {/* Sorting Controls for Books */}
            <div className="sorting-controls">
                <label>
                    Sort by:
                    <select value={sortPreference} onChange={(e) => setSortPreference(e.target.value)}>
                        <option value="alphabetical">Alphabetical</option>
                        <option value="ratings">Ratings</option>
                    </select>
                </label>

                <label>
                    Order:
                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                        <option value="ascending">Ascending</option>
                        <option value="descending">Descending</option>
                    </select>
                </label>
            </div>

            {/* Book Recommendations Content */}
            <Box className="book-recommendations-container">
                {recommendations.book_recommendations
                    .sort((a, b) => {
                        if (sortPreference === 'alphabetical') {
                            return sortOrder === 'ascending' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
                        } else {  // 'ratings'
                            return sortOrder === 'ascending' ? a.averageRating - b.averageRating : b.averageRating - a.averageRating;
                        }
                    })
                    .map((recommendation) => (
                        <Box className="book-card" key={recommendation.title}>
                            <a href={recommendation.infoLink} target="_blank" rel="noopener noreferrer">
                                <img className="book-image" src={recommendation.imageLinks} alt={recommendation.title} />
                            </a>
                            <Box className="book-details">
                                <Typography variant="body1">{recommendation.title}</Typography>
                                <Typography variant="body2" color="textSecondary">{recommendation.authors.join(', ')}</Typography>
                                <Typography variant="body2" color="textSecondary">{recommendation.description}</Typography>
                                <Typography variant="body2" color="textSecondary">Published: {recommendation.publishedDate}</Typography>
                                {recommendation.genre && <Typography variant="body2" color="textSecondary">Genre: {recommendation.genre}</Typography>}
                                {recommendation.averageRating && (
                                    <Typography variant="body2" color="textSecondary">
                                        Rating: {recommendation.averageRating} ({recommendation.ratingsCount} reviews)
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    ))
                }
            </Box>
            <Button onClick={() => handleLoadMore('books')} variant="outlined" disabled={loadingMore}>
                  Load More Books
              </Button>
              {loadingMore && <CircularProgress />}
            </>
    )}
</>

      <Link to="/" style={{ textDecoration: 'none', margin: '10px' }}>
        <Button variant="contained" color="primary">
          Return Home
        </Button>
      </Link>
    </Box>
  );
}

export default Recommendations;
