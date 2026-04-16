-- Sample schools from Jalisco region
INSERT INTO schools (name, municipality, category, type, description, students, teachers, funding_pct, urgent, status) VALUES
('Primaria Guadalajara Centro', 'Guadalajara', 'Infraestructura', 'Escuela Primaria', 'Escuela en el corazón de Guadalajara necesita mejorar sus instalaciones para brindar educación de calidad.', 450, 18, 45.00, TRUE, 'active'),
('Colegio Zapopan Futuro', 'Zapopan', 'Educación', 'Escuela Primaria', 'Institución dedicada a formar líderes del futuro con enfoque en tecnología y valores cívicos.', 320, 14, 65.00, FALSE, 'active'),
('Escuela Municipal Tonalá', 'Tonalá', 'Nutrición', 'Escuela Primaria', 'Escuela municipal comprometida con educación de calidad y bienestar integral de los estudiantes.', 280, 12, 30.00, TRUE, 'active'),
('Instituto Educativo Puerto Vallarta', 'Puerto Vallarta', 'Infraestructura', 'Escuela Técnica', 'Centro educativo con enfoque técnico y profesional para preparar a jóvenes de la región costera.', 380, 16, 55.00, FALSE, 'active'),
('Primaria Colotlán Rural', 'Colotlán', 'Infraestructura', 'Escuela Primaria', 'Escuela en zona rural con acceso limitado a recursos básicos; prioritaria para la transformación educativa.', 150, 6, 20.00, TRUE, 'active');

-- School needs for Primaria Guadalajara Centro
INSERT INTO school_needs (school_id, title, description, amount_needed, amount_funded, status)
SELECT s.id, 'Libros y Materiales de Lectura', 'Se necesitan libros para mejorar la biblioteca escolar y fomentar el hábito de la lectura.', 50000.00, 22500.00, 'in-progress'
FROM schools s WHERE s.name = 'Primaria Guadalajara Centro';

INSERT INTO school_needs (school_id, title, description, amount_needed, amount_funded, status)
SELECT s.id, 'Reparación de Techo', 'El techo principal requiere reparación urgente para garantizar la seguridad de alumnos y maestros.', 120000.00, 0.00, 'open'
FROM schools s WHERE s.name = 'Primaria Guadalajara Centro';

-- School needs for Colegio Zapopan Futuro
INSERT INTO school_needs (school_id, title, description, amount_needed, amount_funded, status)
SELECT s.id, 'Equipos de Cómputo', 'Se necesitan computadoras para el laboratorio de tecnología y fortalecer habilidades digitales.', 80000.00, 52000.00, 'in-progress'
FROM schools s WHERE s.name = 'Colegio Zapopan Futuro';

-- School needs for Escuela Municipal Tonalá
INSERT INTO school_needs (school_id, title, description, amount_needed, amount_funded, status)
SELECT s.id, 'Programa de Alimentación', 'Apoyo para mantener el programa de desayunos escolares y garantizar nutrición adecuada.', 45000.00, 13500.00, 'in-progress'
FROM schools s WHERE s.name = 'Escuela Municipal Tonalá';

-- School needs for Instituto Educativo Puerto Vallarta
INSERT INTO school_needs (school_id, title, description, amount_needed, amount_funded, status)
SELECT s.id, 'Mobiliario Escolar', 'Escritorios y sillas nuevas para aulas; el mobiliario actual está deteriorado.', 35000.00, 0.00, 'open'
FROM schools s WHERE s.name = 'Instituto Educativo Puerto Vallarta';

-- School needs for Primaria Colotlán Rural
INSERT INTO school_needs (school_id, title, description, amount_needed, amount_funded, status)
SELECT s.id, 'Instalación de Agua Potable', 'Proyecto para mejorar acceso a agua potable y sanitarios en condiciones dignas.', 150000.00, 30000.00, 'in-progress'
FROM schools s WHERE s.name = 'Primaria Colotlán Rural';
