# Sistema-de-Fidelizaci-n-de-Clientes
El proyecto desarrollado se validará con peticiones GET, POST, PUT y DELETE que deberán elaborar y facilitar para el día de la revisión de manera a validar el funcionamiento. Como complemento también pueden tener preparadas consultas (select) SQL como apoyo a las peticiones GET para verificar el estado de los datos

1. Estructura del Proyecto
│
├── backend/
├── frontend/
├── venv/
│
├── estructura.txt
├── manage.py
├── README.md
└── requirements.txt


2. Requisitos Previos

- **Python 3.12+**
- **Node.js 18+**
- **PostgreSQL 14+**
- **Git**
- **pip / venv**

---

3. Configuración del Backend (Django)

3.1 Clonar el repositorio o copiar el proyecto

3.2 Crear y activar el entorno virtual
python -m venv venv
venv\Scripts\activate    # Windows

3.3 Instalar dependencias
pip install -r requirements.txt

3.4 Configurar la base de datos (PostgreSQL)

Editá el archivo:

# backend/sistema_nomina/settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'fidelizacion',
        'USER': 'fidelizacion_user',
        'PASSWORD': 'fidelizacion123',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}


El usuario y contraseña deben existir previamente en tu PostgreSQL.

3.5 Crear la base de datos y migraciones
python manage.py makemigrations
python manage.py migrate

3.6 Crear un superusuario
python manage.py createsuperuser

3.7 Ejecutar el servidor
python manage.py runserver


El backend estará disponible en:
http://127.0.0.1:8000/api/

4. Configuración del Frontend (React)
4.1 Ingresar al directorio del frontend
cd ../frontend

4.2 Instalar dependencias
npm install

4.3 Configurar conexión al backend

Verificá que el archivo src/utils/api.js tenga la siguiente línea:

baseURL: "http://127.0.0.1:8000/api",

4.4 Ejecutar el frontend
npm run dev
