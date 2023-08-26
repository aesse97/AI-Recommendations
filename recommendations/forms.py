from django import forms

class RecommendationForm(forms.Form):
    CATEGORY_CHOICES = [
        ('music', 'Music'),
        ('books', 'Books'),
        ('movies', 'Movies'),
    ]
    category = forms.ChoiceField(choices=CATEGORY_CHOICES)
    query = forms.CharField(widget=forms.Textarea, help_text="Enter details about your favorite music, movies, books, etc.")