# Guion — Video de Demostración: Mi Escuela Primero

**Duración total estimada:** ~9 minutos  
**URL producción:** https://miescuelaprimero.onrender.com  
**Abrir antes de grabar:** terminal con backend corriendo, Chrome con la app, TablePlus/DBeaver conectado a SharkASP

---

## Segmento 1 — Flujo público (~3 min)

### En pantalla
Abrir Chrome en `https://miescuelaprimero.onrender.com`

### Guion hablado

> "Bienvenidos. Este es Mi Escuela Primero, una plataforma desarrollada para Mexicanos Primero Jalisco que conecta a donantes con escuelas primarias públicas del estado."

Señalar las estadísticas del hero (escuelas, necesidades, donadores):

> "En la parte superior vemos las estadísticas en tiempo real que se alimentan directamente de la base de datos. Estas no son valores estáticos — vienen de una API que consulta MySQL."

Desplazarse hacia abajo para ver el catálogo de escuelas:

> "Aquí está el catálogo de escuelas. Cada tarjeta muestra el nombre de la escuela, el municipio, el nivel educativo, y una barra de progreso que refleja el porcentaje de necesidades cubiertas."

Usar el sidebar para filtrar por municipio (elegir uno, por ejemplo "Guadalajara"):

> "El sidebar permite filtrar por municipio, categoría de necesidad y nivel educativo. Los filtros se aplican en el cliente cuando hay múltiples valores, y como parámetros de query a la API cuando es un solo valor — para aprovechar el índice en base de datos."

Click en una tarjeta de escuela para abrir el modal de detalle:

> "Al abrir una escuela vemos el detalle completo: dirección, CCT, número de estudiantes y personal, y el desglose de necesidades por categoría."

Señalar la sección de necesidades (Material, Infraestructura, Formación, Salud):

> "Las necesidades están clasificadas en cuatro categorías. El estado puede ser 'Aún no cubierto', 'Cubierto parcialmente', o 'Cubierto'. Esto permite a los donantes ver exactamente en qué pueden apoyar."

Hacer click en "Quiero apoyar" para abrir el formulario de donativo:

> "El formulario de donativo es un flujo de tres pasos. Primero capturamos los datos de contacto del donante."

Llenar paso 1 (nombre, email, teléfono):

> "Incluimos validación en cada paso antes de avanzar — si falta algún campo requerido, el formulario no avanza."

Avanzar al paso 2 — tipo de donativo (seleccionar, por ejemplo, "Material / Mobiliario"):

> "En el segundo paso el donante elige el tipo de apoyo que quiere dar. Dependiendo de la selección aparecen campos condicionales distintos."

Avanzar al paso 3 — confirmación. Mostrar resumen:

> "El tercer paso es un resumen para que el donante confirme antes de enviar. Al confirmar, el lead se guarda en base de datos y el equipo de MPJ puede darle seguimiento desde el panel de administración."

Enviar el formulario y mostrar pantalla de éxito:

> "Listo — el lead quedó registrado. Esto lo vemos en un momento desde el admin."

---

## Segmento 2 — Base de datos en vivo (~2 min)

### En pantalla
Abrir TablePlus (o DBeaver) conectado a SharkASP MySQL. Mostrar las tablas: `schools`, `school_needs`, `leads`, `stats`.

### Guion hablado

> "Nuestra base de datos está hospedada en SharkASP, un servidor MySQL administrado. Aquí podemos ver las tablas principales."

Abrir tabla `schools` — mostrar filas con datos reales:

> "La tabla schools contiene los datos de todas las escuelas: municipio, plantel, CCT, nivel educativo, modalidad, turno y la URL de imagen. Cada escuela tiene un ID que enlaza a sus necesidades."

Abrir tabla `school_needs`:

> "school_needs guarda cada necesidad ligada a su escuela con categoría, subcategoría, propuesta, cantidad y estado de cobertura."

Hacer una query rápida en el cliente SQL:

