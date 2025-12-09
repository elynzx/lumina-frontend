# Correcciones para Backend - Dashboard Stats

## Problema
Las métricas `monthlyRevenue` y `currentPeriodReservations` están en 0 porque las queries buscan por `reservationDate` (fecha del evento) en lugar de `createdAt` (fecha de creación de la reserva).

## Solución

### 1. Actualizar ReservationRepository.java

Agregar estos dos métodos nuevos:

```java
@Query("SELECT COALESCE(SUM(r.totalCost), 0) FROM Reservation r " +
        "WHERE r.createdAt BETWEEN :startDate AND :endDate " +
        "AND r.status = :status")
BigDecimal sumTotalAmountByCreatedAtRangeAndStatus(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        @Param("status") ReservationStatus status
);

@Query("SELECT COUNT(r) FROM Reservation r " +
        "WHERE r.createdAt BETWEEN :startDate AND :endDate")
long countByCreatedAtRange(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
);
```

**IMPORTANTE**: Si `createdAt` es de tipo `LocalDateTime`, usa este formato en su lugar:

```java
@Query("SELECT COALESCE(SUM(r.totalCost), 0) FROM Reservation r " +
        "WHERE DATE(r.createdAt) BETWEEN :startDate AND :endDate " +
        "AND r.status = :status")
BigDecimal sumTotalAmountByCreatedAtRangeAndStatus(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        @Param("status") ReservationStatus status
);

@Query("SELECT COUNT(r) FROM Reservation r " +
        "WHERE DATE(r.createdAt) BETWEEN :startDate AND :endDate")
long countByCreatedAtRange(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
);
```

### 2. Actualizar DashboardService.java

En el método `getDashboardStats`, reemplazar estas líneas:

**ANTES:**
```java
// Ingresos del período actual
BigDecimal currentRevenue = reservationRepository.sumTotalAmountByDateRangeAndStatus(
        startDate, endDate, ReservationStatus.CONFIRMED
);

// ... (código del período anterior)

BigDecimal previousRevenue = reservationRepository.sumTotalAmountByDateRangeAndStatus(
        previousStartDate, previousEndDate, ReservationStatus.CONFIRMED
);

// Reservas del período actual
long currentReservations = reservationRepository.countByDateRange(startDate, endDate);

// Reservas del período anterior
long previousReservations = reservationRepository.countByDateRange(previousStartDate, previousEndDate);
```

**DESPUÉS:**
```java
// Ingresos del período actual
BigDecimal currentRevenue = reservationRepository.sumTotalAmountByCreatedAtRangeAndStatus(
        startDate, endDate, ReservationStatus.CONFIRMED
);

// Ingresos del período anterior (para calcular crecimiento)
LocalDate previousStartDate;
LocalDate previousEndDate = startDate.minusDays(1);

switch (period != null ? period : "month") {
    case "week":
        previousStartDate = previousEndDate.minusWeeks(1);
        break;
    case "year":
        previousStartDate = previousEndDate.minusYears(1);
        break;
    case "month":
    default:
        previousStartDate = previousEndDate.minusMonths(1);
        break;
}

BigDecimal previousRevenue = reservationRepository.sumTotalAmountByCreatedAtRangeAndStatus(
        previousStartDate, previousEndDate, ReservationStatus.CONFIRMED
);

// Reservas del período actual
long currentReservations = reservationRepository.countByCreatedAtRange(startDate, endDate);

// Reservas del período anterior
long previousReservations = reservationRepository.countByCreatedAtRange(previousStartDate, previousEndDate);
```

## Resumen de cambios en DashboardService.java

Solo necesitas cambiar **4 líneas** (líneas 58, 81, 87, 90):

**Línea 58** - Cambiar:
```java
reservationRepository.sumTotalAmountByDateRangeAndStatus(
```
Por:
```java
reservationRepository.sumTotalAmountByCreatedAtRangeAndStatus(
```

**Línea 81** - Cambiar:
```java
reservationRepository.sumTotalAmountByDateRangeAndStatus(
```
Por:
```java
reservationRepository.sumTotalAmountByCreatedAtRangeAndStatus(
```

