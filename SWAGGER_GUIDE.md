# 📚 Guía de Uso de Swagger UI - API Dominó

## 🎉 ¡Tu API ahora tiene documentación interactiva online!

Swagger UI te permite explorar y probar todos los endpoints de tu API directamente desde el navegador.

---

## 🚀 Acceder a la Documentación

### 1. Inicia tu servidor
```bash
npm install  # Instala las nuevas dependencias
npm run dev  # Inicia el servidor
```

### 2. Abre tu navegador
```
http://localhost:3000/api-docs
```

¡Listo! Verás una hermosa interfaz interactiva con toda tu API documentada.

---

## 📖 ¿Qué verás en Swagger UI?

### Interfaz Principal
- **Título**: "API de Dominó Multijugador"
- **Versión**: 1.0.0
- **Descripción**: Información general de la API
- **Servidores**: Desarrollo y Producción

### Secciones (Tags)
1. **🔐 Autenticación** - Register, Login, Logout, Profile
2. **👤 Usuarios** - Perfiles, Bonus, Ranking, Estadísticas
3. **🏠 Salas** - Crear, Unirse, Listar, Salir
4. **🎲 Partidas** - Historial, Detalles, Estadísticas

---

## 🎯 Cómo Probar tus Endpoints

### Paso 1: Registrarte
1. Busca la sección **Autenticación**
2. Click en `POST /api/auth/register`
3. Click en **"Try it out"**
4. Edita el JSON de ejemplo:
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```
5. Click en **"Execute"**
6. **Copia el token** de la respuesta

### Paso 2: Autenticar tus Peticiones
1. Busca el botón **"Authorize"** 🔓 en la parte superior derecha
2. Click en él
3. Pega tu token en el campo (solo el token, sin "Bearer")
4. Click en **"Authorize"**
5. Click en **"Close"**

¡Ahora todos tus endpoints protegidos funcionarán! 🔒✅

### Paso 3: Probar Otros Endpoints
Con tu token configurado, prueba cualquier endpoint:

#### Crear una Sala:
1. Ve a **Salas** → `POST /api/rooms/create`
2. Click **"Try it out"**
3. Modifica los parámetros:
```json
{
  "bet": 100,
  "maxPlayers": 4,
  "name": "Mi Sala de Prueba"
}
```
4. Click **"Execute"**
5. ¡Verás la respuesta en tiempo real!

---

## 🔑 Autenticación JWT

### ¿Cómo funciona?
Swagger UI envía automáticamente el header:
```
Authorization: Bearer {tu_token}
```

### Endpoints que requieren autenticación:
- 🔒 Todos excepto `/register` y `/login`

### Si tu token expira:
1. Haz login de nuevo
2. Copia el nuevo token
3. Click en **"Authorize"** y actualízalo

---

## 💡 Características de Swagger UI

### 1. **Explorar sin ejecutar**
- Navega por todos los endpoints
- Lee descripciones
- Ve ejemplos de request/response
- **No necesitas ejecutar nada**

### 2. **Probar endpoints**
- Click en **"Try it out"**
- Modifica parámetros
- Ejecuta peticiones reales
- Ve respuestas en vivo

### 3. **Ver modelos (Schemas)**
- Scroll hasta el final
- Sección **"Schemas"**
- Ve la estructura de User, Room, Match

### 4. **Copiar como cURL**
- Ejecuta un endpoint
- Copia el comando cURL generado
- Úsalo en tu terminal

---

## 📱 Ejemplos de Uso

### Ejemplo 1: Flujo Completo de Registro y Crear Sala

```
1. POST /api/auth/register
   → Obtén token

2. Click "Authorize"
   → Pega el token

3. POST /api/rooms/create
   → Crea una sala
   → Guarda el roomCode

4. GET /api/rooms
   → Ve todas las salas disponibles
```

### Ejemplo 2: Ver tu Perfil y Estadísticas

```
1. GET /api/auth/profile
   → Ve tu información

2. GET /api/users/betting/stats
   → Ve tus estadísticas de apuestas

3. GET /api/users/leaderboard/top
   → Ve el ranking de jugadores
