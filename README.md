<div align="center">

<img src="frontend/public/favicon-192.png" alt="SporTech" width="220" />

### Tecnología que impulsa el deporte

**Diseño, administración y mejora de páginas web para clubes, academias y proyectos que creen en el poder del deporte y de los buenos hábitos.**

Cali, Colombia · Clientes en todo el país y el mundo

[🌐 Visita el sitio](https://sportech-n0fa.onrender.com/) · [Instagram](https://www.instagram.com/a.adri_an/) · [Facebook](https://www.facebook.com/adrian.033109/) · [TikTok](https://www.tiktok.com/@a.adri_an)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)

</div>

---

## Hola, somos SporTech 👋

No solo hacemos sitios bonitos. Construimos espacios digitales donde tu comunidad se encuentra, crece y se queda.

Creamos, administramos y mejoramos páginas web para clubes, academias y personas del medio digital que impulsan el deporte, los buenos hábitos y la vida saludable. Nacimos en Cali y hoy acompañamos a clientes de todo el país y del mundo.

Creemos que la tecnología y el deporte pueden transformar vidas. Por eso ponemos lo mejor de ambos al servicio de quienes trabajan, cada día, por una vida más activa y saludable.

---

## Qué hacemos

### 🌐 Creación de páginas web
Diseñamos sitios modernos, profesionales y atractivos, enfocados en convertir visitantes en seguidores, clientes potenciales y miembros de tu comunidad.

### 🛠️ Administración web
Nos encargamos del contenido, las actualizaciones, la seguridad, el mantenimiento y el rendimiento, para que tú te enfoques en lo que de verdad importa: tu proyecto y tu gente.

### 📈 Mejora de páginas existentes
Optimizamos tu sitio actual para que sea más rápido, más atractivo y más funcional, sin perder la identidad que ya construiste.

### 🤝 Estrategia y conexión
Integramos herramientas que fortalecen tu comunidad y ayudan a que tu mensaje llegue más lejos, siempre alineado con los hábitos saludables que promueves.

---

## Así trabajamos contigo

| Etapa | Qué pasa |
|:---:|---|
| **1. Analizamos** | Entendemos tu club o iniciativa, tu comunidad y tus objetivos. |
| **2. Diseñamos** | Creamos una propuesta personalizada, alineada a tu identidad. |
| **3. Desarrollamos** | Construimos tu sitio web con tecnología de alto rendimiento. |
| **4. Lanzamos** | Publicamos tu página y la dejamos lista para destacar. |
| **5. Administramos** | Mantenemos y optimizamos tu sitio para que siempre esté al 100%. |

Cada cliente puede seguir su avance en todo momento desde su propio panel: sabes en qué etapa va tu proyecto y en qué estado se encuentra, sin tener que preguntar.

---

## ¿Para quién trabajamos?

- Clubes deportivos y escuelas de formación
- Academias de fútbol, baloncesto, boxeo, atletismo y más
- Entrenadores y profesionales del deporte
- Creadores de contenido de hábitos saludables y vida activa
- Iniciativas que quieren crecer sin perder su esencia

---

## Tu espacio en SporTech

Además de la página pública, la plataforma incluye un área privada para clientes:

- **Registro e ingreso** con correo y contraseña.
- **Selección del servicio** que necesitas, mientras tu proyecto está pendiente.
- **Seguimiento del proyecto**: etapa del proceso y estado actual, visibles en todo momento.
- **Gestión de tu cuenta**: actualizar tus datos o eliminar tu cuenta cuando quieras.

Y un **panel de administración** para el equipo de SporTech, donde se gestionan los clientes, sus estados y el avance de cada proyecto.

> Tu información viaja protegida: las contraseñas se almacenan cifradas, la sesión vive en una cookie privada que el navegador no expone a scripts y los intentos de acceso están limitados para evitar abusos.

---

## Stack

**Frontend**
- React 19 + Vite
- React Router
- GSAP para animaciones
- Lucide para iconografía
- CSS propio, sin frameworks de UI

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- Autenticación con JWT en cookie `httpOnly`
- Contraseñas con bcrypt
- Validación de origen y límite de intentos de acceso

En producción, Express sirve el frontend ya compilado y la API bajo `/api`, todo desde un mismo servicio.

---

## Estructura del proyecto

```
sportech/
├── backend/
│   ├── middleware/      # Autenticación, permisos de admin y validación de origen
│   ├── routes/          # auth, clientes y admin
│   ├── utils/           # Manejo de la sesión
│   └── server.js        # Servidor Express + conexión a MongoDB
├── modelos/
│   └── clientes.js      # Esquema de clientes, servicios y estados
├── frontend/
│   ├── public/          # Imágenes, favicons e iconos
│   └── src/
│       ├── componentes/ # Secciones de la página y componentes compartidos
│       ├── paginas/     # Inicio, Acceso, Panel y Admin
│       ├── estilos/     # Hojas de estilo
│       └── api.js       # Cliente HTTP del frontend
└── package.json         # Scripts y dependencias del proyecto
```

---

## Empezar en local

### Requisitos
- Node.js 20 o superior
- Una base de datos MongoDB (local o en la nube)

### 1. Instalar dependencias

```bash
npm install
```

### 2. Crear el archivo `.env` en la raíz

Crea un archivo `.env` con estas variables (tú defines sus valores; **nunca lo subas al repositorio**):

```env
MONGODB_URI=
JWT_SECRET=
PORT=
NODE_ENV=
```

| Variable | Para qué sirve |
|---|---|
| `MONGODB_URI` | Cadena de conexión a tu base de datos MongoDB |
| `JWT_SECRET` | Clave con la que se firman las sesiones |
| `PORT` | Puerto del servidor (por defecto `3000`) |
| `NODE_ENV` | `development` en local, `production` al desplegar |

> `.env` ya está incluido en `.gitignore`, así que tus credenciales quedan fuera del código.

### 3. Levantar el proyecto

```bash
npm start
```

La aplicación queda disponible en `http://localhost:3000`.

### Desarrollo del frontend

Para trabajar con recarga en caliente, levanta el backend y el frontend por separado:

```bash
# Terminal 1 — backend en el puerto 3000
npm start

# Terminal 2 — frontend en el puerto 5173 (con proxy hacia /api)
npm install --prefix frontend
npm run dev --prefix frontend
```

### Compilar para producción

```bash
npm run build
```

Esto compila el frontend en `frontend/dist`. Después, `npm start` sirve la web y la API desde un solo servicio.

El sitio está desplegado en Render: **https://sportech-n0fa.onrender.com/**

---

## Hablemos

¿Tienes una idea, un club o un proyecto que merece estar en línea?

- 📍 **Cali, Colombia**
- ✉️ **adrian033109.aa@gmail.com**
- 📞 **+57 323 517 6563**
- 🕗 **Lunes a viernes**, 8:00 a.m. – 8:00 p.m.

Cuéntanos qué tienes en mente y hagamos que más personas se conecten con el deporte.

---

<div align="center">

**SporTech** — *El futuro del deporte y la digitalización están en nuestro corazón.*

© 2026 SporTech. Todos los derechos reservados.

</div>
