-- =============================================================================
-- Migration 009: Stored Procedures, Triggers y Views
-- Mi Escuela Primero — Mexicanos Primero Jalisco
-- =============================================================================

-- ===========================
-- DELIMITER change for SPs / Triggers
-- ===========================
DELIMITER $$

-- =============================================================================
-- STORED PROCEDURES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- sp_log_audit
-- Inserta un registro en audit_log. Sin transaction propia para que pueda ser
-- invocado desde triggers (que corren dentro de la transacción del DML padre).
-- -----------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_log_audit$$
CREATE PROCEDURE sp_log_audit(
    IN  p_admin_id    INT,
    IN  p_action      VARCHAR(100),
    IN  p_entity_type VARCHAR(100),
    IN  p_entity_id   INT,
    IN  p_changes     JSON
)
BEGIN
    INSERT INTO audit_log (admin_id, action, entity_type, entity_id, changes, created_at)
    VALUES (p_admin_id, p_action, p_entity_type, p_entity_id, p_changes, NOW());
END$$


-- -----------------------------------------------------------------------------
-- sp_update_lead_status
-- Actualiza el status de un donor_lead y registra el cambio en audit_log,
-- todo dentro de una transacción explícita.
-- Parámetros:
--   p_lead_id   — id del registro en donor_leads
--   p_new_status — 'nuevo' | 'contactado' | 'completado' | 'cancelado'
--   p_admin_id  — id del admin que hace el cambio (para audit)
-- -----------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_update_lead_status$$
CREATE PROCEDURE sp_update_lead_status(
    IN  p_lead_id    INT,
    IN  p_new_status ENUM('nuevo','contactado','completado','cancelado'),
    IN  p_admin_id   INT,
    OUT p_success    TINYINT,
    OUT p_message    VARCHAR(255)
)
BEGIN
    DECLARE v_old_status VARCHAR(50);
    DECLARE exit_handler TINYINT DEFAULT 0;

    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
        SET exit_handler = 1;
        SET p_success = 0;
        SET p_message = 'Error al actualizar el lead';
        ROLLBACK;
    END;

    START TRANSACTION;

    -- Leer estado actual
    SELECT status INTO v_old_status
    FROM donor_leads
    WHERE id = p_lead_id
    FOR UPDATE;

    IF v_old_status IS NULL THEN
        SET p_success = 0;
        SET p_message = CONCAT('Lead con id ', p_lead_id, ' no encontrado');
        ROLLBACK;
    ELSE
        -- Actualizar status
        UPDATE donor_leads
        SET status = p_new_status,
            updated_at = NOW()
        WHERE id = p_lead_id;

        -- Registrar en audit_log
        CALL sp_log_audit(
            p_admin_id,
            'UPDATE_LEAD_STATUS',
            'donor_leads',
            p_lead_id,
            JSON_OBJECT(
                'old_status', v_old_status,
                'new_status', p_new_status
            )
        );

        SET p_success = 1;
        SET p_message = CONCAT('Lead actualizado de "', v_old_status, '" a "', p_new_status, '"');

        IF exit_handler = 0 THEN
            COMMIT;
        END IF;
    END IF;
END$$


-- -----------------------------------------------------------------------------
-- sp_soft_delete_school
-- Marca una escuela como 'inactive' (soft delete), desactiva sus necesidades
-- y registra la operación en audit_log, todo en una transacción explícita.
-- Parámetros:
--   p_school_id — id de la escuela a desactivar
--   p_admin_id  — id del admin que realiza la operación
-- -----------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_soft_delete_school$$
CREATE PROCEDURE sp_soft_delete_school(
    IN  p_school_id INT,
    IN  p_admin_id  INT,
    OUT p_success   TINYINT,
    OUT p_message   VARCHAR(255)
)
BEGIN
    DECLARE v_escuela    VARCHAR(255);
    DECLARE v_municipio  VARCHAR(255);
    DECLARE v_needs_count INT DEFAULT 0;
    DECLARE exit_handler TINYINT DEFAULT 0;

    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
        SET exit_handler = 1;
        SET p_success = 0;
        SET p_message = 'Error interno al eliminar la escuela';
        ROLLBACK;
    END;

    START TRANSACTION;

    -- Verificar que la escuela existe y está activa
    SELECT escuela, municipio
    INTO v_escuela, v_municipio
    FROM schools
    WHERE id = p_school_id AND status = 'active'
    FOR UPDATE;

    IF v_escuela IS NULL THEN
        SET p_success = 0;
        SET p_message = CONCAT('Escuela con id ', p_school_id, ' no encontrada o ya inactiva');
        ROLLBACK;
    ELSE
        -- Soft-delete: marcar escuela como inactiva
        UPDATE schools
        SET status = 'inactive',
            updated_at = NOW()
        WHERE id = p_school_id;

        -- Contar necesidades afectadas para el log
        SELECT COUNT(*) INTO v_needs_count
        FROM school_needs
        WHERE school_id = p_school_id;

        -- Registrar en audit_log
        CALL sp_log_audit(
            p_admin_id,
            'SOFT_DELETE_SCHOOL',
            'schools',
            p_school_id,
            JSON_OBJECT(
                'escuela',        v_escuela,
                'municipio',      v_municipio,
                'needs_archived', v_needs_count
            )
        );

        SET p_success = 1;
        SET p_message = CONCAT('Escuela "', v_escuela, '" desactivada. ', v_needs_count, ' necesidades archivadas.');

        IF exit_handler = 0 THEN
            COMMIT;
        END IF;
    END IF;
