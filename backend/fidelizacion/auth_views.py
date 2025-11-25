from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes

# LOGIN
class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]


# VALIDAR TOKEN (para frontend)
@api_view(["GET"])
@permission_classes([AllowAny])
def check_token(request):
    return Response({"message": "Token válido"})
