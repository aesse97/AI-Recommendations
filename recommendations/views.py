from django.http import JsonResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
import json
import openai
from concurrent.futures import ThreadPoolExecutor, as_completed
from .spotify import enhance_with_spotify
from .movies import get_movie_details, get_tv_show_details
from .books import get_book_details, is_book_in_list
import re

class RecommendationView(View):

    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super(RecommendationView, self).dispatch(*args, **kwargs)

    def post(self, request):
        recommendations = {
            "song_recommendations": [],
            "album_recommendations": [],
            "artist_recommendations": [],
            "movie_recommendations": [],
            "tv_show_recommendations": [],
            "book_recommendations": []
        }

        try:
            request_data = json.loads(request.body.decode('utf-8'))
            category = request_data.get('category')
            query = request_data.get('query')
            exclude = request_data.get('exclude', [])

            if not category or not query:
                return JsonResponse({"error": "Category and query are required"}, status=400)

            if not query or not query.strip():
                return JsonResponse({"error": "Query cannot be blank"}, status=400)

            if category == 'music':
                questions = [
                    (f"Can you list 30 songs that are similar to {query}?", "track"),
                    (f"Can you list 20 albums that are similar to {query}?", "album"),
                    (f"Can you list 20 artists that are similar to {query}?", "artist"),
                ]

                more_questions = [(q[0] + ' but not including ' + ', '.join(exclude), q[1]) for q in questions]

                with ThreadPoolExecutor() as executor:
                    future_to_question = {executor.submit(self.get_openai_recommendation, mq[0], mq[1]): mq for mq in more_questions}
                    for future in as_completed(future_to_question):
                        question, search_type = future_to_question[future]
                        category_key = {"track": "song_recommendations", "album": "album_recommendations", "artist": "artist_recommendations"}[search_type]
                        recommendations[category_key].extend(future.result())

            elif category == 'movies':
                question = f"Can you list 25 movie titles similar to {query} without descriptions of the movies?"
                more_question = f"Can you list 20 movies titles similar to {query} without including titles such as {', '.join(exclude)}?"
                response = openai.ChatCompletion.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You are a helpful assistant that gives movie recommendations."},
                        {"role": "user", "content": more_question}
                    ],
                    max_tokens=200
                )
                print(response)
                print(exclude)
                recommendations["movie_recommendations"] = self.process_movie_recommendations(response, exclude)

            elif category == 'tv':
                question = f"Can you list 25 TV show titles similar to {query} without descriptions of the shows?"
                more_question = f"Can you list 20 TV show titles similar to {query} without including titles such as {', '.join(exclude)}?"
                print("More Question for tv:", more_question)
                response = openai.ChatCompletion.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You are a helpful assistant that gives TV show recommendations."},
                        {"role": "user", "content": more_question}
                    ],
                    max_tokens=200
                )
                print(response)
                print(more_question)
                print("Excluded titles:", exclude)
                recommendations["tv_show_recommendations"] = self.process_tv_show_recommendations(response, exclude)

            elif category == 'books':
                question = f"Can you list 20 book titles similar to {query}?"
                more_question = f"Can you list 20 book titles similar to {query} without including titles such as {', '.join(exclude)}?"
                response = openai.ChatCompletion.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You are a helpful assistant that gives book recommendations."},
                        {"role": "user", "content": more_question}
                    ],
                    max_tokens=400
                )
                print(response)
                recommendations["book_recommendations"] = self.process_book_recommendations(response, exclude)

            return JsonResponse(recommendations)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    def get_openai_recommendation(self, question, search_type):
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that gives music recommendations."},
                {"role": "user", "content": question}
            ],
            max_tokens=500
        )
        print(response)

        recommendations = response.choices[0].message['content'].strip().split("\n")
        valid_recommendations = [line for line in recommendations if not line.startswith(("Certainly!", "Sure!", "If", "Enjoy!", "These artists", "These albums", "I hope you enjoy"))]
        cleaned_recommendations = [recommendation.split('. ', 1)[-1] for recommendation in valid_recommendations]
        cleaned_queries = [self.clean_query(recommendation) for recommendation in cleaned_recommendations if recommendation and recommendation.strip() and len(recommendation.split()) <= 6]
        print("Cleaned Queries:", cleaned_queries)
        details = []
        for cleaned_query in cleaned_queries:
            if cleaned_query:
                detail = enhance_with_spotify(cleaned_query, search_type=search_type)
                print(f"Spotify response for {cleaned_query}:", detail)
                details.append(detail)
        return details

    def process_movie_recommendations(self, response, exclude=[]):
        recommendations = response.choices[0].message['content'].strip().split("\n")
        print("OpenAI Recommendations:", recommendations)
        movie_titles = self.extract_movie_titles(recommendations)
        movie_titles = [title for title in movie_titles if title not in exclude]
        details = [get_movie_details(title) for title in movie_titles]
        movie_details = [detail for detail in details if detail]
        return movie_details

    def process_tv_show_recommendations(self, response, exclude=[]):
        recommendations = response.choices[0].message['content'].strip().split("\n")
        print("OpenAI Recommendations:", recommendations)
        tv_show_titles = self.extract_tv_show_titles(recommendations)
        tv_show_titles = [title for title in tv_show_titles if title not in exclude]
        details = [get_tv_show_details(title) for title in tv_show_titles]
        tv_show_details = [detail for detail in details if detail]
        return tv_show_details

    def process_book_recommendations(self, response, exclude=[]):
        recommendations = response.choices[0].message['content'].strip().split("\n")
        print("OpenAI Recommendations:", recommendations)
        book_titles_and_authors = self.extract_book_titles_and_authors(recommendations)
        book_titles_and_authors = [title for title in book_titles_and_authors if title not in exclude]

        details = []
        for title, author in book_titles_and_authors:
            book_detail = get_book_details(title, author)
            if book_detail:
                for book in book_detail:
                    # Extend deduplication logic here
                    if not is_book_in_list(book, details):
                        details.append(book)

        return details

    def extract_movie_titles(self, recommendations):
        titles = []
        for line in recommendations:
            match = re.search(r'\d+\.\s([^(\n]+)', line)
            if match:
                movie_name = match.group(1).replace('"', '').strip()
                titles.append(movie_name)
        print(titles)
        return titles

    def extract_tv_show_titles(self, recommendations):
        titles = []
        for line in recommendations:
            match = re.search(r'\d+\.\s([^(\n]+)', line)
            if match:
                tv_show_name = match.group(1).replace('"', '').strip()
                titles.append(tv_show_name)
        print(titles)
        return titles

    def extract_book_titles_and_authors(self, recommendations):
        titles_and_authors = []
        for line in recommendations:
            match = re.search(r'\d+\.\s(.*?)\sby\s([^\n]+)', line)
            if match:
                title = match.group(1).strip()
                author = match.group(2).strip()
                titles_and_authors.append((title, author))
        print(titles_and_authors)
        return titles_and_authors

    def clean_query(self, query):
        query = query.replace('"', '')
        query = query.split(':', 1)[0]
        for keyword in ['ft.', '&', 'by']:
            query = query.replace(keyword, '')
        query = query.split(' - ', 1)[0]
        query = re.sub(r'\(\d{4}\)', '', query).strip()
        query = re.sub(r'\s+', ' ', query).strip()
        return query

    def split_title_and_author(self, recommendation):
        recommendation = re.sub(r'^\d+\.\s+"?', '', recommendation).rstrip('"')
        parts = recommendation.split('" by ')
        title = parts[0].strip()
        author = parts[1].strip() if len(parts) > 1 else None
        return title, author



