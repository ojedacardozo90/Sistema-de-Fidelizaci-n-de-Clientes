"""
Configuración del proyecto Django - Sistema de Fidelización de Clientes
Cumple: CRUDs + Servicios + Consultas + Proceso planificado
Base de datos: PostgreSQL (ver DATABASES)
"""

from pathlib import Path

# Base
BASE_DIR = Path(__file__).resolve().parent.parent

# Seguridad (para desarrollo)
SECRET_KEY = 'django-insecure-f2g*-u%g7z3n1=(f*c3tiy^5wt@w8)c9a@f6g6g3m@c1t!6xu*'
DEBUG = True
ALLOWED_HOSTS = []

# Apps instaladas (Django + DRF + nuestras apps)
INSTALLED_APPS = [
    # Django
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

  # Terceros
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',

    # Nuestra app principal
    'backend.clientes',
    'backend.fidelizacion',
]
CRONJOBS = [
    ('0 */6 * * *', 'backend.fidelizacion.tasks.expirar_bolsas'),
]
# Middleware por defecto
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.core.urls'

# Templates por defecto
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],  # si tu Figma/Frontend necesita templates, agregá aquí.
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.core.wsgi.application'

# Base de datos: PostgreSQL (ajustá credenciales si usaste otras)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'fidelizacion',
        'USER': 'fidelizacion_user',
        'PASSWORD': 'fidelizacion123',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}

# Validadores de contraseñas (por defecto)
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

CORS_ALLOW_ALL_ORIGINS = True

# Localización Paraguay
LANGUAGE_CODE = 'es-py'
TIME_ZONE = 'America/Asuncion'
USE_I18N = True
USE_TZ = True

# Estáticos
STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Correo (para comprobante de uso de puntos). Para desarrollo usamos consola.
DEFAULT_FROM_EMAIL = 'no-reply@sistema.com'
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
# Para SMTP real en producción: configurá EMAIL_BACKEND y credenciales SMTP.
