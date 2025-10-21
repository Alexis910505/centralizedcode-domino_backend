# 📦 Instrucciones de Instalación - Backend Dominó

## Opción 1: Instalación Rápida (Recomendada)

### Paso 1: Instalar Dependencias
```bash
npm install
```

### Paso 2: Configurar Variables de Entorno
```bash
# Crear archivo .env en la raíz del proyecto
# Puedes copiar el ejemplo o crear uno nuevo

# Contenido mínimo del archivo .env:
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/domino_game
JWT_SECRET=mi_clave_secreta_super_segura_cambiar_en_produccion
INITIAL_COINS=1000
DAILY_BONUS=100
MIN_BET=10
MAX_BET=10000
SOCKET_CORS_ORIGIN=http://localhost:3000,http://localhost:5000
```

### Paso 3: Iniciar MongoDB

**En Windows:**
```bash
# Si instalaste MongoDB como servicio, ya debería estar corriendo
# Verifica en Services o ejecuta:
net start MongoDB
```

**En Linux/Mac:**
```bash
sudo systemctl start mongod
# o
brew services start mongodb-community
```

**Alternativa: Usar MongoDB Atlas (Cloud - Gratis)**
1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea una cuenta gratuita
3. Crea un cluster (M0 - gratuito)
4. Obtén la URI de conexión
5. Actualiza `MONGODB_URI` en tu `.env`

### Paso 4: Iniciar el Servidor
```bash
# Modo desarrollo (con auto-reload)
npm run dev

# O modo producción
npm start
```

### Paso 5: Verificar
Abre tu navegador en: `http://localhost:3000`

Deberías ver:
```json
{
  "success": true,
  "message": "API de Dominó Multijugador",
  "version": "1.0.0"
}
```

¡Listo! ✅

---

## Opción 2: Instalación con Docker (Más Fácil)

### Requisitos:
- Docker Desktop instalado
- Docker Compose instalado

### Paso 1: Configurar Variables
```bash
# Crear archivo .env en la raíz
echo "JWT_SECRET=mi_clave_super_secreta" > .env
```

### Paso 2: Iniciar Todo
```bash
docker-compose up -d
```

Esto iniciará:
- ✅ Backend (puerto 3000)
- ✅ MongoDB (puerto 27017)
- ✅ Mongo Express - Admin (puerto 8081)

### Paso 3: Verificar
```bash
# Ver logs
docker-compose logs -f backend

# Verificar que esté corriendo
curl http://localhost:3000
```

### Administrar MongoDB:
Abre `http://localhost:8081` en tu navegador
- Usuario: `admin`
- Contraseña: `admin123`

¡Listo! ✅

---

## Paso Opcional: Crear Datos de Prueba

```bash
npm run seed
```

Esto creará 4 usuarios de prueba:
- `jugador1@test.com` - password: `password123` - 5000 fichas
- `jugador2@test.com` - password: `password123` - 3000 fichas
- `jugador3@test.com` - password: `password123` - 4000 fichas
- `jugador4@test.com` - password: `password123` - 2500 fichas

---

## Verificación de Instalación

### Test 1: Health Check
```bash
curl http://localhost:3000/health
```

Respuesta esperada:
```json
{
  "success": true,
  "status": "OK",
  "timestamp": "2025-10-21T..."
}
```

### Test 2: Registro de Usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

Respuesta esperada: `success: true` con token

### Test 3: Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Si todo funciona correctamente, ¡tu instalación está lista! ✅

---

## Instalación Completa Paso a Paso (Windows)

