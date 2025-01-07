import React from "react";
import { Link } from "react-router-dom";
import { FaBook, FaUser , FaChartLine, FaRegFileAlt, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa'; // Importation des icônes
import "./SidebarProf.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Professor's Area</h2>
      <ul className="sidebar-menu">
        <li>
          <Link to="/espace-prof" className="sidebar-link">
            <FaTachometerAlt /> {/* Icône pour le tableau de bord */}
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/profile-prof" className="sidebar-link">
            <FaUser  /> {/* Icône pour le profil */}
            Profile
          </Link>
        </li>
        <li>
          <Link to="/parcours-etud" className="sidebar-link">
            <FaChartLine /> {/* Icône pour l'avancement */}
            Student Pathway
          </Link>
        </li>
        <li>
          <Link to="/scan-certif-note" className="sidebar-link">
            <FaRegFileAlt /> {/* Icône pour les certificats */}
            Certificate Scan
          </Link>
        </li>
      </ul>
      
      {/* Ajout du bouton Logout en bas */}
      <div className="sidebar-logout">
        <Link to="/" className="sidebar-link">
          <FaSignOutAlt /> {/* Icône de déconnexion */}
          Logout
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;