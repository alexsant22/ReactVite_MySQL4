CREATE DATABASE IF NOT EXISTS student_control;
USE student_control;

-- Tabela de Alunos
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    cpf VARCHAR(14) UNIQUE,
    rg VARCHAR(20),
    photo_path VARCHAR(500),
    status ENUM('ativo', 'trancado', 'formado') DEFAULT 'ativo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Cursos
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration INT, -- em meses
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Turmas
CREATE TABLE classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT,
    name VARCHAR(255) NOT NULL,
    year YEAR,
    semester ENUM('1', '2') DEFAULT '1',
    max_students INT,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Disciplinas
CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    workload INT, -- carga horária em horas
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Professores
CREATE TABLE teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    specialization VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Relação Turma-Disciplina-Professor
CREATE TABLE class_subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT,
    subject_id INT,
    teacher_id INT,
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Matrícula de Alunos em Turmas
CREATE TABLE enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    class_id INT,
    enrollment_date DATE,
    status ENUM('ativo', 'trancado', 'concluído') DEFAULT 'ativo',
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (class_id) REFERENCES classes(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Controle de Presença
CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    enrollment_id INT,
    class_subject_id INT,
    date DATE NOT NULL,
    present BOOLEAN DEFAULT false,
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id),
    FOREIGN KEY (class_subject_id) REFERENCES class_subjects(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sistema de Notas
CREATE TABLE grades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    enrollment_id INT,
    class_subject_id INT,
    semester ENUM('1', '2') DEFAULT '1',
    grade1 DECIMAL(4,2),
    grade2 DECIMAL(4,2),
    grade3 DECIMAL(4,2),
    grade4 DECIMAL(4,2),
    final_grade DECIMAL(4,2),
    status ENUM('aprovado', 'reprovado', 'cursando') DEFAULT 'cursando',
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id),
    FOREIGN KEY (class_subject_id) REFERENCES class_subjects(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir dados de exemplo
INSERT INTO courses (name, description, duration) VALUES 
('Engenharia de Software', 'Curso de Engenharia de Software', 48),
('Administração', 'Curso de Administração', 36),
('Direito', 'Curso de Direito', 60);

INSERT INTO classes (course_id, name, year, semester, max_students) VALUES 
(1, 'ES-2024-1', 2024, '1', 40),
(2, 'ADM-2024-1', 2024, '1', 35);

INSERT INTO subjects (name, code, workload) VALUES 
('Programação Web', 'PW101', 80),
('Banco de Dados', 'BD201', 60),
('Gestão Empresarial', 'GE101', 60);

INSERT INTO teachers (name, email, phone, specialization) VALUES 
('João Silva', 'joao@escola.com', '(11) 9999-8888', 'Desenvolvimento Web'),
('Maria Santos', 'maria@escola.com', '(11) 9999-7777', 'Banco de Dados');