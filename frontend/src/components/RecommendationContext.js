import { createContext } from 'react';

const RecommendationContext = createContext({
  recommendations: {
    song_recommendations: [],
    album_recommendations: [],
    artist_recommendations: [],
    movie_recommendations: [],
    tv_show_recommendations: [],
    book_recommendations: [],
  },
  setRecommendations: () => {},
  userQuery: "",
  setUserQuery: () => {},
  previousRecommendations: [],
  setPreviousRecommendations: () => {}
});

export default RecommendationContext;

