import requests
import base64
from django.conf import settings

def get_spotify_token():
    client_id = settings.SPOTIFY_CLIENT_ID
    client_secret = settings.SPOTIFY_CLIENT_SECRET
    credentials = base64.b64encode(f"{client_id}:{client_secret}".encode("utf-8")).decode("utf-8")
    token_url = 'https://accounts.spotify.com/api/token'
    token_data = {'grant_type': 'client_credentials'}
    token_headers = {'Authorization': f'Basic {credentials}'}
    token_r = requests.post(token_url, data=token_data, headers=token_headers)
    return token_r.json().get('access_token')

def search_spotify(query, search_type="track,album,artist"):
    token = get_spotify_token()
    headers = {'Authorization': f'Bearer {token}'}
    endpoint = f'https://api.spotify.com/v1/search?q={query}&type={search_type}'
    response = requests.get(endpoint, headers=headers)
    return response.json()

def enhance_with_spotify(query, search_type="track"):
    print("Query sent to Spotify:", query)
    spotify_result = search_spotify(query, search_type)
    details = {}

    if search_type == "track":
        tracks = spotify_result.get('tracks', {}).get('items', [])
        if tracks:
            track = tracks[0]
            details = {
                'name': track['name'],
                'url': track['external_urls']['spotify'],
                'image_url': track['album']['images'][0]['url'] if track.get('album', {}).get('images') else None,
                'popularity': track.get('popularity', 0)
            }
    elif search_type == "album":
        albums = spotify_result.get('albums', {}).get('items', [])
        if albums:
            album = albums[0]
            details = {
                'name': album['name'],
                'url': album['external_urls']['spotify'],
                'image_url': album['images'][0]['url'] if album.get('images') else None,
                'popularity': album.get('popularity', 0)
            }
    elif search_type == "artist":
        artists = spotify_result.get('artists', {}).get('items', [])
        if artists:
            artist = artists[0]
            details = {
                'name': artist['name'],
                'url': artist['external_urls']['spotify'],
                'image_url': artist['images'][0]['url'] if artist.get('images') else None,
                'popularity': artist.get('popularity', 0)
            }

    return details

