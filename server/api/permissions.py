from rest_framework.permissions import BasePermission, SAFE_METHODS

class AllowPostAndGetOnly(BasePermission):
    """
    Custom permission to allow both POST and GET requests from any user.
    Only admin users can PUT, PATCH, DELETE.
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS or request.method == 'POST':
            return True
        return request.user and request.user.is_staff if request.user else False