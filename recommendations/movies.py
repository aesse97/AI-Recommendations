import requests
from django.conf import settings

TMDB_API_KEY = settings.TMDB_API_KEY
TMDB_BASE_URL = 'https://api.themoviedb.org/3'

def get_movie_details(movie_name):
    search_url = f"{TMDB_BASE_URL}/search/movie?api_key={TMDB_API_KEY}&query={movie_name}"
    response = requests.get(search_url)
    data = response.json()

    if data['results']:
        movie = data['results'][0]
        movie_id = movie['id']

        # Fetch watch providers
        providers_url = f"{TMDB_BASE_URL}/movie/{movie_id}/watch/providers?api_key={TMDB_API_KEY}"
        providers_response = requests.get(providers_url)
        providers_data = providers_response.json()

        flatrate_providers = providers_data.get('results', {}).get('US', {}).get('flatrate', [])
        buy_rent_providers = providers_data.get('results', {}).get('US', {}).get('buy', []) + providers_data.get(
            'results', {}).get('US', {}).get('rent', [])

        providers_list = [{
            'name': provider['provider_id'],
            'logo': f"https://image.tmdb.org/t/p/original{provider['logo_path']}" if provider['logo_path'] else None,
            'url': provider.get('link', '')  # Extract the streaming link
        } for provider in flatrate_providers]

        rating_percentage = round(movie['vote_average'] * 10)

        return {
            'id': movie_id,  # Added this line
            'title': movie['title'],
            'poster_path': f"https://image.tmdb.org/t/p/w500{movie['poster_path']}",
            'release_date': movie['release_date'],
            'overview': movie['overview'],
            'vote_average': movie['vote_average'],
            'watch_providers': providers_list,
            'rating_percentage': rating_percentage,
        }
    return None

def get_tv_show_details(tv_show_name):
    search_url = f"{TMDB_BASE_URL}/search/tv?api_key={TMDB_API_KEY}&query={tv_show_name}"
    response = requests.get(search_url)
    data = response.json()

    if data['results']:
        tv_show = data['results'][0]
        tv_show_id = tv_show['id']

        # Fetch watch providers
        providers_url = f"{TMDB_BASE_URL}/tv/{tv_show_id}/watch/providers?api_key={TMDB_API_KEY}"
        providers_response = requests.get(providers_url)
        providers_data = providers_response.json()

        flatrate_providers = providers_data.get('results', {}).get('US', {}).get('flatrate', [])

        providers_list = [{
            'name': provider['provider_id'],
            'logo': f"https://image.tmdb.org/t/p/original{provider['logo_path']}" if provider['logo_path'] else None
        } for provider in flatrate_providers]

        rating_percentage = round(tv_show['vote_average'] * 10)

        return {
            'id': tv_show_id,
            'title': tv_show['name'],
            'poster_path': f"https://image.tmdb.org/t/p/w500{tv_show['poster_path']}",
            'release_date': tv_show['first_air_date'],
            'overview': tv_show['overview'],
            'vote_average': tv_show['vote_average'],
            'watch_providers': providers_list,
            'rating_percentage': rating_percentage,
        }
    return None
