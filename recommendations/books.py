import requests
from django.conf import settings

GOOGLE_BOOKS_API_ENDPOINT = "https://www.googleapis.com/books/v1/volumes"
GOOGLE_BOOKS_API_KEY = settings.GOOGLE_BOOKS_API_KEY


def get_book_details(title, author=None):
    print(title)
    if author:
        search_query = f'intitle:{title}+inauthor:{author}'
    else:
        search_query = title

    params = {
        'q': search_query,
        'maxResults': 5,
        'langRestrict': 'en'
    }

    response = requests.get(GOOGLE_BOOKS_API_ENDPOINT, params=params)

    if response.status_code != 200:
        print(f"Error: Unable to fetch data from Google Books API. Status Code: {response.status_code}")
        return []

    data = response.json()

    valid_items = [item for item in data.get('items', []) if item['volumeInfo'].get('description') and item['volumeInfo'].get('imageLinks')]

    if not valid_items:
        return []

    sorted_items = sorted(valid_items, key=lambda x: x['volumeInfo'].get('ratingsCount', 0), reverse=True)

    book_list = []
    seen_titles = set()
    for selected_item in sorted_items:
        book_info = selected_item['volumeInfo']
        if book_info.get('title') not in seen_titles:
            seen_titles.add(book_info.get('title'))
            book = {
                'title': book_info.get('title'),
                'authors': book_info.get('authors', []),
                'publishedDate': book_info.get('publishedDate'),
                'description': truncate_description(book_info.get('description')),
                'imageLinks': book_info.get('imageLinks', {}).get('thumbnail'),
                'infoLink': book_info.get('infoLink'),
                'averageRating': book_info.get('averageRating', None),
                'ratingsCount': book_info.get('ratingsCount', None),
                'genre': book_info.get('categories', [None])[0]
            }
            book_list.append(book)
            break

    if not book_list and sorted_items:
        book_info = sorted_items[0]['volumeInfo']
        book = {
            'title': book_info.get('title'),
            'authors': book_info.get('authors', []),
            'publishedDate': book_info.get('publishedDate'),
            'description': truncate_description(book_info.get('description')),
            'imageLinks': book_info.get('imageLinks', {}).get('thumbnail'),
            'infoLink': book_info.get('infoLink'),
            'averageRating': book_info.get('averageRating', None),
            'ratingsCount': book_info.get('ratingsCount', None),
            'genre': book_info.get('categories', [None])[0]
        }
        book_list.append(book)

    return book_list


def truncate_description(description, max_words=150):
    words = description.split()
    if len(words) > max_words:
        return ' '.join(words[:max_words]) + '...'
    return description

def is_book_in_list(book, existing_books):
    for existing_book in existing_books:
        if (book['title'] == existing_book['title'] and
            set(book['authors']) == set(existing_book['authors'])):
            return True
    return False