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

export interface Mobiliario {
  idMobiliario: number;
  nombre: string;
  descripcion: string;
  stockTotal: number;
  precioUnitario: number;
}

export interface FotoMobiliario {
  idFoto: number;
  idMobiliario: number;
  urlFoto: string;
  descripcion: string;
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
  fotosMobiliario: FotoMobiliario[];
  metodosPago: MetodoPago[];
  reservas: Reserva[];
  reservaMobiliario: ReservaMobiliario[];
  pagos: Pago[];
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
    { "idDistrito": 1, "nombreDistrito": "Miraflores"},
    { "idDistrito": 2, "nombreDistrito": "San Isidro"},
    { "idDistrito": 3, "nombreDistrito": "Surco"},
    { "idDistrito": 4, "nombreDistrito": "La Molina"},
  ],
  "locales": [
    { "idLocal": 1, "nombreLocal": "Salon Real", "direccion": "Av. Pardo 123", "idDistrito": 1, "aforoMaximo": 200, "precioHora": 500.00, "descripcion": "Salón elegante para bodas", "estado": "DISPONIBLE" },
    { "idLocal": 2, "nombreLocal": "Terraza Verde", "direccion": "Jr. Olivos 456", "idDistrito": 2, "aforoMaximo": 100, "precioHora": 300.00, "descripcion": "Ideal para eventos sociales", "estado": "DISPONIBLE" },
    { "idLocal": 3, "nombreLocal": "Centro Empresarial", "direccion": "Av. Javier Prado 789", "idDistrito": 3, "aforoMaximo": 500, "precioHora": 1000.00, "descripcion": "Centro de convenciones", "estado": "DISPONIBLE" },
    { "idLocal": 4, "nombreLocal": "Casa Colonial", "direccion": "Calle San Martín 321", "idDistrito": 4, "aforoMaximo": 80, "precioHora": 250.00, "descripcion": "Ambiente colonial", "estado": "NO_DISPONIBLE" },
  ],
  "fotosLocales": [
    { "idFoto": 1, "idLocal": 1, "urlFoto": "https://cdn0.matrimonio.com.pe/vendor/5326/3_2/1280/jpeg/whatsapp-image-2023-03-07-at-12-29-44-4_11_115326-167838324481472.jpeg", "descripcion": "Vista principal" },
    { "idFoto": 2, "idLocal": 2, "urlFoto": "https://cdn0.matrimonio.com.pe/vendor/5326/3_2/1280/jpeg/whatsapp-image-2023-03-07-at-12-29-44-4_11_115326-167838324481472.jpeg", "descripcion": "Decoración interior" },
    { "idFoto": 3, "idLocal": 3, "urlFoto": "https://cdn0.matrimonio.com.pe/vendor/5326/3_2/1280/jpeg/whatsapp-image-2023-03-07-at-12-29-44-4_11_115326-167838324481472.jpeg", "descripcion": "Vista de la terraza" },
    { "idFoto": 4, "idLocal": 4, "urlFoto": "https://cdn0.matrimonio.com.pe/vendor/5326/3_2/1280/jpeg/whatsapp-image-2023-03-07-at-12-29-44-4_11_115326-167838324481472.jpeg", "descripcion": "Salón de conferencias" },
  ],
  "tiposEvento": [
    { "idTipoEvento": 1, "nombreTipo": "Boda", "descripcion": "Eventos matrimoniales" },
    { "idTipoEvento": 2, "nombreTipo": "Conferencia", "descripcion": "Charlas empresariales" },
    { "idTipoEvento": 3, "nombreTipo": "Cumpleaños", "descripcion": "Fiestas de cumpleaños" },
    { "idTipoEvento": 4, "nombreTipo": "Concierto", "descripcion": "Eventos musicales" },
  ],
  "localTipoEvento": [
    { "idLocal": 1, "idTipoEvento": 1 },
    { "idLocal": 1, "idTipoEvento": 3 },
    { "idLocal": 2, "idTipoEvento": 3 },
    { "idLocal": 3, "idTipoEvento": 2 },
    { "idLocal": 4, "idTipoEvento": 5 }
  ],
  "mobiliario": [
    { "idMobiliario": 1, "nombre": "Sillas", "descripcion": "Sillas de plástico", "stockTotal": 200, "precioUnitario": 5.00 },
    { "idMobiliario": 2, "nombre": "Mesas", "descripcion": "Mesas rectangulares", "stockTotal": 50, "precioUnitario": 20.00 },
    { "idMobiliario": 3, "nombre": "Luces", "descripcion": "Luces decorativas LED", "stockTotal": 100, "precioUnitario": 15.00 },
    { "idMobiliario": 4, "nombre": "Parlantes", "descripcion": "Equipo de sonido", "stockTotal": 20, "precioUnitario": 100.00 },
    { "idMobiliario": 5, "nombre": "Carpas", "descripcion": "Carpas para exteriores", "stockTotal": 10, "precioUnitario": 200.00 }
  ],
  "fotosMobiliario": [
    { "idFoto": 1, "idMobiliario": 1, "urlFoto": "sillas.jpg", "descripcion": "Sillas blancas" },
    { "idFoto": 2, "idMobiliario": 2, "urlFoto": "mesas.jpg", "descripcion": "Mesas grandes" },
    { "idFoto": 3, "idMobiliario": 3, "urlFoto": "luces.jpg", "descripcion": "Luces LED" },
    { "idFoto": 4, "idMobiliario": 4, "urlFoto": "parlantes.jpg", "descripcion": "Sistema de sonido" },
    { "idFoto": 5, "idMobiliario": 5, "urlFoto": "carpas.jpg", "descripcion": "Carpa para eventos" }
  ],
  "metodosPago": [
    { "idMetodoPago": 1, "nombreMetodo": "Tarjeta de Crédito", "descripcion": "Visa, MasterCard" },
    { "idMetodoPago": 2, "nombreMetodo": "Transferencia", "descripcion": "Depósito bancario" },
    { "idMetodoPago": 3, "nombreMetodo": "Yape", "descripcion": "Pago con celular" },
    { "idMetodoPago": 4, "nombreMetodo": "Plin", "descripcion": "Pago móvil" },
    { "idMetodoPago": 5, "nombreMetodo": "Efectivo", "descripcion": "Pago en caja" }
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
  ]
}
