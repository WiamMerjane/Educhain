import React from 'react';
import './AboutUs.css';  // Inclure le fichier CSS pour AboutUs

const AboutUs = () => {
  return (
    <div>
      {/* HEADER */}
      <header className="navbar">
        <div className="container">
          <h1 className="brand-text" onClick={() => window.location.href = '/'}>Educhain</h1>
          <nav>
            <ul>
              <li><a href="/aboutus" className="active">About Us</a></li>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/signin">Sign In</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="container">
          <h2 className="hero-heading">About Us</h2>
          <p className="hero-subheading">
          We are a leading company in our field, offering innovative and high-quality solutions.
          </p>
          <a href="/contact" className="cta-button">Contact Us</a>
        </div>
      </section>

      {/* EDUCHAIN SECTION */}
      <section className="educhain-section">
        <div className="container">
          <h2 className="educhain-heading">What is Educhain?</h2>
          <p className="educhain-description">
          Educhain is a revolutionary platform dedicated to education, combining technology and innovation to offer an interactive and accessible learning experience. We believe that every student deserves quality educational resources that are easily accessible. Our mission is to transform online learning by enabling students to access personalized content, allowing teachers to share resources effortlessly, and helping institutions enhance their educational management.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>&copy; 2024 Educhain. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AboutUs;
