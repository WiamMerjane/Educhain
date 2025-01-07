import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from './UserContext'; // Assurez-vous que le hook est importé correctement
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importer les icônes d'œil

const SignInPage = () => {
  const { getUserByEmail } = useUserContext();  // Vérifiez que useUserContext retourne un objet avec cette méthode
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Gérer la visibilité du mot de passe
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = getUserByEmail(formData.email);
    if (!user) {
      setError('Utilisateur non trouvé');
    } else if (user.password !== formData.password) {
      setError('Mot de passe incorrect');
    } else {
      setError('');
      // Stocker l'email dans le localStorage
      // Dans SignInPage.js
      localStorage.setItem('email', formData.email);  // "email" est la clé ici

      console.log('Email stocké dans localStorage:', localStorage.getItem('email'));
      // Rediriger vers l'espace en fonction du type d'utilisateur
      if (user.userType === 'etudiant') {
        navigate('/recommendation');
      } else if (user.userType === 'professeur') {
        navigate('/espace-prof');
      } else if (user.userType === 'administration') {
        navigate('/espace-admin');
      }
    }
  };

  return (
    <div className="signup-page">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="signup-card shadow-lg">
              <Card.Body>
                <h2 className="text-center mb-4">Sign In</h2>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                    />
                  </Form.Group>

                  <Form.Group controlId="formPassword" className="mt-3 position-relative">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'} // Afficher ou masquer le mot de passe
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                    />
                    <span 
                      onClick={() => setShowPassword(!showPassword)} 
                      style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', cursor: 'pointer' }}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Afficher l'icône d'œil */}
                    </span>
                  </Form.Group>

                  {error && <div className="text-danger mt-3">{error}</div>}

                  <Button variant="primary" type="submit" className="mt-4 w-100">
                  Log in
                  </Button>
                </Form>

                <div className="mt-3 text-center">
                  <p>
                  Don't have an account yet? <Link to="/signup">Sign up</Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignInPage;