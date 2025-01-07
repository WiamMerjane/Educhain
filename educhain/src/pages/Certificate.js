import React from "react";
import Sidebar from "./SidebarEtud";
import "./Certificate.css";

function Certificate() {
  return (
    <div className="certificate-container">
      <Sidebar />
      <div className="certificate-content">
        <h2 className="certificate-title">Mes Certificats</h2>
        <div className="certificate-list">
          <p><strong>Certificat en React</strong> - Obtenu le 12 Décembre 2023</p>
          <p><strong>Certificat en JavaScript</strong> - Obtenu le 5 Janvier 2024</p>
        </div>
      </div>
    </div>
  );
}

export default Certificate;
