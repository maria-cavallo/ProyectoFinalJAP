Como levantar el servidor local

Instalar dependencias
Abri una terminal dentro de la carpeta del proyecto y ejecuta:

```bash
npm install
```

Iniciar el servidor
Una vez instaladas las dependencias, arranca el servidor con:

```bash
node index.js
```

Si tu archivo principal tiene otro nombre, reemplazalo por ese, por ejemplo:

```bash
node server.js
```

Servidor corriendo
Cuando inicie, podrás acceder a:

http://localhost:3000

Usar con tu frontend
En el frontend, asegurate de que las rutas usen tu servidor local, por ejemplo:

http://localhost:3000/api/...
