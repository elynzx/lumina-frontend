export type EstadoLocal = "DISPONIBLE" | "NO_DISPONIBLE";
export type EstadoReserva = "Confirmada" | "Pendiente" | "Cancelada";
export type EstadoPago = "Pagado" | "Pendiente" | "Fallido";

export interface Rol {
  idRol: number;
  nombreRol: string;
  descripcion: string;
}

export interface Usuario {
  idUsuario: number;
  nombre: string;
  apellido: string;
  dni: string;
  celular: string;
  email: string;
  contrasena: string;
  idRol: number;
}

export interface Distrito {
  idDistrito: number;
  nombreDistrito: string;
}

export interface Local {
  idLocal: number;
  nombreLocal: string;
  direccion: string;
  idDistrito: number;
  aforoMaximo: number;
  precioHora: number;
  descripcion: string;
  estado: EstadoLocal;
}

export interface FotoLocal {
  idFoto: number;
  idLocal: number;
  urlFoto: string;
  descripcion: string;
}

export interface TipoEvento {
  idTipoEvento: number;
  nombreTipo: string;
  descripcion: string;
}

export interface LocalTipoEvento {
  idLocal: number;
  idTipoEvento: number;
}

export interface ReviewLocal {
  idLocal: number;
  promedio: number;
  totalReviews: number;
}

export interface UbicacionLocal {
  idLocal: number;
  latitud: number;
  longitud: number;
  urlGoogleMaps: string;
}

export interface Mobiliario {
  idMobiliario: number;
  nombre: string;
  descripcion: string;
  stockTotal: number;
  precioUnitario: number;
  urlFoto: string;
}

export interface MetodoPago {
  idMetodoPago: number;
  nombreMetodo: string;
  descripcion: string;
}

export interface Reserva {
  idReserva: number;
  idUsuario: number;
  idLocal: number;
  idTipoEvento: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  cantidadPersonas: number;
  costoLocal: number;
  costoMobiliario: number;
  estado: EstadoReserva;
}

export interface ReservaMobiliario {
  idReserva: number;
  idMobiliario: number;
  cantidad: number;
  precioUnitario: number;
}

export interface Pago {
  idPago: number;
  idReserva: number;
  idMetodoPago: number;
  monto: number;
  estado: EstadoPago;
  codigoConfirmacion: string | null;
  comprobanteUrl: string | null;
}

export interface DatabaseData {
  roles: Rol[];
  usuarios: Usuario[];
  distritos: Distrito[];
  locales: Local[];
  fotosLocales: FotoLocal[];
  tiposEvento: TipoEvento[];
  localTipoEvento: LocalTipoEvento[];
  mobiliario: Mobiliario[];
  metodosPago: MetodoPago[];
  reservas: Reserva[];
  reservaMobiliario: ReservaMobiliario[];
  pagos: Pago[];
  reviewsLocales: ReviewLocal[];
  ubicacionesLocales: UbicacionLocal[];
}

