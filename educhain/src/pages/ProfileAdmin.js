import React, { useState } from "react";
import SidebarAdmin from "./SidebarAdmin";  // Assurez-vous que le chemin est correct
import "./ProfileAdmin.css";  // Assurez-vous que ce fichier existe et contient les styles nécessaires

function ProfileAdmin() {
  // État pour stocker les informations de l'administrateur
  const [adminInfo, setAdminInfo] = useState({
    name: "ENSAJ Admin",
    email: "ensaj.ucd@gmail.com",
    role: "Administrateur Principal",
  });

  // État pour gérer les modifications
  const [isEditing, setIsEditing] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState({ ...adminInfo });

  // Fonction pour gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedInfo({ ...updatedInfo, [name]: value });
  };

  // Fonction pour soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    setAdminInfo(updatedInfo);
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <SidebarAdmin />
      <div className="profile-content">
        <h2 className="profile-title">Administrator Profile</h2>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Last Name :</label>
              <input
                type="text"
                id="name"
                name="name"
                value={updatedInfo.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email :</label>
              <input
                type="email"
                id="email"
                name="email"
                value={updatedInfo.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="role">Role :</label>
              <input
                type="text"
                id="role"
                name="role"
                value={updatedInfo.role}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn-save">Save</button>
            <button type="button" onClick={() => setIsEditing(false)} className="btn-cancel">Cancel</button>
          </form>
        ) : (
          <div className="profile-details">
            <p><strong>Last Name :</strong> {adminInfo.name}</p>
            <p><strong>Email :</strong> {adminInfo.email}</p>
            <p><strong>Role :</strong> {adminInfo.role}</p>
            <button onClick={() => setIsEditing(true)} className="btn-edit">Modifier mes informations</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileAdmin;
