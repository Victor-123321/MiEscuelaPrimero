-- Insert sample schools
INSERT INTO schools (name, municipality, type, description, students, teachers, urgent, status) VALUES
('Francisco Rojas',  'Arandas',              'Primaria',   'Escuela en Arandas que requiere materiales, infraestructura y formación.',        280, 10, TRUE,  'active'),
('Los Aguirre',      'San Juan de los Lagos','Primaria',   'Escuela que necesita material de papelería y recursos educativos.',               180,  7, FALSE, 'active'),
('Benito Juárez',    'Guadalajara',          'Primaria',   'Escuela urbana con necesidades de mobiliario y equipamiento tecnológico.',         420, 16, FALSE, 'active'),
('Lázaro Cárdenas',  'Zapopan',              'Primaria',   'Escuela que requiere computadoras y conectividad para su aula digital.',           310, 11, TRUE,  'active'),
('Vicente Guerrero', 'Tlaquepaque',          'Secundaria', 'Secundaria técnica con necesidades de infraestructura y material deportivo.',      380, 15, FALSE, 'active');

-- Needs for Francisco Rojas
INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Material', 'Pizarrones / pintarrones', 'Pizarrones', 5, 'Piezas', 'Cubierto', ''
FROM schools s WHERE s.name = 'Francisco Rojas';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Infraestructura', 'Construcción materiales', 'Broachas de 6"', 3, 'Piezas', 'Aun no cubierto', ''
FROM schools s WHERE s.name = 'Francisco Rojas';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Infraestructura', 'Construcción materiales', 'Puertas de herrería', 2, 'Piezas', 'Aun no cubierto', ''
FROM schools s WHERE s.name = 'Francisco Rojas';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Material', 'Material de educación física', 'Balones', 6, 'Piezas', 'Aun no cubierto', ''
FROM schools s WHERE s.name = 'Francisco Rojas';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Formación', 'Formación para docentes', 'Docentes: convivencia', 6, 'Horas', 'Aun no cubierto', 'Formación de 2-4 horas para grupo de 6 docentes'
FROM schools s WHERE s.name = 'Francisco Rojas';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Formación', 'Formación para familias', 'Familias: convivencia', 3, 'Horas', 'Aun no cubierto', 'Formación de 2 horas para grupo de 30 familias'
FROM schools s WHERE s.name = 'Francisco Rojas';

-- Needs for Los Aguirre
INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Material', 'Material de papelería', 'Hojas blancas', 10, 'Paquete', 'Aun no cubierto', 'Paquetes de 500'
FROM schools s WHERE s.name = 'Los Aguirre';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Material', 'Material de papelería', 'Hojas de colores', 5, 'Paquete', 'Cubierto parcialmente', 'Paquetes de 1000'
FROM schools s WHERE s.name = 'Los Aguirre';

-- Needs for Benito Juárez
INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Material', 'Material tecnológico', 'Computadoras', 10, 'Piezas', 'Cubierto', ''
FROM schools s WHERE s.name = 'Benito Juárez';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Infraestructura', 'Construcción materiales', 'Pintura blanca', 20, 'Cubetas', 'Aun no cubierto', 'Para pintar 3 aulas'
FROM schools s WHERE s.name = 'Benito Juárez';

-- Needs for Lázaro Cárdenas
INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Material', 'Material tecnológico', 'Laptops', 15, 'Piezas', 'Aun no cubierto', ''
FROM schools s WHERE s.name = 'Lázaro Cárdenas';

INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
SELECT s.id, 'Infraestructura', 'Construcción materiales', 'Router WiFi', 2, 'Piezas', 'Cubierto', ''
FROM schools s WHERE s.name = 'Lázaro Cárdenas';
