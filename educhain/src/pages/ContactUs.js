import React, { useState } from 'react';
import './ContactUs.css';  // Inclure le fichier CSS pour ContactUs

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ajoutez ici la logique d'envoi du formulaire
    console.log('Form data submitted:', formData);
  };

  return (
    <div>
      {/* HEADER */}
      <header className="navbar">
        <div className="container">
          <h1 className="brand-text" onClick={() => window.location.href = '/'}>Educhain</h1>
          <nav>
            <ul>
              <li><a href="/aboutus">About Us</a></li>
              <li><a href="/contact" className="active">Contact Us</a></li>
              <li><a href="/signin">Sign In</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="container">
          <h2 className="hero-heading">Contact Us</h2>
          <p className="hero-subheading">
              Do you have any questions or comments? Feel free to contact us using the form below.
          </p>
        </div>
      </section>

      {/* CONTACT FORM SECTION */}
      <section className="contact-form-section">
        <div className="container">
          <h2 className="form-heading">Contact Form</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Last Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Votre nom"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Votre email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Votre message"
                required
              ></textarea>
            </div>
            <button type="submit" className="cta-button">Send</button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>&copy; 2024 Educhain. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ContactUs;
