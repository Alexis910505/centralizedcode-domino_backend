# 🚀 Guía de Despliegue - Backend Dominó

## Índice
1. [Desarrollo Local](#desarrollo-local)
2. [Despliegue con Docker](#despliegue-con-docker)
3. [Despliegue en Producción](#despliegue-en-producción)
4. [Variables de Entorno](#variables-de-entorno)
5. [Mantenimiento](#mantenimiento)

---

## Desarrollo Local

### Requisitos Previos
- Node.js >= 16.x
- MongoDB >= 5.x (local o Atlas)
- npm o yarn

### Instalación

1. **Clonar el repositorio**
```bash
cd domino_backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Crear archivo .env
cp .env.example .env

# Editar .env con tus valores
nano .env
```

4. **Inicializar base de datos (opcional)**
```bash
npm run seed
```

5. **Iniciar servidor en desarrollo**
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

---

## Despliegue con Docker

### Usando Docker Compose (Recomendado)

1. **Configurar variables de entorno**
```bash
# Crear archivo .env
echo "JWT_SECRET=tu_clave_secreta_super_segura" > .env
```

2. **Construir e iniciar contenedores**
```bash
docker-compose up -d
```

3. **Ver logs**
```bash
docker-compose logs -f backend
```

4. **Detener contenedores**
```bash
docker-compose down
```

### Servicios incluidos en Docker Compose

- **Backend** - Puerto 3000
- **MongoDB** - Puerto 27017
- **Mongo Express** - Puerto 8081 (Admin de MongoDB)
  - Usuario: admin
  - Contraseña: admin123

### Solo Docker (sin compose)

1. **Construir imagen**
```bash
docker build -t domino-backend .
```

2. **Ejecutar contenedor**
```bash
docker run -d \
  -p 3000:3000 \
  -e MONGODB_URI="tu_mongodb_uri" \
  -e JWT_SECRET="tu_jwt_secret" \
  --name domino-backend \
  domino-backend
```

---

## Despliegue en Producción

### Opción 1: Heroku

1. **Instalar Heroku CLI**
```bash
npm install -g heroku
```

2. **Login en Heroku**
```bash
heroku login
```

3. **Crear aplicación**
```bash
heroku create tu-app-domino
```

4. **Agregar MongoDB (MongoDB Atlas)**
```bash
heroku addons:create mongolab:sandbox
```

5. **Configurar variables de entorno**
```bash
heroku config:set JWT_SECRET="tu_clave_secreta"
heroku config:set INITIAL_COINS=1000
heroku config:set DAILY_BONUS=100
```

6. **Desplegar**
```bash
git push heroku main
```

### Opción 2: DigitalOcean / AWS / Azure

1. **Crear servidor VPS**
   - Ubuntu 20.04 o superior
   - Al menos 1GB RAM

2. **Conectar por SSH**
```bash
ssh root@tu_servidor_ip
```

3. **Instalar Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. **Instalar MongoDB**
```bash
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

5. **Clonar repositorio**
```bash
git clone https://github.com/tu-usuario/domino-backend.git
cd domino-backend
```

6. **Instalar dependencias**
```bash
npm install --production
```

7. **Configurar variables de entorno**
```bash
nano .env
```

8. **Instalar PM2**
```bash
npm install -g pm2
```

9. **Iniciar aplicación**
```bash
pm2 start src/server.js --name domino-backend
pm2 startup
pm2 save
```

10. **Configurar Nginx (opcional)**
```bash
sudo apt-get install nginx

# Crear configuración
sudo nano /etc/nginx/sites-available/domino
```

Contenido del archivo:
```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/domino /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

11. **Configurar SSL (opcional)**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

### Opción 3: Vercel / Railway / Render

Estos servicios ofrecen despliegue automático desde GitHub.

**Railway:**
1. Conecta tu repositorio de GitHub
2. Configura las variables de entorno
3. Railway desplegará automáticamente

**Render:**
1. Conecta tu repositorio
2. Configura el servicio como "Web Service"
3. Configura variables de entorno
4. Deploy automático

---

## Variables de Entorno

### Requeridas
```env
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/domino_game
JWT_SECRET=clave_secreta_muy_segura
```

### Opcionales
```env
INITIAL_COINS=1000
DAILY_BONUS=100
MIN_BET=10
MAX_BET=10000
SOCKET_CORS_ORIGIN=https://tu-frontend.com
```

---

## Mantenimiento

### Scripts Útiles

**Limpiar salas abandonadas:**
```bash
node scripts/cleanup.js
```

**Inicializar datos de prueba:**
```bash
node scripts/seed.js
```

**Ver logs (PM2):**
```bash
pm2 logs domino-backend
```

**Reiniciar aplicación (PM2):**
```bash
pm2 restart domino-backend
```

**Actualizar aplicación:**
```bash
git pull origin main
npm install
pm2 restart domino-backend
```

### Backup de Base de Datos

**Exportar:**
```bash
mongodump --db domino_game --out /backup/$(date +%Y%m%d)
```

**Importar:**
```bash
mongorestore --db domino_game /backup/20231020/domino_game
```

### Monitoreo

**Ver estado de servicios:**
```bash
pm2 status
```

**Métricas de rendimiento:**
```bash
pm2 monit
```

---

## Seguridad

### Checklist de Producción

- ✅ Usar HTTPS
- ✅ Configurar CORS correctamente
- ✅ Usar variables de entorno seguras
- ✅ Mantener dependencias actualizadas
- ✅ Configurar firewall
- ✅ Usar JWT_SECRET seguro (mínimo 32 caracteres)
- ✅ Configurar rate limiting
- ✅ Implementar logs de auditoría
- ✅ Backups automáticos de BD

---

## Troubleshooting

### Error: Cannot connect to MongoDB
```bash
# Verificar que MongoDB esté corriendo
sudo systemctl status mongod

# Reiniciar MongoDB
sudo systemctl restart mongod
```

### Error: Port 3000 already in use
```bash
# Ver qué proceso usa el puerto
lsof -i :3000

# Matar proceso
kill -9 <PID>
```

### Error: Module not found
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

---

## Contacto y Soporte

Para problemas o preguntas sobre el despliegue, contacta al equipo de desarrollo.

