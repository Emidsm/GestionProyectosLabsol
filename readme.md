# Project GPL - Gestión de Proyectos Labsol

Este es un proyecto **open source** elaborado específicamente para **gestionar y promover el desarrollo de los proyectos dentro de Labsol Zacatecas**. Está construido con un stack moderno y empaquetado para que cualquier desarrollador pueda contribuir sin romperse la cabeza configurando cosas.

**Requisitos previos**
Lo único que necesitas tener instalado en tu equipo es **Docker** y **Docker Compose**. De todo lo demás se encarga el entorno.

**Instrucciones de arranque**
Para levantar todo (base de datos, almacenamiento, caché/tiempo real con Redis, backend y frontend), abre tu terminal en la raíz del proyecto y ejecuta **docker-compose -f docker-compose.dev.yml up -d --build**.

> Nota: el backend necesita el archivo **Backend/.env**. Si no existe, cópialo desde la plantilla: `cp Backend/.env.example Backend/.env`.

Una vez que los contenedores estén arriba, el siguiente paso es construir la estructura de la base de datos. Para hacer esto, corre el comando **docker exec -it gestion-backend npx prisma migrate deploy**.

**Importante — siembra de datos (obligatorio una sola vez):** ejecuta **docker exec -it gestion-backend npx prisma db seed**. Este paso crea tu usuario administrador y, además, **puebla los catálogos de Estados y Municipios (datos del INEGI) y de Carreras**. Si no lo corres, los menús desplegables de estado/municipio/carrera (registro y perfil) aparecerán **vacíos**. Córrelo **solo una vez**: una segunda ejecución duplicaría los datos de demostración y fallaría.

**Rutas de acceso local**
Tu plataforma web principal está lista en **http://localhost:9002**.
Tu API del backend está escuchando en **http://localhost:3001**.
Tu gestor de archivos MinIO lo encuentras en **http://localhost:9003**.
Si necesitas ver la base de datos de forma gráfica, lanza **docker exec -it gestion-backend npx prisma studio** y entra a **http://localhost:5555**.
