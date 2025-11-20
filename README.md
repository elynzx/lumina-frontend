# Lumina Eventos – Frontend

Aplicación web desarrollada para el Sistema de alquiler de locales para eventos, encargada de proporcionar una interfaz de usuario moderna, intuitiva y responsiva para clientes y administradores.

---

## Descripción

El frontend de **Lumina Eventos** es la interfaz visual que permite a los usuarios interactuar con la plataforma. Está diseñado para ofrecer una experiencia fluida y eficiente, permitiendo a los clientes buscar, reservar y gestionar locales para eventos (matrimonios, cumpleaños, conferencias, etc.), mientras que los administradores pueden gestionar el catálogo de locales, mobiliario, clientes y reservas. 

La aplicación está construida siguiendo principios de diseño modular y buenas prácticas de desarrollo, utilizando React y TypeScript para garantizar escalabilidad, mantenibilidad y rendimiento.

---

## Características Principales

### Para Clientes:
- Registro y autenticación con JWT.
- Búsqueda de locales con filtros avanzados (distrito, tipo de evento, aforo, precio).
- Reserva de locales con selección de fecha y hora.
- Selección de mobiliario adicional (sillas, mesas, luces).
- Proceso de pago simulado para futura integración (Pago con tarjeta, transferencia y PagoEfectivo).
- Descarga de comprobantes en PDF.
- Gestión de perfil personal (actualización de datos, visualización de reservas).

### Para Administradores:
- CRUD completo de locales.
- CRUD completo de mobiliario.
- Gestión de clientes.
- Visualización y gestión de reservas.
- Dashboard con estadísticas clave.
- Cambio de estados (locales, reservas).

---

## Tecnologías Utilizadas

### Frontend:
- **React**: Biblioteca para la construcción de interfaces de usuario.
- **TypeScript**: Tipado estático para mayor seguridad y mantenibilidad.
- **Vite**: Herramienta de construcción rápida y moderna.
- **Zustand**: Gestión de estado global.
- **Tailwind CSS**: Framework para diseño responsivo.
- **react-hook-form**: Manejo de formularios reactivos con validaciones.
- **fetch API**: Consumo de APIs RESTful.
- **React Router**: Sistema de rutas dinámico y protegido por roles.

### Dependencias principales:
- react
- react-router-dom
- zustand
- clsx
- react-hook-form
- tailwindcss

---

## Seguridad
- **Autenticación**: Implementada con JWT (JSON Web Token) para proteger las rutas y garantizar el acceso seguro.
- **Roles**: Protección de rutas y funcionalidades según el rol del usuario (CLIENTE, ADMIN).
- **Validaciones**: Validaciones en formularios para garantizar la integridad de los datos ingresados por los usuarios.
- **CORS**: Configurado en el backend para permitir solicitudes desde el frontend.

---

## Arquitectura del Proyecto

El proyecto sigue una arquitectura modular basada en Atomic Design, lo que permite una alta reutilización de componentes y facilita el mantenimiento.

### Estructura de Carpetas:
```plaintext
src/
├── api/               # Configuración de endpoints y lógica de API
├── assets/            # Recursos estáticos como imágenes y fuentes
├── components/        # Componentes reutilizables
│   ├── atomic/        # Componentes básicos (botones, inputs, etc.)
│   ├── molecules/     # Combinaciones simples de componentes
│   ├── organism/      # Componentes complejos (formularios, modales, etc.)
├── constants/         # Constantes globales
├── hooks/             # Hooks personalizados
│   └── api/           # Hooks para consumir APIs
├── pages/             # Páginas principales (Home, Login, Payment, etc.)
├── store/             # Gestión del estado global con Zustand
├── styles/            # Archivos CSS y configuración de Tailwind
├── types/             # Definiciones de tipos de TypeScript
├── utils/             # Funciones utilitarias (validaciones, alertas, etc.)
```

---

## Flujo de Trabajo

1. **Inicio**:
   - El usuario accede a la página principal y explora el catálogo de productos.
2. **Selección de Productos**:
   - El usuario selecciona un producto y lo añade al carrito.
3. **Formulario de Reserva**:
   - El usuario completa un formulario con detalles como fecha, cantidad de personas, etc.
4. **Pago**:
   - El usuario realiza el pago a través de una pasarela.
5. **Confirmación**:
   - El sistema confirma la reserva y envía una notificación.

---

## Diseño Responsivo
- Se utiliza **Tailwind CSS** para implementar un diseño moderno y adaptable a tablets y dispositivos móviles.

---

## Integración con el Backend
- El frontend consume los servicios RESTful proporcionados por el backend de **Lumina Eventos**.
- Los endpoints están centralizados en un archivo de configuración (`src/api/config/endpoints.ts`) para facilitar el mantenimiento y la reutilización.

### Propuesta de Diseño

A continuación, se muestran las imágenes de la propuesta de diseño para la plataforma **Lumina Eventos**:

1. **Home**  
   ![Home](./src/assets/images/design/Home.png)

2. **Detalles del Producto**  
   ![Detalles del Producto](./src/assets/images/design/Product%20details.png)

3. **Paso 1: Mis Datos**  
   ![Paso 1: Mis Datos](./src/assets/images/design/Paso%201-%20Mis%20Datos.png)

4. **Paso 2**  
   ![Paso 2](./src/assets/images/design/Paso%202.png)

5. **Confirmación de reserva**  
   ![Paso 4](./src/assets/images/design/Paso%204.png)
