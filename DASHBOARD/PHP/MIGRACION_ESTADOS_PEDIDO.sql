-- Ejecutar una sola vez en la base de datos pizzeria.
-- Las ventas existentes se consideran cobradas para no enviarlas a la cola de reparto.
ALTER TABLE ventas
    ADD COLUMN estado_pedido ENUM('pendiente', 'entregado', 'cobrado', 'cancelado')
        NOT NULL DEFAULT 'cobrado',
    ADD COLUMN motivo_cancelacion TEXT NULL,
    ADD COLUMN id_empleado_cancelacion INT NULL,
    ADD COLUMN fecha_estado DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;
