# Project GPL - Gestión de Proyectos Labsol

Este es un proyecto **open source** elaborado específicamente para **gestionar y promover el desarrollo de los proyectos dentro de Labsol Zacatecas**. Está construido con un stack moderno y empaquetado para que cualquier desarrollador pueda contribuir sin romperse la cabeza configurando cosas.

**Requisitos previos**
Lo único que necesitas tener instalado en tu equipo es **Docker** y **Docker Compose**. De todo lo demás se encarga el entorno.

**Instrucciones de arranque**
Para levantar todo el changarro (base de datos, almacenamiento, backend y frontend), abre tu terminal en la raíz del proyecto y ejecuta **docker-compose -f docker-compose.dev.yml up -d --build**.

Una vez que los contenedores estén arriba, el siguiente paso es construir la estructura de la base de datos. Para hacer esto, corre el comando **docker exec -it gestion-backend npx prisma migrate deploy**.

Para no empezar con el sistema en blanco y poder probar todo, siembra los datos iniciales y tu usuario administrador ejecutando **docker exec -it gestion-backend npx prisma db seed**.

**Rutas de acceso local**
Tu plataforma web principal está lista en **http://localhost:9002**.
Tu API del backend está escuchando en **http://localhost:3001**.
Tu gestor de archivos MinIO lo encuentras en **http://localhost:9003**.
Si necesitas ver la base de datos de forma gráfica, lanza **docker exec -it gestion-backend npx prisma studio** y entra a **http://localhost:5555**.
s
