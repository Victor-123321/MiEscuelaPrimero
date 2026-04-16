-- Hero impact stats
INSERT INTO stats (stat_key, stat_value, stat_label, display_order) VALUES
('total_schools', '450', 'Escuelas Apoyadas', 1),
('total_students', '25,000', 'Estudiantes Impactados', 2),
('total_teachers', '1,200', 'Docentes Beneficiados', 3),
('schools_helped', '150', 'Escuelas Transformadas', 4);

-- Footer contact information
INSERT INTO footer_content (content_key, content_value) VALUES
('contact_email', 'contacto@mpj.org.mx'),
('contact_phone', '33 2106 8253'),
('address', 'Av. Pablo Neruda 2560, Providencia, 44630 Guadalajara, Jal.'),
('website', 'www.mexicanosprimerojalisco.org');

-- How it works steps
INSERT INTO footer_content (content_key, content_value) VALUES
('step_1_title', 'Descubre'),
('step_1_description', 'Explora las escuelas y sus necesidades específicas'),
('step_2_title', 'Participa'),
('step_2_description', 'Elige cómo quieres apoyar a la educación'),
('step_3_title', 'Impacta'),
('step_3_description', 'Genera cambio directo en las escuelas de Jalisco'),
('step_4_title', 'Transforma'),
('step_4_description', 'Juntos logramos educación de calidad que cambia Jalisco');

-- Social media links
INSERT INTO footer_content (content_key, content_value) VALUES
('social_facebook', '@MexPrimJal'),
('social_twitter', '@Mexicanos1oJal'),
('social_instagram', '@Mexicanos1ojal');
