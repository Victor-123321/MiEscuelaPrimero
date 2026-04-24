-- Seed schools — schema matches 002_create_schools_table.sql (Excel format)
-- Source: excel_format.xlsx › Hoja 2 "Datos de las escuelas"

INSERT INTO schools
  (municipio, plantel, escuela, personal_escolar, estudiantes, nivel_educativo,
   cct, modalidad, turno, sostenimiento, direccion, ubicacion, status)
VALUES
  ('Arandas', 'Francisco Rojas González', 'Francisco Rojas González',
   6, 119, 'Primaria', '14EPR1614C', 'SEP-Multigrado', 'Matutino', 'Estatal',
   'Desconocido, Llano Grande, CP 47198',
   'https://maps.app.goo.gl/jyZ4fChtbgVMrBZH8', 'active'),

  ('San Juan de los Lagos', 'Los Aguirre', 'Los Aguirre',
   1, 24, 'Secundaria', '14KTV0408X', 'CONAFE', 'Matutino', 'Federal',
   'Los aguirres de arriba, s/n, 47000',
   'https://maps.app.goo.gl/XvZzMtZRRCjrUJv27', 'active'),

  ('San Juan de los Lagos', 'Miguel Hidalgo y Costilla', 'Miguel Hidalgo y Costilla',
   15, 314, 'Primaria', '14DPR1702Y', 'SEP-General', 'Matutino', 'Federal',
   'Santa Cecilia, 47013 San Juan de los Lagos, Jal.',
   'https://goo.gl/maps/qLgcz1XDMbQyCdez6', 'active'),

  ('San Pedro Tlaquepaque', 'Antonio de Caso Peralta', 'Antonio de Caso Peralta',
   16, 289, 'Primaria', '14DPR3313V', 'SEP-General', 'Vespertino', 'Federal',
   'Sin número, Nueva Santa María, San Pedro Tlaquepaque',
   'https://www.google.com/maps?q=20.6061277,-103.3763599', 'active'),

  ('San Pedro Tlaquepaque', 'Lázaro Cárdenas', 'Lázaro Cárdenas',
   12, 350, 'Primaria', '14EPR1467J', 'SEP-General', 'Matutino', 'Estatal',
   'Lázaro Cárdenas #28, Los Santibáñez, 45620 San Pedro Tlaquepaque, Jal.',
   'https://maps.app.goo.gl/4Uj3m6i4abEhs7L2A', 'active'),

  ('San Pedro Tlaquepaque', 'Urbana 1097', 'Urbana 1098',
   16, 398, 'Primaria', '14EPR0145U', 'SEP-General', 'Matutino', 'Estatal',
   'Miguel Hidalgo #203, Emiliano Zapata, 45638 San Pedro Tlaquepaque, Jal.',
   'https://goo.gl/maps/9tLJL1qJMeAjXjsx9', 'active'),

  ('Zapopan', 'Las Cuevas', 'Carlos de Icaza (primaria)',
   2, 31, 'Primaria', '14DPR4183Z', 'SEP-Multigrado', 'Matutino', 'Federal',
   'Camino a las Cuevas, Sin número, Resplandor del Rayo, Zapopan',
   'https://maps.app.goo.gl/KSKzkvKDpLMo5eRi9', 'active'),

  ('Zapopan', 'Justo Sierra', 'Justo Sierra',
   21, 558, 'Primaria', '14DPR0060O', 'SEP-General', 'Matutino', 'Federalizado',
   'Agustín Melgar 1509, prados Santa Lucia, Zapopan, Jalisco',
   'https://maps.app.goo.gl/LnystBsvg6Y16AuY6', 'active');

-- ── School needs ─────────────────────────────────────────────────────────────
-- Source: excel_format.xlsx › Hoja 1 "Necesidades"
-- Columns: categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles

