# 🌿 Flujo de Trabajo Git - Backend Dominó

## Estructura de Ramas

Este proyecto utiliza **Git Flow**, el estándar de la industria para gestionar el ciclo de vida del código.

---

## 🌳 Ramas Principales

### 1. **`main`** (Producción) 🚀
- **Propósito**: Código en producción
- **Estado**: Siempre estable y listo para desplegar
- **Despliegue**: Automático a producción
- **Protección**: ✅ Protegida (requiere Pull Request)
- **URL**: https://api-dominio.com (producción)

**Reglas:**
- ❌ NO hacer commits directos
- ✅ Solo merge desde `staging` via Pull Request
- ✅ Todos los commits deben estar probados
- ✅ Debe pasar todos los tests

---

### 2. **`staging`** (Pre-Producción) 🧪
- **Propósito**: Pruebas finales antes de producción
- **Estado**: Código candidato a producción
- **Despliegue**: Automático a staging
- **Protección**: ✅ Protegida (requiere Pull Request)
- **URL**: https://staging-api-dominio.com

**Reglas:**
- ❌ NO hacer commits directos
- ✅ Solo merge desde `develop` via Pull Request
- ✅ Pruebas de QA y aceptación
- ✅ Validación del equipo antes de merge a `main`

---

### 3. **`develop`** (Desarrollo) 💻
- **Propósito**: Integración continua de features
- **Estado**: Última versión en desarrollo
- **Despliegue**: Automático a desarrollo
- **Protección**: ⚠️ Semi-protegida
- **URL**: http://localhost:3000 (local)

**Reglas:**
- ⚠️ Evitar commits directos
- ✅ Merge desde ramas `feature/*` via Pull Request
- ✅ Tests deben pasar
- ✅ Code review recomendado

---

## 🔀 Ramas de Soporte

### **`feature/*`** (Nuevas Funcionalidades) ✨
- **Origen**: `develop`
- **Destino**: `develop`
- **Nomenclatura**: `feature/nombre-descriptivo`
- **Duración**: Temporal (se elimina después del merge)

**Ejemplos:**
- `feature/sistema-torneos`
- `feature/chat-en-partidas`
- `feature/tienda-fichas`

**Flujo:**
```bash
# Crear feature
git checkout develop
git pull origin develop
git checkout -b feature/mi-nueva-funcionalidad

# Trabajar en la feature
git add .
git commit -m "feat: implementar funcionalidad X"

# Subir a GitHub
git push origin feature/mi-nueva-funcionalidad

# Crear Pull Request en GitHub: feature/... → develop
```

---

### **`bugfix/*`** (Corrección de Bugs) 🐛
- **Origen**: `develop`
- **Destino**: `develop`
- **Nomenclatura**: `bugfix/descripcion-del-bug`
- **Duración**: Temporal

**Ejemplos:**
- `bugfix/validacion-apuestas`
- `bugfix/desconexion-socket`

---

### **`hotfix/*`** (Correcciones Urgentes) 🚨
- **Origen**: `main`
- **Destino**: `main` Y `develop`
- **Nomenclatura**: `hotfix/descripcion-urgente`
- **Duración**: Temporal
- **Prioridad**: ⚠️ ALTA

**Uso**: Solo para bugs críticos en producción

**Flujo:**
```bash
# Crear hotfix desde main
git checkout main
git pull origin main
git checkout -b hotfix/bug-critico

# Corregir el bug
git add .
git commit -m "hotfix: corregir bug crítico X"

# Merge a main (producción)
git checkout main
git merge hotfix/bug-critico
git push origin main

# Merge a develop (para mantener sincronizado)
git checkout develop
git merge hotfix/bug-critico
git push origin develop

# Eliminar rama hotfix
git branch -d hotfix/bug-critico
```

---

### **`release/*`** (Preparación de Release) 📦
- **Origen**: `develop`
- **Destino**: `staging` → `main`
- **Nomenclatura**: `release/v1.2.0`
- **Duración**: Temporal

**Uso**: Preparar versión para producción

---

## 📊 Diagrama de Flujo

```
┌─────────────────────────────────────────────────────┐
│                     MAIN                            │
│                  (Producción)                       │
│         Solo merge desde staging                    │
└──────────────────┬──────────────────────────────────┘
                   ↑
                   │ Pull Request
                   │ (después de pruebas)
┌──────────────────┴──────────────────────────────────┐
│                   STAGING                            │
│                (Pre-Producción)                      │
│         Solo merge desde develop                     │
└──────────────────┬──────────────────────────────────┘
                   ↑
                   │ Pull Request
                   │ (features completas)
┌──────────────────┴──────────────────────────────────┐
│                   DEVELOP                            │
│                 (Desarrollo)                         │
│       Integración de todas las features             │
└───┬──────────────┬──────────────┬───────────────────┘
    ↑              ↑              ↑
    │              │              │
    │              │              │
feature/chat   feature/torneos  bugfix/socket
```

---

## 🎯 Flujo de Trabajo Completo

### **Desarrollo Normal (Feature)**

```bash
# 1. Actualizar develop
git checkout develop
git pull origin develop

# 2. Crear rama feature
git checkout -b feature/sistema-torneos

# 3. Desarrollar
# ... hacer cambios ...
git add .
git commit -m "feat: agregar sistema de torneos"
git push origin feature/sistema-torneos

# 4. Crear Pull Request en GitHub
# feature/sistema-torneos → develop

# 5. Code review y merge

# 6. Eliminar rama feature
git branch -d feature/sistema-torneos
git push origin --delete feature/sistema-torneos
```

