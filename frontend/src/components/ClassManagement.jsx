import React, { useState, useEffect } from "react";
import axios from "axios";

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
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

  if (loading) return <div className="loading">Carregando turmas...</div>;

  return (
    <div className="container">
      <div className="header">
        <h1>Gerenciamento de Turmas</h1>
        <button className="btn btn-primary">+ Nova Turma</button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Curso</th>
              <th>Ano</th>
              <th>Semestre</th>
              <th>Capacidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((classItem) => (
              <tr key={classItem.id}>
                <td>{classItem.name}</td>
                <td>{classItem.course_name || "N/A"}</td>
                <td>{classItem.year}</td>
                <td>{classItem.semester}</td>
                <td>{classItem.max_students}</td>
                <td>
                  <button className="btn btn-sm btn-outline">Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {classes.length === 0 && (
          <div className="empty-state">
            <p>Nenhuma turma cadastrada</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassManagement;
