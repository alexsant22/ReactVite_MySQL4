import React, { useState, useEffect } from "react";
import axios from "axios";

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    course_id: "",
    year: new Date().getFullYear(),
    semester: "1",
    max_students: 30,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClasses();
    fetchCourses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get("/api/classes");
      setClasses(response.data);
    } catch (error) {
      console.error("Erro ao buscar turmas:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get("/api/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.post("/api/classes", formData);

      // Limpar formulário e recarregar dados
      setFormData({
        name: "",
        course_id: "",
        year: new Date().getFullYear(),
        semester: "1",
        max_students: 30,
      });
      setShowForm(false);
      fetchClasses(); // Recarregar a lista

      alert("Turma cadastrada com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar turma:", error);
      alert(
        "Erro ao cadastrar turma: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setSaving(false);
    }
  };

  const generateClassName = () => {
    if (formData.course_id && formData.year && formData.semester) {
      const course = courses.find((c) => c.id == formData.course_id);
      if (course) {
        const courseCode = course.name.substring(0, 3).toUpperCase();
        return `${courseCode}-${formData.year}-${formData.semester}`;
      }
    }
    return "";
  };

  if (loading) return <div className="loading">Carregando turmas...</div>;

  return (
    <div className="container">
      <div className="header">
        <h1>Gerenciamento de Turmas</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "✕ Cancelar" : "+ Nova Turma"}
        </button>
      </div>

      {/* Formulário de Nova Turma */}
      {showForm && (
        <div className="form-card">
          <h2>Cadastrar Nova Turma</h2>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-grid">
              <div className="form-group">
                <label>Curso *</label>
                <select
                  name="course_id"
                  value={formData.course_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione um curso</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Nome da Turma *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || generateClassName()}
                  onChange={handleInputChange}
                  placeholder="Nome automático será gerado"
                  required
                />
                <small className="form-help">
                  {generateClassName() && `Sugestão: ${generateClassName()}`}
                </small>
              </div>

              <div className="form-group">
                <label>Ano *</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  min="2020"
                  max="2030"
                  required
                />
              </div>

              <div className="form-group">
                <label>Semestre *</label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  required
                >
                  <option value="1">1º Semestre</option>
                  <option value="2">2º Semestre</option>
                </select>
              </div>

              <div className="form-group">
                <label>Capacidade de Alunos *</label>
                <input
                  type="number"
                  name="max_students"
                  value={formData.max_students}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? "Salvando..." : "Cadastrar Turma"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Turmas */}
      <div className="table-container">
        <div className="table-header">
          <h3>Turmas Cadastradas</h3>
          <span className="table-count">{classes.length} turma(s)</span>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Curso</th>
              <th>Ano</th>
              <th>Semestre</th>
              <th>Capacidade</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((classItem) => (
              <tr key={classItem.id}>
                <td>
                  <strong>{classItem.name}</strong>
                </td>
                <td>{classItem.course_name || "N/A"}</td>
                <td>{classItem.year}</td>
                <td>
                  <span className="semester-badge">
                    {classItem.semester}º Semestre
                  </span>
                </td>
                <td>
                  <div className="capacity-info">
                    <span className="capacity-number">
                      {classItem.max_students}
                    </span>
                    <span className="capacity-label">alunos</span>
                  </div>
                </td>
                <td>
                  <span className="status-badge status-active">Ativa</span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-sm btn-outline">
                      👁️ Visualizar
                    </button>
                    <button className="btn btn-sm btn-outline">
                      ✏️ Editar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {classes.length === 0 && !showForm && (
          <div className="empty-state">
            <div className="empty-icon">🏫</div>
            <h3>Nenhuma turma cadastrada</h3>
            <p>Comece criando sua primeira turma para organizar os alunos.</p>
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              + Criar Primeira Turma
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassManagement;