-- Francisco Rojas González
INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Material', 'Pizarrones / pintarrones', 'Pizarrones', 5, 'Piezas', 'Cubierto', ''
FROM schools s WHERE s.escuela = 'Francisco Rojas González';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Infraestructura', 'Construcción materiales', 'Cubetas de pintura vinílica mate calidad tonal', 7, 'Piezas', 'Cubierto', ''
FROM schools s WHERE s.escuela = 'Francisco Rojas González';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Infraestructura', 'Construcción materiales', 'Broachas de 6"', 3, 'Piezas', 'Aun no cubierto', ''
FROM schools s WHERE s.escuela = 'Francisco Rojas González';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Infraestructura', 'Construcción materiales', 'Galones de sellador vinílico', 2, 'Piezas', 'Aun no cubierto', ''
FROM schools s WHERE s.escuela = 'Francisco Rojas González';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Infraestructura', 'Construcción materiales', 'Grava o pasto para zonas de tierra', 10, 'Costales', 'Aun no cubierto', ''
FROM schools s WHERE s.escuela = 'Francisco Rojas González';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Material', 'Material de educación física', 'Pelotas de plástico (rebotan)', 40, 'Piezas', 'Cubierto', ''
FROM schools s WHERE s.escuela = 'Francisco Rojas González';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Material', 'Material de educación física', 'Sogas', 8, 'Piezas', 'Aun no cubierto', ''
FROM schools s WHERE s.escuela = 'Francisco Rojas González';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Material', 'Material de educación física', 'Balones', 6, 'Piezas', 'Aun no cubierto', ''
FROM schools s WHERE s.escuela = 'Francisco Rojas González';

-- Los Aguirre
INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Material', 'Material de papelería', 'Hojas blancas', 10, 'Paquete', 'Aun no cubierto', 'Paquetes de 500'
FROM schools s WHERE s.escuela = 'Los Aguirre';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Material', 'Material de papelería', 'Hojas de colores', 5, 'Paquete', 'Cubierto parcialmente', 'Paquetes de 1000'
FROM schools s WHERE s.escuela = 'Los Aguirre';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Material', 'Material de papelería', 'Papelotes o cartulinas', 10, 'Paquete', 'Cubierto', 'Paquetes de 50'
FROM schools s WHERE s.escuela = 'Los Aguirre';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Material', 'Material de papelería', 'Marcadores de pizarrón', 1, 'Paquete', 'Cubierto', 'Paquetes de 20'
FROM schools s WHERE s.escuela = 'Los Aguirre';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Material', 'Material de papelería', 'Marcadores para estudiantes', 3, 'Paquete', 'Aun no cubierto', 'Paquetes de 12'
FROM schools s WHERE s.escuela = 'Los Aguirre';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Salud', 'Higiene y salud', 'Jabón líquido para manos', 4, 'Piezas', 'Aun no cubierto', ''
FROM schools s WHERE s.escuela = 'Los Aguirre';

-- Miguel Hidalgo y Costilla
INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Material', 'Pizarrones / pintarrones', 'Pizarrones', 8, 'Piezas', 'Aun no cubierto', ''
FROM schools s WHERE s.escuela = 'Miguel Hidalgo y Costilla';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Material', 'Material de papelería', 'Cartulinas', 200, 'Piezas', 'Cubierto', ''
FROM schools s WHERE s.escuela = 'Miguel Hidalgo y Costilla';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Material', 'Material de papelería', 'Papelotes', 300, 'Piezas', 'Aun no cubierto', ''
FROM schools s WHERE s.escuela = 'Miguel Hidalgo y Costilla';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Material', 'Material de papelería', 'Líquido para limpiar pizarrones', 12, 'Paquete', 'Aun no cubierto', ''
FROM schools s WHERE s.escuela = 'Miguel Hidalgo y Costilla';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Material', 'Material de papelería', 'Marcadores', 2, 'Paquete', 'Cubierto', ''
FROM schools s WHERE s.escuela = 'Miguel Hidalgo y Costilla';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Material', 'Material de aseo', 'Material de aseo / botes de basura', 5, 'Piezas', 'Aun no cubierto', ''
FROM schools s WHERE s.escuela = 'Miguel Hidalgo y Costilla';

-- Antonio de Caso Peralta
INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Material', 'Material tecnológico', 'Proyectores', 4, 'Piezas', 'Aun no cubierto', ''
FROM schools s WHERE s.escuela = 'Antonio de Caso Peralta';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Material', 'Material tecnológico', 'Copiadora', 1, 'Piezas', 'Cubierto', ''
FROM schools s WHERE s.escuela = 'Antonio de Caso Peralta';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Material', 'Construcción materiales', 'Persianas', 24, 'Metros', 'Aun no cubierto', 'Metro para cada salón (4 salones)'
FROM schools s WHERE s.escuela = 'Antonio de Caso Peralta';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Material', 'Pizarrones / pintarrones', 'Pizarrones', 4, 'Piezas', 'Cubierto', ''
FROM schools s WHERE s.escuela = 'Antonio de Caso Peralta';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Formación', 'Formación para estudiantes', 'Estudiantes: manejo de emociones', 2, 'Grupos', 'Cubierto', ''
FROM schools s WHERE s.escuela = 'Antonio de Caso Peralta';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Formación', 'Formación para estudiantes', 'Estudiantes: proyecto de vida', 16, 'Horas', 'Cubierto', ''
FROM schools s WHERE s.escuela = 'Antonio de Caso Peralta';