### 1. Instalar Node.js
1. Descarga Node.js 18+ desde [nodejs.org](https://nodejs.org/)
2. Ejecuta el instalador
3. Verifica: `node --version` y `npm --version`

### 2. Instalar MongoDB
**Opción A: MongoDB Local**
1. Descarga MongoDB Community Server desde [mongodb.com](https://www.mongodb.com/try/download/community)
2. Ejecuta el instalador
3. Selecciona "Install as Windows Service"
4. Verifica: `mongod --version`

**Opción B: MongoDB Atlas (Cloud)**
- No requiere instalación local
- Sigue los pasos en "Paso 3" de la Opción 1

### 3. Clonar o Copiar el Proyecto
```bash
# Si tienes el código en un ZIP, descomprímelo
# Si está en Git:
git clone https://github.com/tu-usuario/domino-backend.git
cd domino-backend
```

### 4. Instalar Dependencias
```bash
npm install
```

### 5. Configurar .env
Crea un archivo llamado `.env` en la raíz con este contenido:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/domino_game
JWT_SECRET=mi_clave_super_secreta_cambiar_en_produccion
INITIAL_COINS=1000
DAILY_BONUS=100
MIN_BET=10
MAX_BET=10000
SOCKET_CORS_ORIGIN=*
```

### 6. Iniciar MongoDB
```bash
# Si está como servicio, ya debería estar corriendo
# Puedes verificar en el "Administrador de Tareas" -> Servicios -> MongoDB
```

### 7. Iniciar el Servidor
```bash
npm run dev
```

### 8. Probar
Abre tu navegador en `http://localhost:3000`

---

## Instalación Completa Paso a Paso (Linux/Mac)

### 1. Instalar Node.js
**Ubuntu/Debian:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Mac:**
```bash
brew install node
```

Verifica: `node --version` y `npm --version`

### 2. Instalar MongoDB
**Ubuntu/Debian:**
```bash
# Importar clave pública
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Crear lista de fuentes
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Actualizar e instalar
sudo apt-get update
sudo apt-get install -y mongodb-org

# Iniciar servicio
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### 3. Clonar Proyecto
```bash
git clone https://github.com/tu-usuario/domino-backend.git
cd domino-backend
```

### 4. Instalar Dependencias
```bash
npm install
```

### 5. Configurar .env
```bash
cat > .env << EOL
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/domino_game
JWT_SECRET=mi_clave_super_secreta_cambiar_en_produccion
INITIAL_COINS=1000
DAILY_BONUS=100
MIN_BET=10
MAX_BET=10000
SOCKET_CORS_ORIGIN=*
EOL
```

### 6. Iniciar Servidor
```bash
npm run dev
```

---

## Solución de Problemas

### Error: "Cannot find module 'express'"
**Solución:** Reinstalar dependencias
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "Failed to connect to MongoDB"
**Solución 1:** Verificar que MongoDB esté corriendo
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl status mongod
sudo systemctl start mongod
```

**Solución 2:** Usar MongoDB Atlas
- Crea cuenta en mongodb.com/cloud/atlas
- Actualiza MONGODB_URI en .env

### Error: "Port 3000 is already in use"
**Solución:** Cambiar puerto en .env
```env
PORT=3001
```

### Error: "Module not found: 'bcryptjs'"
**Solución:** Instalar dependencias faltantes
```bash
npm install bcryptjs jsonwebtoken express mongoose socket.io
```

---

## Verificar que Todo Funciona

### Checklist Final:
- [ ] Node.js instalado (`node --version`)
- [ ] MongoDB corriendo (local o Atlas)
- [ ] Dependencias instaladas (`npm install`)
- [ ] Archivo .env configurado
- [ ] Servidor inicia sin errores (`npm run dev`)
- [ ] Endpoint principal responde (`http://localhost:3000`)
- [ ] Registro de usuario funciona
- [ ] Login funciona

Si todos los checks están ✅, ¡estás listo para desarrollar! 🎉

---

## Próximos Pasos

1. Lee `QUICK_START.md` para empezar a usar el backend
2. Lee `API_DOCUMENTATION.md` para conocer todos los endpoints
3. Lee `TESTING.md` para probar las funcionalidades
4. Conecta tu app de Flutter al backend

---

## Ayuda Adicional

Si tienes problemas:
1. Verifica los logs del servidor
2. Consulta `TROUBLESHOOTING.md`
3. Revisa la documentación en los archivos .md
4. Contacta al equipo de desarrollo

---

**¡Disfruta desarrollando tu juego de dominó! 🎲**

