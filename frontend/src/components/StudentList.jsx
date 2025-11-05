import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("/api/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      ativo: { class: "status-active", label: "Ativo" },
      trancado: { class: "status-inactive", label: "Trancado" },
      formado: { class: "status-completed", label: "Formado" },
    };

    const config = statusConfig[status] || statusConfig.ativo;
    return (
      <span className={`status-badge ${config.class}`}>{config.label}</span>
    );
  };

  if (loading) return <div className="loading">Carregando alunos...</div>;

  return (
    <div className="container">
      <div className="header">
        <h1>Lista de Alunos</h1>
        <Link to="/students/new" className="btn btn-primary">
          + Novo Aluno
        </Link>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>CPF</th>
              <th>Status</th>
              <th>Matrículas</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>
                  {student.photo_path ? (
                    <img
                      src={`http://localhost:3001/uploads/${student.photo_path}`}
                      alt={student.name}
                      className="student-photo"
                    />
                  ) : (
                    <div className="no-photo">📷</div>
                  )}
                </td>
                <td>{student.name}</td>
                <td>{student.email || "-"}</td>
                <td>{student.phone || "-"}</td>
                <td>{student.cpf || "-"}</td>
                <td>{getStatusBadge(student.status)}</td>
                <td>{student.active_enrollments || 0} ativa(s)</td>
                <td>
                  <Link
                    to={`/students/edit/${student.id}`}
                    className="btn btn-sm btn-outline"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {students.length === 0 && (
          <div className="empty-state">
            <p>Nenhum aluno cadastrado</p>
            <Link to="/students/new" className="btn btn-primary">
              Cadastrar Primeiro Aluno
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentList;
