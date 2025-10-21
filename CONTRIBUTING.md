# 🤝 Guía de Contribución - Backend Dominó

¡Gracias por tu interés en contribuir al proyecto! 🎉

---

## 📋 Tabla de Contenidos

1. [Código de Conducta](#código-de-conducta)
2. [¿Cómo Puedo Contribuir?](#cómo-puedo-contribuir)
3. [Flujo de Trabajo](#flujo-de-trabajo)
4. [Convenciones de Código](#convenciones-de-código)
5. [Convenciones de Commits](#convenciones-de-commits)
6. [Pull Requests](#pull-requests)
7. [Reportar Bugs](#reportar-bugs)
8. [Sugerir Mejoras](#sugerir-mejoras)

---

## 📜 Código de Conducta

Este proyecto sigue un código de conducta profesional:

- ✅ Respeto mutuo
- ✅ Comunicación constructiva
- ✅ Colaboración positiva
- ❌ Lenguaje ofensivo o discriminatorio
- ❌ Acoso de cualquier tipo

---

## 🎯 ¿Cómo Puedo Contribuir?

### Opciones de Contribución

1. **🐛 Reportar bugs**
2. **✨ Sugerir nuevas funcionalidades**
3. **📝 Mejorar documentación**
4. **💻 Escribir código**
5. **🧪 Escribir tests**
6. **🔍 Code review**

---

## 🔀 Flujo de Trabajo

### 1. Fork del Repositorio

```bash
# En GitHub: Click en "Fork"
# Luego clona tu fork
git clone https://github.com/TU_USUARIO/centralizedcode-domino_backend.git
cd centralizedcode-domino_backend
```

### 2. Configurar Remotes

```bash
# Agregar el repositorio original como upstream
git remote add upstream https://github.com/Alexis910505/centralizedcode-domino_backend.git

# Verificar
git remote -v
```

### 3. Crear Rama de Feature

```bash
# Actualizar develop
git checkout develop
git pull upstream develop

# Crear tu rama
git checkout -b feature/mi-nueva-funcionalidad
```

### 4. Desarrollar

```bash
# Hacer cambios
# ... editar archivos ...

# Commit
git add .
git commit -m "feat: agregar funcionalidad X"
```

### 5. Mantener Actualizado

```bash
# Sincronizar con upstream
git fetch upstream
git rebase upstream/develop
```

### 6. Push a tu Fork

```bash
git push origin feature/mi-nueva-funcionalidad
```

### 7. Crear Pull Request

1. Ve a GitHub
2. Click en "New Pull Request"
3. Base: `develop` ← Compare: `feature/mi-nueva-funcionalidad`
4. Completa la plantilla de PR
5. Submit!

---

## 💻 Convenciones de Código

### Estilo General

- **Indentación**: 2 espacios
- **Comillas**: Simples (`'`)
- **Punto y coma**: Sí
- **Líneas en blanco**: Entre funciones
- **Longitud de línea**: Máximo 100 caracteres

### JavaScript/Node.js

```javascript
// ✅ Bueno
const userName = 'Juan';
const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    throw new Error('Usuario no encontrado');
  }
};

// ❌ Malo
const user_name="Juan"
const getUserById=async(id)=>{
try{
const user=await User.findById(id)
return user
}catch(error){throw new Error("Usuario no encontrado")}}
```

### Nombres

- **Variables/Funciones**: `camelCase`
- **Clases**: `PascalCase`
- **Constantes**: `UPPER_SNAKE_CASE`
- **Archivos**: `camelCase.js` o `PascalCase.js` (clases)

```javascript
// Variables y funciones
const userCount = 10;
const calculateScore = () => {};

// Clases
class DominoEngine {}

// Constantes
const MAX_PLAYERS = 4;
const API_BASE_URL = 'http://localhost:3000';
```

### Comentarios

```javascript
// ✅ Bueno: Comentarios útiles
// Validar que el usuario tenga suficientes fichas antes de apostar
if (user.coins < bet) {
  throw new Error('Fichas insuficientes');
}

// ❌ Malo: Comentarios obvios
// Verificar si user.coins es menor que bet
if (user.coins < bet) {
  throw new Error('Fichas insuficientes');
}
```

### Manejo de Errores

```javascript
// ✅ Bueno: Try-catch específico
try {
  const user = await User.findById(id);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  return user;
} catch (error) {
  console.error('Error al obtener usuario:', error);
  throw error;
}

// ❌ Malo: Ignorar errores
try {
  const user = await User.findById(id);
  return user;
} catch (error) {
  // Silenciosamente ignora el error
}
```

---

## 📝 Convenciones de Commits

### Formato

```
<tipo>(<scope>): <descripción breve>

[cuerpo opcional]

[footer opcional]
```

### Tipos

| Tipo | Descripción | Emoji |
|------|-------------|-------|
| `feat` | Nueva funcionalidad | ✨ |
| `fix` | Corrección de bug | 🐛 |
| `docs` | Cambios en documentación | 📝 |
| `style` | Formato, punto y coma, etc. | 💄 |
| `refactor` | Refactorización | ♻️ |
| `test` | Agregar o modificar tests | 🧪 |
| `chore` | Tareas de mantenimiento | 🔧 |
| `perf` | Mejora de rendimiento | ⚡ |

### Ejemplos

```bash
# Feature
git commit -m "feat(auth): agregar autenticación con Google OAuth"

# Bug fix
git commit -m "fix(socket): corregir desconexión inesperada de jugadores"

# Documentación
git commit -m "docs(readme): actualizar instrucciones de instalación"

# Refactorización
git commit -m "refactor(game): optimizar algoritmo de validación de jugadas"

# Tests
git commit -m "test(auth): agregar tests unitarios para login"

# Con cuerpo
git commit -m "feat(torneos): agregar sistema de torneos

- Implementar modelo de Torneo
- Crear endpoints de gestión
- Agregar validaciones de participantes
- Documentar API con Swagger

Closes #42"
```

### Reglas

- ✅ Primera línea: máximo 72 caracteres
- ✅ Imperativo: "agregar" no "agregado"
- ✅ Sin punto final
- ✅ Descripción clara y concisa
- ✅ Referencias a issues si aplica

---

## 🔍 Pull Requests

### Antes de Crear un PR

- [ ] Código funciona localmente
- [ ] Tests pasan (`npm test`)
- [ ] Linting pasa (`npm run lint`)
- [ ] Documentación actualizada
- [ ] Commits siguen las convenciones
- [ ] Rama actualizada con `develop`
- [ ] Sin conflictos

### Título del PR

```
feat(auth): agregar autenticación con Google OAuth
```

### Descripción del PR

Usa la plantilla proporcionada:
- Descripción clara de cambios
- Tipo de cambio
- Issue relacionado
- Checklist completado
- Cómo se probó

### Tamaño del PR

- ✅ **Pequeño**: < 200 líneas (ideal)
- ⚠️ **Mediano**: 200-500 líneas (aceptable)
- ❌ **Grande**: > 500 líneas (dividir en PRs más pequeños)

### Code Review

Espera al menos 1 aprobación antes de hacer merge.

---

## 🐛 Reportar Bugs

### ¿Encontraste un Bug?

1. **Verifica** que no esté reportado en [Issues](https://github.com/Alexis910505/centralizedcode-domino_backend/issues)
2. **Crea un nuevo Issue** con:
   - Título descriptivo
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots si aplica
   - Versión de Node.js y SO

### Plantilla de Bug Report

```markdown
## 🐛 Descripción del Bug
Una descripción clara del problema.

## 📋 Pasos para Reproducir
1. Ir a '...'
2. Hacer click en '...'
3. Ver error

## ✅ Comportamiento Esperado
Lo que debería pasar.

## ❌ Comportamiento Actual
Lo que realmente pasa.

## 📸 Screenshots
Si aplica.

## 💻 Entorno
- OS: Windows 10
- Node: v18.0.0
- npm: 9.0.0
```

---

## ✨ Sugerir Mejoras

### ¿Tienes una Idea?

1. **Discute primero** en un Issue
2. **Explica**:
   - Problema que resuelve
   - Solución propuesta
   - Alternativas consideradas
   - Impacto en usuarios

---

## 🧪 Tests

### Escribir Tests

```javascript
// tests/auth.test.js
const request = require('supertest');
const app = require('../src/server');

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });
});
```

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Con cobertura
npm run test:coverage

# Un archivo específico
npm test -- auth.test.js
```

---

## 📚 Documentación

### Actualizar Documentación

Si tu cambio afecta:
- API endpoints → Actualizar `API_DOCUMENTATION.md` y Swagger
- Configuración → Actualizar `README.md`
- Despliegue → Actualizar `DEPLOYMENT.md`
- Flujo Git → Actualizar `GIT_WORKFLOW.md`

---

## 🎯 Áreas que Necesitan Ayuda

### Prioritarias
- [ ] Tests unitarios y de integración
- [ ] Documentación de Socket.io events
- [ ] Optimización de queries de MongoDB
- [ ] Rate limiting
- [ ] Logging con Winston

### Futuras Features
- [ ] Sistema de torneos
- [ ] Chat en partidas
- [ ] Replay de partidas
- [ ] Notificaciones push
- [ ] Panel de administración

---

## 💬 Comunicación

### Canales
- **Issues**: Para bugs y features
- **Pull Requests**: Para code review
- **Discussions**: Para preguntas generales

---

## 🎓 Recursos

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Swagger Documentation](https://swagger.io/docs/)

---

## ✅ Checklist del Contribuidor

Antes de tu primer PR:

- [ ] Leí `CONTRIBUTING.md`
- [ ] Leí `GIT_WORKFLOW.md`
- [ ] Configuré mi entorno local
- [ ] Ejecuté tests localmente
- [ ] Entiendo las convenciones de código
- [ ] Entiendo las convenciones de commits

---

## 🙏 Agradecimientos

¡Gracias por contribuir al proyecto! Cada contribución, sin importar su tamaño, es valiosa.

---

**¿Preguntas?** Abre un Issue con la etiqueta `question` 💬