END$$


-- -----------------------------------------------------------------------------
-- sp_upsert_school_with_needs
-- Inserta o actualiza una escuela (por escuela+municipio) y reemplaza
-- todas sus necesidades de una sola vez. Ideal para el flujo de Upload XLSX.
-- Toda la operación ocurre en una transacción explícita; si cualquier paso
-- falla se hace ROLLBACK completo.
-- -----------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_upsert_school_with_needs$$
CREATE PROCEDURE sp_upsert_school_with_needs(
    -- Datos de la escuela
    IN  p_municipio        VARCHAR(255),
    IN  p_plantel          VARCHAR(255),
    IN  p_escuela          VARCHAR(255),
    IN  p_personal_escolar INT,
    IN  p_estudiantes      INT,
    IN  p_nivel_educativo  VARCHAR(100),
    IN  p_cct              VARCHAR(50),
    IN  p_modalidad        VARCHAR(100),
    IN  p_turno            VARCHAR(100),
    IN  p_sostenimiento    VARCHAR(100),
    IN  p_direccion        TEXT,
    IN  p_ubicacion        TEXT,
    -- JSON array de necesidades: [{categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles}, ...]
    IN  p_needs_json       JSON,
    -- Admin que ejecuta la carga
    IN  p_admin_id         INT,
    OUT p_school_id        INT,
    OUT p_success          TINYINT,
    OUT p_message          VARCHAR(255)
)
BEGIN
    DECLARE v_needs_count INT DEFAULT 0;
    DECLARE v_i           INT DEFAULT 0;
    DECLARE v_need        JSON;
    DECLARE exit_handler  TINYINT DEFAULT 0;

    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
        SET exit_handler = 1;
        SET p_success = 0;
        SET p_message = CONCAT('Error al procesar escuela: ', p_escuela);
        ROLLBACK;
    END;

    START TRANSACTION;

    -- Upsert de la escuela
    INSERT INTO schools
        (municipio, plantel, escuela, personal_escolar, estudiantes,
         nivel_educativo, cct, modalidad, turno, sostenimiento,
         direccion, ubicacion, status, created_at, updated_at)
    VALUES
        (p_municipio, p_plantel, p_escuela, p_personal_escolar, p_estudiantes,
         p_nivel_educativo, p_cct, p_modalidad, p_turno, p_sostenimiento,
         p_direccion, p_ubicacion, 'active', NOW(), NOW())
    ON DUPLICATE KEY UPDATE
        plantel          = VALUES(plantel),
        personal_escolar = VALUES(personal_escolar),
        estudiantes      = VALUES(estudiantes),
        nivel_educativo  = VALUES(nivel_educativo),
        cct              = VALUES(cct),
        modalidad        = VALUES(modalidad),
        turno            = VALUES(turno),
        sostenimiento    = VALUES(sostenimiento),
        direccion        = VALUES(direccion),
        ubicacion        = VALUES(ubicacion),
        status           = 'active',
        updated_at       = NOW();

    SET p_school_id = LAST_INSERT_ID();

    -- Si fue UPDATE (no INSERT), LAST_INSERT_ID() puede ser 0; buscamos el id real
    IF p_school_id = 0 THEN
        SELECT id INTO p_school_id
        FROM schools
        WHERE escuela = p_escuela AND municipio = p_municipio
        LIMIT 1;
    END IF;

    -- Reemplazar necesidades: borrar las existentes e insertar las nuevas
    DELETE FROM school_needs WHERE school_id = p_school_id;

    SET v_needs_count = JSON_LENGTH(p_needs_json);
    SET v_i = 0;
    WHILE v_i < v_needs_count DO
        SET v_need = JSON_EXTRACT(p_needs_json, CONCAT('$[', v_i, ']'));

        INSERT INTO school_needs
            (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles, created_at, updated_at)
        VALUES (
            p_school_id,
            JSON_UNQUOTE(JSON_EXTRACT(v_need, '$.categoria')),
            JSON_UNQUOTE(JSON_EXTRACT(v_need, '$.subcategoria')),
            JSON_UNQUOTE(JSON_EXTRACT(v_need, '$.propuesta')),
            JSON_EXTRACT(v_need, '$.cantidad'),
            JSON_UNQUOTE(JSON_EXTRACT(v_need, '$.unidad')),
            COALESCE(JSON_UNQUOTE(JSON_EXTRACT(v_need, '$.estado')), 'Aun no cubierto'),
            JSON_UNQUOTE(JSON_EXTRACT(v_need, '$.detalles')),
            NOW(), NOW()
        );
        SET v_i = v_i + 1;
    END WHILE;

    -- Registrar auditoría
    CALL sp_log_audit(
        p_admin_id,
        'UPSERT_SCHOOL_WITH_NEEDS',
        'schools',
        p_school_id,
        JSON_OBJECT(
            'escuela',       p_escuela,
            'municipio',     p_municipio,
            'needs_loaded',  v_needs_count
        )
    );

    SET p_success = 1;
    SET p_message = CONCAT('"', p_escuela, '" procesada: ', v_needs_count, ' necesidades cargadas.');

    IF exit_handler = 0 THEN
        COMMIT;
    END IF;
