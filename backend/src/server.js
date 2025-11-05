import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Criar pasta uploads se não existir
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configuração do Multer para upload de fotos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Conexão com o MySQL
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "student_control",
};

let connection;

async function connectDB() {
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log("✅ Conectado ao MySQL com sucesso!");

    // Testar se as tabelas existem
    const [tables] = await connection.execute("SHOW TABLES");
    console.log(`📊 Tables no banco: ${tables.length}`);
  } catch (error) {
    console.error("❌ Erro ao conectar com o MySQL:", error.message);
    console.log("\n🔧 Verifique:");
    console.log("1. MySQL está rodando");
    console.log('2. Database "student_control" existe');
    console.log("3. Usuário e senha corretos");
    console.log("4. Configure a senha no arquivo server.js se necessário");
    process.exit(1);
  }
}

// Conectar ao banco
connectDB();

// Rotas para Alunos
app.get("/api/students", async (req, res) => {
  try {
    const [rows] = await connection.execute(
      "SELECT * FROM students ORDER BY name"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await connection.execute(
      "SELECT * FROM students WHERE id = ?",
      [id]
    );

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: "Aluno não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/students", upload.single("photo"), async (req, res) => {
  try {
    const {
      name,
      birth_date,
      address,
      phone,
      email,
      cpf,
      rg,
      status = "ativo",
    } = req.body;

    const photo_path = req.file ? req.file.filename : null;

    const [result] = await connection.execute(
      `INSERT INTO students (name, birth_date, address, phone, email, cpf, rg, photo_path, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, birth_date, address, phone, email, cpf, rg, photo_path, status]
    );

    res.json({
      id: result.insertId,
      message: "Aluno cadastrado com sucesso",
      student: { id: result.insertId, name, email, status },
    });
  } catch (error) {
    console.error("Erro ao cadastrar aluno:", error);
    res
      .status(500)
      .json({ error: "Erro interno do servidor: " + error.message });
  }
});

app.put("/api/students/:id", upload.single("photo"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, birth_date, address, phone, email, cpf, rg, status } =
      req.body;

    const photo_path = req.file ? req.file.filename : undefined;

    let query = `UPDATE students SET 
      name = ?, birth_date = ?, address = ?, phone = ?, 
      email = ?, cpf = ?, rg = ?, status = ?`;

    let params = [name, birth_date, address, phone, email, cpf, rg, status];

    if (photo_path) {
      query += ", photo_path = ?";
      params.push(photo_path);
    }

    query += " WHERE id = ?";
    params.push(id);

    await connection.execute(query, params);
    res.json({ message: "Aluno atualizado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rotas para Cursos
app.get("/api/courses", async (req, res) => {
  try {
    const [rows] = await connection.execute(
      "SELECT * FROM courses ORDER BY name"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rotas para Turmas
app.get("/api/classes", async (req, res) => {
  try {
    const [rows] = await connection.execute(`
      SELECT c.*, co.name as course_name
      FROM classes c
      LEFT JOIN courses co ON c.course_id = co.id
      ORDER BY c.year DESC, c.semester DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota de saúde da API
app.get("/api/health", async (req, res) => {
  try {
    await connection.execute("SELECT 1");
    res.json({
      status: "OK",
      database: "MySQL Conectado",
      message: "Sistema funcionando corretamente",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "Erro",
      database: "Desconectado",
      error: error.message,
    });
  }
});

// Rota para verificar tabelas
app.get("/api/tables", async (req, res) => {
  try {
    const [tables] = await connection.execute("SHOW TABLES");
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🎓 Servidor do Controle de Alunos rodando na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`👨‍🎓 API Students: http://localhost:${PORT}/api/students`);
  console.log(`📚 API Courses: http://localhost:${PORT}/api/courses`);
  console.log(`🏫 API Classes: http://localhost:${PORT}/api/classes`);
  console.log(`🗂️  API Tables: http://localhost:${PORT}/api/tables`);
});
