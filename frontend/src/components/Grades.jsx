import React from "react";

const Grades = () => {
  return (
    <div className="container">
      <div className="header">
        <h1>Sistema de Notas</h1>
      </div>
      <div className="card">
        <div className="feature-coming">
          <h3>📝 Módulo em Desenvolvimento</h3>
          <p>Esta funcionalidade estará disponível em breve!</p>
          <ul>
            <li>🎯 Notas por disciplina e bimestre</li>
            <li>📈 Cálculo automático de médias</li>
            <li>📋 Histórico de notas</li>
            <li>✅ Controle de aprovação/reprovação</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Grades;