END$$


-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- trg_after_lead_insert
-- Después de que se registra un nuevo donor_lead, escribe automáticamente
-- un registro en audit_log (admin_id NULL = acción pública/anonima).
-- -----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_after_lead_insert$$
CREATE TRIGGER trg_after_lead_insert
AFTER INSERT ON donor_leads
FOR EACH ROW
BEGIN
    CALL sp_log_audit(
        NULL,
        'NEW_LEAD',
        'donor_leads',
        NEW.id,
        JSON_OBJECT(
            'nombre_completo',  NEW.nombre_completo,
            'email',            NEW.email,
            'tipo_donativo',    NEW.tipo_donativo,
            'tipo_instancia',   NEW.tipo_instancia,
            'status',           NEW.status
        )
    );
END$$


-- -----------------------------------------------------------------------------
-- trg_after_lead_status_update
-- Después de cambiar el status de un lead, registra el cambio en audit_log.
-- Complementa sp_update_lead_status para casos de UPDATE directo.
-- -----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_after_lead_status_update$$
CREATE TRIGGER trg_after_lead_status_update
AFTER UPDATE ON donor_leads
FOR EACH ROW
BEGIN
    IF OLD.status <> NEW.status THEN
        CALL sp_log_audit(
            NULL,
            'LEAD_STATUS_CHANGED',
            'donor_leads',
            NEW.id,
            JSON_OBJECT(
                'old_status', OLD.status,
                'new_status', NEW.status,
                'email',      NEW.email
            )
        );
    END IF;
END$$


-- -----------------------------------------------------------------------------
-- trg_after_school_status_update
-- Después de cambiar el status de una escuela (activa/inactiva), registra en
-- audit_log con los datos clave de la escuela afectada.
-- -----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_after_school_status_update$$
CREATE TRIGGER trg_after_school_status_update
AFTER UPDATE ON schools
FOR EACH ROW
BEGIN
    IF OLD.status <> NEW.status THEN
        CALL sp_log_audit(
            NULL,
            'SCHOOL_STATUS_CHANGED',
            'schools',
            NEW.id,
            JSON_OBJECT(
                'escuela',    NEW.escuela,
                'municipio',  NEW.municipio,
                'old_status', OLD.status,
                'new_status', NEW.status
            )
        );
    END IF;
END$$


-- -----------------------------------------------------------------------------
-- trg_after_need_estado_update
-- Después de cambiar el estado de una necesidad, registra el cambio en
-- audit_log para trazabilidad completa del progreso por escuela.
-- -----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_after_need_estado_update$$
CREATE TRIGGER trg_after_need_estado_update
AFTER UPDATE ON school_needs
FOR EACH ROW
BEGIN
    IF OLD.estado <> NEW.estado THEN
        CALL sp_log_audit(
            NULL,
            'NEED_ESTADO_CHANGED',
            'school_needs',
            NEW.id,
            JSON_OBJECT(
                'school_id',  NEW.school_id,
                'propuesta',  NEW.propuesta,
                'categoria',  NEW.categoria,
                'old_estado', OLD.estado,
                'new_estado', NEW.estado
            )
        );
    END IF;
END$$


DELIMITER ;