export const data: DatabaseData = {
  "roles": [
    { "idRol": 1, "nombreRol": "Administrador", "descripcion": "Gestiona el sistema" },
    { "idRol": 2, "nombreRol": "Cliente", "descripcion": "Realiza reservas" },
    { "idRol": 3, "nombreRol": "Operador", "descripcion": "Atiende solicitudes" },
    { "idRol": 4, "nombreRol": "Gerente", "descripcion": "Supervisa operaciones" },
    { "idRol": 5, "nombreRol": "Soporte", "descripcion": "Brinda asistencia técnica" }
  ],
  "usuarios": [
    { "idUsuario": 1, "nombre": "Juan", "apellido": "Pérez", "dni": "12345678", "celular": "987654321", "email": "juan@example.com", "contrasena": "hashedpass1", "idRol": 2 },
    { "idUsuario": 2, "nombre": "María", "apellido": "Gómez", "dni": "23456789", "celular": "912345678", "email": "maria@example.com", "contrasena": "hashedpass2", "idRol": 2 },
    { "idUsuario": 3, "nombre": "Carlos", "apellido": "Ramírez", "dni": "34567890", "celular": "998877665", "email": "carlos@example.com", "contrasena": "hashedpass3", "idRol": 1 },
    { "idUsuario": 4, "nombre": "Ana", "apellido": "Lopez", "dni": "45678901", "celular": "934567890", "email": "ana@example.com", "contrasena": "hashedpass4", "idRol": 3 },
    { "idUsuario": 5, "nombre": "Luis", "apellido": "Torres", "dni": "56789012", "celular": "976543210", "email": "luis@example.com", "contrasena": "hashedpass5", "idRol": 2 }
  ],
  "distritos": [
    { "idDistrito": 1, "nombreDistrito": "Miraflores" },
    { "idDistrito": 2, "nombreDistrito": "San Isidro" },
    { "idDistrito": 3, "nombreDistrito": "Surco" },
    { "idDistrito": 4, "nombreDistrito": "La Molina" }
  ],
  "locales": [
    {
      "idLocal": 1,
      "nombreLocal": "Salon Real",
      "direccion": "Av. Pardo 123",
      "idDistrito": 1,
      "aforoMaximo": 200,
      "precioHora": 500.00,
      "descripcion": "Local de 800m² ubicado en Miraflores. Cuenta con salón principal amplio, 3 ambientes diferenciados, 4 baños completos, cocina industrial, estacionamiento privado, sistema de aire acondicionado, iluminación LED regulable, sonido profesional, acceso para personas con discapacidad y seguridad 24 horas.",
      "estado": "DISPONIBLE"
    },
    {
      "idLocal": 2,
      "nombreLocal": "Terraza Verde",
      "direccion": "Jr. Olivos 456",
      "idDistrito": 2,
      "aforoMaximo": 100,
      "precioHora": 300.00,
      "descripcion": "Local de 450m² en San Isidro con ambiente al aire libre. Terraza con jardín tropical, toldo retráctil, 2 baños modernos, área de bar, decoración natural, WiFi de alta velocidad, iluminación ambiental, estacionamiento para 15 vehículos y acceso fácil desde la avenida principal.",
      "estado": "DISPONIBLE"
    },
    {
      "idLocal": 3,
      "nombreLocal": "Centro Empresarial",
      "direccion": "Av. Javier Prado 789",
      "idDistrito": 3,
      "aforoMaximo": 500,
      "precioHora": 1000.00,
      "descripcion": "Centro de convenciones de 2,500m² en Surco. Múltiples salones modulables, 8 baños de lujo, zona de estacionamiento techado (100 espacios), cocina comercial, sala VIP, paneles audiovisuales 4K, sonido envolvente profesional, seguridad biométrica, conexión de fibra óptica y servicio de catering interno.",
      "estado": "DISPONIBLE"
    },
    {
      "idLocal": 4,
      "nombreLocal": "Casa Colonial",
      "direccion": "Calle San Martín 321",
      "idDistrito": 4,
      "aforoMaximo": 80,
      "precioHora": 250.00,
      "descripcion": "Casona colonial restaurada de 350m² en La Molina. Arquitectura tradicional, 3 salones temáticos, 2 baños elegantes, patio interno con fuente, jardín decorativo, parqueadero privado (10 espacios), chimenea funcional, iluminación vintage, ambiente íntimo y acogedor, ideal para eventos exclusivos.",
      "estado": "NO_DISPONIBLE"
    }
  ],
  "fotosLocales": [
    { "idFoto": 1, "idLocal": 1, "urlFoto": "https://welcomepei.com/editorial/peis-most-unique-wedding-venues/pei-brewing-company-wedding/", "descripcion": "Vista principal" },
    { "idFoto": 2, "idLocal": 1, "urlFoto": "https://cdn0.matrimonio.com.pe/vendor/5326/3_2/1280/jpeg/whatsapp-image-2023-03-07-at-12-29-44-4_11_115326-167838324481472.jpeg", "descripcion": "Vista interior" },
    { "idFoto": 3, "idLocal": 1, "urlFoto": "https://cdn0.matrimonio.com.pe/vendor/5326/3_2/1280/jpeg/whatsapp-image-2023-03-07-at-12-29-44-4_11_115326-167838324481472.jpeg", "descripcion": "Vista lateral" },
    { "idFoto": 4, "idLocal": 2, "urlFoto": "https://welcomepei.com/editorial/peis-most-unique-wedding-venues/pei-brewing-company-wedding/", "descripcion": "Vista principal" },
    { "idFoto": 5, "idLocal": 3, "urlFoto": "https://cdn0.matrimonio.com.pe/vendor/5326/3_2/1280/jpeg/whatsapp-image-2023-03-07-at-12-29-44-4_11_115326-167838324481472.jpeg", "descripcion": "Decoración interior" },
    { "idFoto": 6, "idLocal": 4, "urlFoto": "https://cdn0.matrimonio.com.pe/vendor/5326/3_2/1280/jpeg/whatsapp-image-2023-03-07-at-12-29-44-4_11_115326-167838324481472.jpeg", "descripcion": "Vista de la terraza" }
  ],
  "tiposEvento": [
    { "idTipoEvento": 1, "nombreTipo": "Boda", "descripcion": "Eventos matrimoniales" },
    { "idTipoEvento": 2, "nombreTipo": "Conferencia", "descripcion": "Charlas empresariales" },
    { "idTipoEvento": 3, "nombreTipo": "Cumpleaños", "descripcion": "Fiestas de cumpleaños" },
    { "idTipoEvento": 4, "nombreTipo": "Concierto", "descripcion": "Eventos musicales" }
  ],
  "localTipoEvento": [
    { "idLocal": 1, "idTipoEvento": 1 },
    { "idLocal": 1, "idTipoEvento": 3 },
    { "idLocal": 2, "idTipoEvento": 3 },
    { "idLocal": 3, "idTipoEvento": 2 },
    { "idLocal": 4, "idTipoEvento": 1 }
  ],
  "mobiliario": [
    { "idMobiliario": 1, "nombre": "Sillas", "descripcion": "Sillas de metal", "stockTotal": 200, "precioUnitario": 5.00, "urlFoto": "https://reimse.mx/wp-content/uploads/2019/09/tiffany-fierro-800x800.jpg" },
    { "idMobiliario": 2, "nombre": "Mesas", "descripcion": "Mesa circular de 1.80m", "stockTotal": 50, "precioUnitario": 20.00, "urlFoto": "https://www.vivoeventos.cl/wp-content/uploads/2023/09/Mesa-redonda-18-metros.webp" },
    { "idMobiliario": 3, "nombre": "Luces", "descripcion": "Luces decorativas LED", "stockTotal": 100, "precioUnitario": 15.00, "urlFoto": "https://via.placeholder.com/150?text=Luces" },
    { "idMobiliario": 4, "nombre": "Parlantes", "descripcion": "Equipo de sonido", "stockTotal": 20, "precioUnitario": 100.00, "urlFoto": "https://via.placeholder.com/150?text=Parlantes" },
    { "idMobiliario": 5, "nombre": "Carpas", "descripcion": "Carpas para exteriores", "stockTotal": 10, "precioUnitario": 200.00, "urlFoto": "https://via.placeholder.com/150?text=Carpas" }
  ],
  "metodosPago": [
    { "idMetodoPago": 1, "nombreMetodo": "Tarjeta de Crédito/Débito", "descripcion": "Visa, MasterCard, Amex" },
    { "idMetodoPago": 2, "nombreMetodo": "Transferencia Bancaria", "descripcion": "Depósito o transferencia" },
    { "idMetodoPago": 3, "nombreMetodo": "PagoEfectivo", "descripcion": "Pago en efectivo con CIP" },
    { "idMetodoPago": 4, "nombreMetodo": "Yape", "descripcion": "Pago con celular" },
    { "idMetodoPago": 5, "nombreMetodo": "Plin", "descripcion": "Pago móvil" }
  ],
  "reservas": [
    { "idReserva": 1, "idUsuario": 1, "idLocal": 1, "idTipoEvento": 1, "fecha": "2025-10-15", "horaInicio": "18:00:00", "horaFin": "23:00:00", "cantidadPersonas": 150, "costoLocal": 2500.00, "costoMobiliario": 300.00, "estado": "Confirmada" },
    { "idReserva": 2, "idUsuario": 2, "idLocal": 2, "idTipoEvento": 3, "fecha": "2025-11-05", "horaInicio": "14:00:00", "horaFin": "19:00:00", "cantidadPersonas": 80, "costoLocal": 1500.00, "costoMobiliario": 200.00, "estado": "Pendiente" },
    { "idReserva": 3, "idUsuario": 3, "idLocal": 3, "idTipoEvento": 2, "fecha": "2025-09-30", "horaInicio": "09:00:00", "horaFin": "17:00:00", "cantidadPersonas": 300, "costoLocal": 8000.00, "costoMobiliario": 1000.00, "estado": "Confirmada" },
    { "idReserva": 4, "idUsuario": 4, "idLocal": 5, "idTipoEvento": 5, "fecha": "2025-12-20", "horaInicio": "16:00:00", "horaFin": "22:00:00", "cantidadPersonas": 100, "costoLocal": 2400.00, "costoMobiliario": 400.00, "estado": "Pendiente" },
    { "idReserva": 5, "idUsuario": 5, "idLocal": 1, "idTipoEvento": 3, "fecha": "2025-10-25", "horaInicio": "15:00:00", "horaFin": "20:00:00", "cantidadPersonas": 120, "costoLocal": 2000.00, "costoMobiliario": 250.00, "estado": "Cancelada" }
  ],
  "reservaMobiliario": [
    { "idReserva": 1, "idMobiliario": 1, "cantidad": 100, "precioUnitario": 5.00 },
    { "idReserva": 1, "idMobiliario": 2, "cantidad": 20, "precioUnitario": 20.00 },
    { "idReserva": 2, "idMobiliario": 1, "cantidad": 50, "precioUnitario": 5.00 },
    { "idReserva": 3, "idMobiliario": 4, "cantidad": 10, "precioUnitario": 100.00 },
    { "idReserva": 4, "idMobiliario": 5, "cantidad": 2, "precioUnitario": 200.00 }
  ],
  "pagos": [
    { "idPago": 1, "idReserva": 1, "idMetodoPago": 1, "monto": 2800.00, "estado": "Pagado", "codigoConfirmacion": "CONF12345", "comprobanteUrl": "pago1.pdf" },
    { "idPago": 2, "idReserva": 2, "idMetodoPago": 2, "monto": 1700.00, "estado": "Pendiente", "codigoConfirmacion": null, "comprobanteUrl": null },
    { "idPago": 3, "idReserva": 3, "idMetodoPago": 3, "monto": 9000.00, "estado": "Pagado", "codigoConfirmacion": "CONF67890", "comprobanteUrl": "pago3.pdf" },
    { "idPago": 4, "idReserva": 4, "idMetodoPago": 4, "monto": 2800.00, "estado": "Pendiente", "codigoConfirmacion": null, "comprobanteUrl": null },
    { "idPago": 5, "idReserva": 5, "idMetodoPago": 5, "monto": 2250.00, "estado": "Fallido", "codigoConfirmacion": "FAIL54321", "comprobanteUrl": "pago5.pdf" }
  ],
  "reviewsLocales": [
    { "idLocal": 1, "promedio": 4.8, "totalReviews": 128 },
    { "idLocal": 2, "promedio": 4.5, "totalReviews": 87 },
    { "idLocal": 3, "promedio": 4.9, "totalReviews": 215 },
    { "idLocal": 4, "promedio": 4.3, "totalReviews": 45 }
  ],

  "ubicacionesLocales": [
    {
      "idLocal": 1,
      "latitud": -12.111627,
      "longitud": -77.021151,
      "urlGoogleMaps": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.0461505005206!2d-77.02145!3d-12.111627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c8d4d4d4d4d5%3A0x0!2sMiraflores%2C%20Lima!5e0!3m2!1ses!2spe!4v1234567890"
    },
    {
      "idLocal": 2,
      "latitud": -12.091807,
      "longitud": -77.031641,
      "urlGoogleMaps": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.2168505005206!2d-77.031641!3d-12.091807!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c8a8a8a8a8a9%3A0x0!2sSan%20Isidro%2C%20Lima!5e0!3m2!1ses!2spe!4v1234567890"
    },
    {
      "idLocal": 3,
      "latitud": -12.055410,
      "longitud": -77.025319,
      "urlGoogleMaps": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.4875505005206!2d-77.025319!3d-12.055410!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c8d4d4d4d4d5%3A0x0!2sSurco%2C%20Lima!5e0!3m2!1ses!2spe!4v1234567890"
    },
    {
      "idLocal": 4,
      "latitud": -12.072038,
      "longitud": -76.984680,
      "urlGoogleMaps": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.3168505005206!2d-76.984680!3d-12.072038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c8d4d4d4d4d5%3A0x0!2sLa%20Molina%2C%20Lima!5e0!3m2!1ses!2spe!4v1234567890"
    }
  ]
}

