from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

admin.site.site_title = "NOTES APPLICATION Dashboard"
admin.site.site_header = "NOTES APPLICATION Admin"
admin.site.index_title = "NOTES APPLICATION Admin"