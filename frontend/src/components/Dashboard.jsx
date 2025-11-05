import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalClasses: 0,
  });

  const [recentStudents, setRecentStudents] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [studentsRes, classesRes] = await Promise.all([
        axios.get("/api/students"),
        axios.get("/api/classes"),
      ]);

      const totalStudents = studentsRes.data.length;
      const activeStudents = studentsRes.data.filter(
        (s) => s.status === "ativo"
      ).length;
      const totalClasses = classesRes.data.length;

      // Últimos 5 alunos cadastrados
      const recent = studentsRes.data
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

      setStats({
        totalStudents,
        activeStudents,
        totalClasses,
      });
      setRecentStudents(recent);
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Dashboard</h1>
        <div className="header-actions">
          <Link to="/students/new" className="btn btn-primary">
            + Novo Aluno
          </Link>
          <Link to="/classes" className="btn btn-outline">
            Gerenciar Turmas
          </Link>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👨‍🎓</div>
          <h3>Total de Alunos</h3>
          <div className="stat-number">{stats.totalStudents}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <h3>Alunos Ativos</h3>
          <div className="stat-number">{stats.activeStudents}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏫</div>
          <h3>Turmas Ativas</h3>
          <div className="stat-number">{stats.totalClasses}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <h3>Frequência Média</h3>
          <div className="stat-number">85%</div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="recent-students">
          <h2>Alunos Recentes</h2>
          <div className="card">
            {recentStudents.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {recentStudents.map((student) => (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>{student.email || "-"}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            student.status === "ativo"
                              ? "status-active"
                              : student.status === "trancado"
                              ? "status-inactive"
                              : "status-completed"
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
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
            ) : (
              <div className="empty-state">
                <p>Nenhum aluno cadastrado</p>
                <Link to="/students/new" className="btn btn-primary">
                  Cadastrar Primeiro Aluno
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="quick-actions">
          <h2>Ações Rápidas</h2>
          <div className="action-grid">
            <Link to="/students/new" className="action-card">
              <div className="action-icon">➕</div>
              <h3>Cadastrar Aluno</h3>
              <p>Adicionar novo aluno ao sistema</p>
            </Link>

            <Link to="/attendance" className="action-card">
              <div className="action-icon">✅</div>
              <h3>Registrar Presença</h3>
              <p>Controle de frequência diária</p>
            </Link>

            <Link to="/grades" className="action-card">
              <div className="action-icon">📝</div>
              <h3>Lançar Notas</h3>
              <p>Cadastrar notas dos alunos</p>
            </Link>

            <Link to="/reports" className="action-card">
              <div className="action-icon">📈</div>
              <h3>Relatórios</h3>
              <p>Gerar relatórios e análises</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