```sql
SELECT s.escuela, COUNT(n.id) AS necesidades, 
       SUM(n.estado = 'Cubierto') AS cubiertas
FROM schools s
LEFT JOIN school_needs n ON n.school_id = s.id
GROUP BY s.id
LIMIT 5;
```

> "Un join rápido nos da cuántas necesidades tiene cada escuela y cuántas ya están cubiertas. Esta lógica es la misma que usa la API para calcular el porcentaje de la barra de progreso."

Abrir tabla `leads` y mostrar el lead que acaba de llegar:

> "Y aquí vemos el lead que acaba de enviar el formulario — nombre, email, tipo de donativo y la escuela de destino que seleccionó."

---

## Segmento 3 — Flujo admin / upload (~3 min)

### En pantalla
Regresar a `https://miescuelaprimero.onrender.com`

### Guion hablado

> "Ahora veamos el panel de administración. El acceso está protegido por contraseña con JWT."

Click en el ícono de candado en el navbar, ingresar la contraseña de admin:

> "El administrador ingresa su contraseña aquí. El token JWT se almacena en localStorage y se envía en cada petición protegida."

Mostrar el panel admin — cuatro pestañas: Upload, Stats, Footer, Schools:

> "El admin tiene cuatro módulos. Empezamos con Upload — la funcionalidad principal para cargar datos."

**Pestaña Upload:**

Arrastrar el archivo `excel_format.xlsx` al área de drop:

> "El sistema espera un archivo XLSX con dos hojas específicas: 'Datos de las escuelas' y 'Necesidades'. El backend valida la estructura antes de procesar."

Mostrar el resultado del upload (escuelas procesadas, necesidades procesadas):

> "El resultado muestra cuántas escuelas se procesaron, cuántas necesidades se insertaron o reemplazaron, y si hubo filas con error. El algoritmo de matching hace fuzzy search para asociar necesidades con escuelas aunque los nombres difieran ligeramente."

**Pestaña Schools:**

> "En la pestaña Schools el administrador puede buscar, ver y editar cualquier escuela directamente desde la interfaz."

Click en editar una escuela — mostrar modal de edición, cambiar un campo, guardar:

> "Los cambios se persisten inmediatamente via PUT a la API."

**Pestaña Stats:**

> "En Stats el admin puede actualizar los números que aparecen en el hero de la página principal."

Cambiar un valor de stat y guardar:

> "Al guardar, la próxima vez que un usuario cargue la página, verá el número actualizado."

**Pestaña Leads:**

(Si existe — si no, volver a la DB):

> "Y los leads capturados por el formulario están disponibles aquí para que el equipo de MPJ les dé seguimiento."

---

## Segmento 4 — Tests automatizados (~1 min)

### En pantalla
Abrir terminal. `cd` al directorio `backend`.

### Guion hablado

> "El backend tiene una suite de tests con Jest. Tenemos tests unitarios para la lógica de negocio y tests de integración para los endpoints de la API."

Correr:
```bash
npm run test:unit
```

Mostrar output — todos verdes:

> "Los tests unitarios validan cosas como el algoritmo de matching de nombres de escuelas, la normalización de acentos, y la lógica de parsing del Excel."

Correr:
```bash
npm run test:integration
```

Mostrar output:

> "Los tests de integración levantan un servidor real y hacen peticiones HTTP contra él para verificar que los endpoints devuelven los códigos y payloads correctos."

Mostrar cobertura o simplemente el summary final de Jest:

> "Con esto cerramos la demostración. Mi Escuela Primero está desplegada en producción con backend en Koyeb, frontend en Render, y base de datos MySQL en SharkASP — todo corriendo ahora mismo en las URLs que ven en pantalla."

---

## Notas de producción

- Grabar en 1080p mínimo
- Silenciar notificaciones del sistema antes de grabar
- Si el backend está en cold start en Koyeb, esperar ~15 s a que responda la primera petición
- Tener el archivo `excel_format.xlsx` listo en el Desktop para el drag-and-drop
- El lead del formulario aparece en DB inmediatamente — no necesita refresh manual
