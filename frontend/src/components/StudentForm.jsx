import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const StudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    birth_date: "",
    address: "",
    phone: "",
    email: "",
    cpf: "",
    rg: "",
    status: "ativo",
  });

  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchStudent();
    }
  }, [id]);

  const fetchStudent = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/students`);
      const student = response.data.find((s) => s.id === parseInt(id));
      if (student) {
        setFormData(student);
      }
    } catch (error) {
      console.error("Erro ao buscar aluno:", error);
      alert("Erro ao carregar dados do aluno");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const submitData = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key]);
        }
      });

      if (photo) {
        submitData.append("photo", photo);
      }

      if (isEdit) {
        await axios.put(`/api/students/${id}`, submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("/api/students", submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      navigate("/students");
    } catch (error) {
      console.error("Erro ao salvar aluno:", error);
      alert(
        "Erro ao salvar aluno: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="container">
      <div className="header">
        <h1>{isEdit ? "Editar Aluno" : "Novo Aluno"}</h1>
        <button
          onClick={() => navigate("/students")}
          className="btn btn-outline"
        >
          ← Voltar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-grid">
          <div className="form-group">
            <label>Nome Completo *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Data de Nascimento *</label>
            <input
              type="date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>CPF</label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              placeholder="000.000.000-00"
            />
          </div>

          <div className="form-group">
            <label>RG</label>
            <input
              type="text"
              name="rg"
              value={formData.rg}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Telefone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group full-width">
            <label>Endereço</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="ativo">Ativo</option>
              <option value="trancado">Trancado</option>
              <option value="formado">Formado</option>
            </select>
          </div>

          <div className="form-group">
            <label>Foto do Aluno</label>
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
            {formData.photo_path && !photo && (
              <div style={{ marginTop: "10px" }}>
                <img
                  src={`http://localhost:3001/uploads/${formData.photo_path}`}
                  alt="Preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Salvando..." : isEdit ? "Atualizar" : "Cadastrar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