-- =============================================================================
-- VIEWS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- v_school_needs_summary
-- Vista principal: por cada escuela activa muestra el resumen de necesidades
-- agrupadas por estado. Usada por el catálogo para calcular el porcentaje.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_school_needs_summary AS
SELECT
    s.id                                                                AS school_id,
    s.escuela,
    s.municipio,
    s.nivel_educativo,
    s.estudiantes,
    s.personal_escolar,
    s.status,
    COUNT(sn.id)                                                        AS total_necesidades,
    SUM(CASE WHEN sn.estado = 'Cubierto'              THEN 1 ELSE 0 END) AS necesidades_cubiertas,
    SUM(CASE WHEN sn.estado = 'Cubierto parcialmente' THEN 1 ELSE 0 END) AS necesidades_parciales,
    SUM(CASE WHEN sn.estado = 'Aun no cubierto'       THEN 1 ELSE 0 END) AS necesidades_pendientes,
    ROUND(
        100.0 * (
            SUM(CASE WHEN sn.estado = 'Cubierto'              THEN 1.0 ELSE 0 END) +
            SUM(CASE WHEN sn.estado = 'Cubierto parcialmente' THEN 0.5 ELSE 0 END)
        ) / NULLIF(COUNT(sn.id), 0),
        1
    )                                                                    AS porcentaje_cubierto
FROM schools s
LEFT JOIN school_needs sn ON sn.school_id = s.id
WHERE s.status = 'active'
GROUP BY
    s.id, s.escuela, s.municipio, s.nivel_educativo,
    s.estudiantes, s.personal_escolar, s.status;


-- -----------------------------------------------------------------------------
-- v_needs_by_category
-- Resumen global de necesidades por categoría y estado.
-- Útil para el dashboard de administración.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_needs_by_category AS
SELECT
    sn.categoria,
    sn.estado,
    COUNT(*)                   AS cantidad,
    COUNT(DISTINCT sn.school_id) AS escuelas_afectadas
FROM school_needs sn
JOIN schools s ON s.id = sn.school_id
WHERE s.status = 'active'
GROUP BY sn.categoria, sn.estado
ORDER BY sn.categoria, sn.estado;


-- -----------------------------------------------------------------------------
-- v_municipio_stats
-- Estadísticas agregadas por municipio: escuelas activas, total de
-- estudiantes, necesidades pendientes y porcentaje de cobertura.
-- Usada por los stats del hero y filtros del sidebar.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_municipio_stats AS
SELECT
    s.municipio,
    COUNT(DISTINCT s.id)                                                 AS total_escuelas,
    SUM(s.estudiantes)                                                   AS total_estudiantes,
    SUM(s.personal_escolar)                                              AS total_personal,
    COUNT(sn.id)                                                         AS total_necesidades,
    SUM(CASE WHEN sn.estado = 'Aun no cubierto' THEN 1 ELSE 0 END)       AS necesidades_pendientes,
    SUM(CASE WHEN sn.estado = 'Cubierto'        THEN 1 ELSE 0 END)       AS necesidades_cubiertas,
    ROUND(
        100.0 * SUM(CASE WHEN sn.estado = 'Cubierto' THEN 1.0 ELSE 0 END)
             / NULLIF(COUNT(sn.id), 0),
        1
    )                                                                    AS pct_cubierto
FROM schools s
LEFT JOIN school_needs sn ON sn.school_id = s.id
WHERE s.status = 'active'
GROUP BY s.municipio
ORDER BY total_escuelas DESC;


-- -----------------------------------------------------------------------------
-- v_leads_activos
-- Donor leads con status 'nuevo' o 'contactado', incluyendo el nombre de
-- la escuela de destino (si existe). Vista para el panel de gestión de leads.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_leads_activos AS
SELECT
    dl.id,
    dl.nombre_completo,
    dl.email,
    dl.celular,
    dl.tipo_instancia,
    dl.nombre_instancia,
    dl.tipo_donativo,
    dl.escuelas_destino,
    dl.status,
    dl.municipio_estado,
    dl.created_at,
    dl.updated_at,
    DATEDIFF(NOW(), dl.created_at)                                       AS dias_desde_registro
FROM donor_leads dl
WHERE dl.status IN ('nuevo', 'contactado')
ORDER BY dl.created_at DESC;


-- -----------------------------------------------------------------------------
-- v_upload_log_summary
-- Resumen del historial de cargas de archivos XLSX: útil para la pestaña
-- "Upload" del panel de administración.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_upload_log_summary AS
SELECT
    ful.id,
    ful.filename,
    ful.file_size,
    ful.rows_processed,
    ful.rows_successful,
    ful.rows_failed,
    ful.status,
    ful.error_message,
    ful.created_at                                                       AS uploaded_at,
    CONCAT(au.first_name, ' ', au.last_name)                             AS uploaded_by_name,
    au.email                                                             AS uploaded_by_email
FROM file_upload_log ful
LEFT JOIN admin_users au ON au.id = ful.upload_by
ORDER BY ful.created_at DESC;
