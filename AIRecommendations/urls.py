from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.contrib.staticfiles.views import serve
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('recommendations.urls')),
    re_path(r'^manifest.json$', serve, {'path': 'manifest.json'}),  # Serve manifest.json
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),  # Catch-all pattern for React
]

urlpatterns += staticfiles_urlpatterns()

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)