---

### **Preparar para Staging**

```bash
# 1. Desarrollar en develop
# ... features completadas ...

# 2. Crear Pull Request en GitHub
# develop → staging

# 3. Pruebas en staging
# ... QA, testing, validación ...

# 4. Si hay bugs, corregir en develop y repetir
```

---

### **Desplegar a Producción**

```bash
# 1. Validar staging
# ... todas las pruebas pasadas ...

# 2. Crear Pull Request en GitHub
# staging → main

# 3. Aprobar y merge

# 4. Tag de versión
git checkout main
git pull origin main
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

---

## 🔒 Protección de Ramas

### Configurar en GitHub

1. **Settings** → **Branches** → **Add rule**

#### Para `main`:
- ✅ Require pull request before merging
- ✅ Require approvals: 1
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Include administrators

#### Para `staging`:
- ✅ Require pull request before merging
- ✅ Require approvals: 1
- ✅ Require status checks to pass

#### Para `develop`:
- ✅ Require pull request before merging
- ⚠️ Require approvals: 1 (opcional)

---

## 📝 Convenciones de Commits

### Formato:
```
<tipo>(<scope>): <descripción>

[cuerpo opcional]

[footer opcional]
```

### Tipos:
- **feat**: Nueva funcionalidad
- **fix**: Corrección de bug
- **docs**: Cambios en documentación
- **style**: Formato, punto y coma, etc.
- **refactor**: Refactorización de código
- **test**: Agregar tests
- **chore**: Tareas de mantenimiento

### Ejemplos:
```bash
git commit -m "feat(auth): agregar autenticación con Google"
git commit -m "fix(socket): corregir desconexión inesperada"
git commit -m "docs(readme): actualizar instrucciones de instalación"
git commit -m "refactor(game): optimizar motor de dominó"
```

---

## 🚀 Comandos Útiles

### Ver ramas
```bash
# Locales
git branch

# Todas (locales y remotas)
git branch -a

# Con último commit
git branch -v
```

### Cambiar de rama
```bash
git checkout develop
git checkout main
git checkout -b feature/nueva-funcionalidad
```

### Actualizar rama
```bash
git pull origin develop
git pull origin main
```

### Sincronizar develop con main
```bash
git checkout develop
git merge main
git push origin develop
```

### Eliminar rama
```bash
# Local
git branch -d feature/mi-feature

# Remota
git push origin --delete feature/mi-feature
```

### Ver diferencias entre ramas
```bash
git diff develop..main
git diff staging..develop
```

---

## 📋 Checklist de Pull Request

Antes de crear un Pull Request:

- [ ] ✅ Código funciona localmente
- [ ] ✅ Tests pasan
- [ ] ✅ Sin errores de linting
- [ ] ✅ Documentación actualizada
- [ ] ✅ Commits descriptivos
- [ ] ✅ Rama actualizada con la base
- [ ] ✅ Sin conflictos

---

## 🎯 Buenas Prácticas

### ✅ Hacer:
- Commits pequeños y frecuentes
- Mensajes descriptivos
- Pull Requests con descripción clara
- Code review de todo el código
- Tests para nuevas features
- Mantener ramas actualizadas

### ❌ Evitar:
- Commits directos a `main`, `staging`, `develop`
- Pull Requests enormes
- Mensajes vagos ("fix", "update")
- Código sin probar
- Merge sin code review

---

## 🔄 Sincronización de Ramas

### Mantener develop actualizado con main
```bash
git checkout develop
git merge main
git push origin develop
```

### Actualizar feature con develop
```bash
git checkout feature/mi-feature
git merge develop
# Resolver conflictos si los hay
git push origin feature/mi-feature
```

---

## 📊 Estado Actual

### Ramas en el Repositorio:

| Rama | Propósito | Estado | URL |
|------|-----------|--------|-----|
| `main` | Producción | ✅ Estable | https://api-dominio.com |
| `staging` | Pre-Producción | ✅ Estable | https://staging-api.com |
| `develop` | Desarrollo | 🔄 Activa | http://localhost:3000 |

---

## 🆘 Ayuda Rápida

### ¿En qué rama debo trabajar?
- Nueva feature → `feature/*` desde `develop`
- Bug en desarrollo → `bugfix/*` desde `develop`
- Bug en producción → `hotfix/*` desde `main`

### ¿Dónde hago merge?
- `feature/*` → `develop`
- `bugfix/*` → `develop`
- `develop` → `staging`
- `staging` → `main`
- `hotfix/*` → `main` Y `develop`

### ¿Cuándo crear Pull Request?
- Siempre, para cualquier merge a `main`, `staging`, o `develop`

---

## 📚 Referencias

- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

---

## 🎉 Resumen

- ✅ 3 ramas principales: `main`, `staging`, `develop`
- ✅ Ramas de soporte: `feature/*`, `bugfix/*`, `hotfix/*`
- ✅ Pull Requests obligatorios
- ✅ Code review recomendado
- ✅ Tests antes de merge
- ✅ Commits descriptivos

**¡Sigue este flujo y tendrás un proyecto profesional y organizado! 🚀**