```

---

## 🎨 Personalización

La interfaz de Swagger está personalizada:
- ✅ Sin barra superior (topbar removida)
- ✅ Título personalizado: "API Dominó - Documentación"
- ✅ Colores y estilos de Swagger UI
- ✅ Secciones organizadas por tags

---

## 📤 Exportar Documentación

### Obtener JSON de OpenAPI:
```
http://localhost:3000/api-docs.json
```

Usa este JSON para:
- Importar a Postman
- Generar clientes automáticos
- Integrar con otras herramientas
- Compartir con tu equipo

---

## 🌐 Compartir con tu Equipo

### Opción 1: Desarrollo Local
```bash
# Comparte tu IP local
http://tu-ip:3000/api-docs
```

### Opción 2: Desplegar en Producción
Una vez desplegado:
```
https://tu-dominio.com/api-docs
```

La documentación se actualiza automáticamente con tu código!

---

## 🔍 Consejos y Trucos

### 1. **Lee las Descripciones**
Cada endpoint tiene:
- Resumen breve
- Parámetros requeridos/opcionales
- Posibles respuestas (200, 400, 401, 404)
- Ejemplos de request/response

### 2. **Usa los Ejemplos**
Los ejemplos son reales y funcionales:
- Cópialos y modifícalos
- Son válidos para tu API

### 3. **Verifica los Códigos de Estado**
- 200/201: ✅ Éxito
- 400: ❌ Error de validación
- 401: 🔒 No autenticado
- 404: 🔍 No encontrado
- 500: 💥 Error del servidor

### 4. **Explora los Schemas**
Ve al final de la página:
- User: Estructura del usuario
- Room: Estructura de sala
- Match: Estructura de partida

---

## 🛠️ Integración con Otras Herramientas

### Postman
1. En Swagger, obtén el JSON: `http://localhost:3000/api-docs.json`
2. En Postman: Import → Link → Pega la URL
3. ¡Toda tu API importada!

### Thunder Client (VS Code)
1. Copia cualquier petición de Swagger
2. Pégala en Thunder Client
3. Ejecuta

### Flutter / Dart
Usa el JSON de OpenAPI para generar clientes automáticamente:
```bash
openapi-generator generate -i http://localhost:3000/api-docs.json -g dart
```

---

## 🎓 Recursos Adicionales

### Documentación Oficial
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [OpenAPI 3.0](https://swagger.io/specification/)

### Alternativas a Swagger UI
- **Redoc**: `npm install redoc-express`
- **Scalar**: Interfaz moderna alternativa
- **RapiDoc**: Ligero y rápido

---

## 🚨 Troubleshooting

### "No se muestra nada"
```bash
# Verifica que las dependencias estén instaladas
npm install swagger-ui-express swagger-jsdoc

# Reinicia el servidor
npm run dev
```

### "No puedo ejecutar endpoints protegidos"
- ✅ Verifica que copiaste el token correctamente
- ✅ No incluyas "Bearer" en el campo de autorización
- ✅ El token debe ser reciente (expira en 30 días)

### "Error 401 Unauthorized"
- Haz login de nuevo
- Copia el nuevo token
- Actualiza en "Authorize"

### "Los endpoints no aparecen"
- Verifica que los comentarios JSDoc estén correctos
- Reinicia el servidor
- Verifica la ruta en `swagger.js`: `apis: ['./src/routes/*.js']`

---

## 📊 Estadísticas

Tu API ahora tiene:
- ✅ **17 endpoints** documentados
- ✅ **4 secciones** organizadas
- ✅ **3 modelos** de datos
- ✅ **Autenticación JWT** integrada
- ✅ **Ejemplos** en todos los endpoints
- ✅ **Interfaz interactiva** para probar

---

## 🎉 ¡Listo!

Tu API tiene ahora **documentación profesional online**:

🌐 **URL Local**: `http://localhost:3000/api-docs`
📝 **JSON OpenAPI**: `http://localhost:3000/api-docs.json`
🚀 **Producción**: `https://tu-dominio.com/api-docs`

---

## 💬 Feedback

¿Preguntas sobre Swagger UI? 
- Consulta la documentación oficial
- Revisa los comentarios en el código
- Experimenta con la interfaz

---

**¡Disfruta de tu documentación interactiva! 📚✨**