**Línea 87** - Cambiar:
```java
long currentReservations = reservationRepository.countByDateRange(startDate, endDate);
```
Por:
```java
long currentReservations = reservationRepository.countByCreatedAtRange(startDate, endDate);
```

**Línea 90** - Cambiar:
```java
long previousReservations = reservationRepository.countByDateRange(previousStartDate, previousEndDate);
```
Por:
```java
long previousReservations = reservationRepository.countByCreatedAtRange(previousStartDate, previousEndDate);
```

## Explicación

- **reservationDate**: Es la fecha del evento (puede ser en el futuro)
- **createdAt**: Es la fecha cuando se creó la reserva (refleja cuando se hizo el negocio)

Para métricas de ingresos y conteo de reservas del período, necesitas usar `createdAt` porque quieres saber cuántas reservas se hicieron y cuánto ingreso se generó en ese período, independientemente de cuándo sea el evento.

## Verificación

Después de aplicar estos cambios:
1. Reinicia el backend
2. Recarga el dashboard en el frontend
3. Deberías ver los valores correctos en las cards de "Ingresos del Mes" y "Reservas del Mes"

---

## Fix Adicional: Gráfico de Mobiliario (Mesas y Sillas)

### Problema
El gráfico de mesas y sillas está contando la cantidad total (ej: 20 sillas = 20) en lugar de contar las reservas (ej: 20 sillas = 1 reserva).

### Solución

En `ReservationRepository.java`, reemplazar el método `findTopFurnitureByRequestCount()`:

**ANTES:**
```java
@Query("SELECT f.furnitureName, " +
        "CASE WHEN LOWER(f.furnitureName) LIKE '%catering%' " +
        "THEN COUNT(DISTINCT rf.reservation.reservationId) " +
        "ELSE SUM(rf.quantity) END as totalQuantity " +
        "FROM ReservationFurniture rf JOIN rf.furniture f " +
        "GROUP BY f.furnitureId, f.furnitureName " +
        "ORDER BY " +
        "CASE WHEN LOWER(f.furnitureName) LIKE '%catering%' " +
        "THEN COUNT(DISTINCT rf.reservation.reservationId) " +
        "ELSE SUM(rf.quantity) END DESC")
List<Object[]> findTopFurnitureByRequestCount();
```

**DESPUÉS:**
```java
@Query("SELECT f.furnitureName, " +
        "CASE " +
        "WHEN LOWER(f.furnitureName) LIKE '%silla%' OR LOWER(f.furnitureName) LIKE '%mesa%' " +
        "THEN COUNT(DISTINCT rf.reservation.reservationId) " +
        "WHEN LOWER(f.furnitureName) LIKE '%catering%' " +
        "THEN COUNT(DISTINCT rf.reservation.reservationId) " +
        "ELSE SUM(rf.quantity) END as totalQuantity " +
        "FROM ReservationFurniture rf JOIN rf.furniture f " +
        "GROUP BY f.furnitureId, f.furnitureName " +
        "ORDER BY " +
        "CASE " +
        "WHEN LOWER(f.furnitureName) LIKE '%silla%' OR LOWER(f.furnitureName) LIKE '%mesa%' " +
        "THEN COUNT(DISTINCT rf.reservation.reservationId) " +
        "WHEN LOWER(f.furnitureName) LIKE '%catering%' " +
        "THEN COUNT(DISTINCT rf.reservation.reservationId) " +
        "ELSE SUM(rf.quantity) END DESC")
List<Object[]> findTopFurnitureByRequestCount();
```

### Explicación

Ahora la query cuenta:
- **Mesas y Sillas**: Número de reservas que las solicitaron (no la cantidad total)
- **Catering**: Número de reservas que lo solicitaron
- **Otros servicios** (decoración, fotografía, etc.): Suma de cantidades

Esto hace que el gráfico muestre correctamente cuántas reservas solicitaron mesas/sillas, independientemente de la cantidad específica de cada una.