-- Lázaro Cárdenas
INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Infraestructura', 'Construcción materiales', 'Impermeabilización de techo', 1, 'Servicio', 'Aun no cubierto', ''
FROM schools s WHERE s.escuela = 'Lázaro Cárdenas';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Material', 'Material de educación física', 'Balones de futbol', 6, 'Piezas', 'Cubierto', ''
FROM schools s WHERE s.escuela = 'Lázaro Cárdenas';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Salud', 'Higiene y salud', 'Filtros de agua potable', 2, 'Piezas', 'Aun no cubierto', ''
FROM schools s WHERE s.escuela = 'Lázaro Cárdenas';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Material', 'Material de papelería', 'Hojas blancas', 20, 'Paquete', 'Cubierto parcialmente', ''
FROM schools s WHERE s.escuela = 'Lázaro Cárdenas';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Formación', 'Formación docente', 'Taller: disciplina positiva', 1, 'Sesiones', 'Aun no cubierto', ''
FROM schools s WHERE s.escuela = 'Lázaro Cárdenas';

-- Urbana 1098
INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Material', 'Pizarrones / pintarrones', 'Pizarrones', 6, 'Piezas', 'Cubierto', ''
FROM schools s WHERE s.escuela = 'Urbana 1098';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Infraestructura', 'Construcción materiales', 'Reparación de sanitarios', 1, 'Servicio', 'Aun no cubierto', ''
FROM schools s WHERE s.escuela = 'Urbana 1098';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Material', 'Material tecnológico', 'Computadoras', 10, 'Piezas', 'Aun no cubierto', ''
FROM schools s WHERE s.escuela = 'Urbana 1098';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Salud', 'Higiene y salud', 'Botiquín de primeros auxilios', 2, 'Piezas', 'Cubierto', ''
FROM schools s WHERE s.escuela = 'Urbana 1098';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Formación', 'Formación docente', 'Taller: manejo de emociones', 1, 'Sesiones', 'Cubierto parcialmente', ''
FROM schools s WHERE s.escuela = 'Urbana 1098';

-- Carlos de Icaza (primaria)
INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Material', 'Material de papelería', 'Hojas blancas', 10, 'Paquete', 'Aun no cubierto', ''
FROM schools s WHERE s.escuela = 'Carlos de Icaza (primaria)';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Infraestructura', 'Construcción materiales', 'Pintura para aulas', 5, 'Piezas', 'Aun no cubierto', ''
FROM schools s WHERE s.escuela = 'Carlos de Icaza (primaria)';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Material', 'Material de educación física', 'Aros tipo hula hula', 20, 'Piezas', 'Cubierto', ''
FROM schools s WHERE s.escuela = 'Carlos de Icaza (primaria)';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Salud', 'Higiene y salud', 'Jabón y desinfectante', 3, 'Piezas', 'Cubierto', ''
FROM schools s WHERE s.escuela = 'Carlos de Icaza (primaria)';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Material', 'Pizarrones / pintarrones', 'Marcadores de pizarrón', 3, 'Paquete', 'Aun no cubierto', ''
FROM schools s WHERE s.escuela = 'Carlos de Icaza (primaria)';

-- Justo Sierra
INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Material', 'Material tecnológico', 'Proyectores', 8, 'Piezas', 'Cubierto parcialmente', ''
FROM schools s WHERE s.escuela = 'Justo Sierra';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Infraestructura', 'Construcción materiales', 'Impermeabilización de techo', 2, 'Servicio', 'Aun no cubierto', ''
FROM schools s WHERE s.escuela = 'Justo Sierra';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Formación', 'Formación docente', 'Taller: atención a discapacidad', 1, 'Sesiones', 'Cubierto', ''
FROM schools s WHERE s.escuela = 'Justo Sierra';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Material', 'Material de educación física', 'Balones surtidos', 12, 'Piezas', 'Cubierto', ''
FROM schools s WHERE s.escuela = 'Justo Sierra';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Salud', 'Higiene y salud', 'Filtros de agua', 4, 'Piezas', 'Aun no cubierto', ''
FROM schools s WHERE s.escuela = 'Justo Sierra';
