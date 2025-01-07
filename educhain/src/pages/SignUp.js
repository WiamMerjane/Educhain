import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from './UserContext';
import './SignUpPage.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importer les icônes d'œil

const SignUpPage = () => {
  const { addUser } = useUserContext();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    userType: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Gérer la visibilité du mot de passe
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Gérer la visibilité du mot de passe de confirmation
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('The passwords do not match.');
    } else {
      setError('');
      // Ajouter l'utilisateur au contexte
      addUser(formData);
      navigate('/signin'); // Rediriger vers la page de connexion après l'inscription
    }
  };

  return (
    <div className="signup-page">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="signup-card shadow-lg">
              <Card.Body>
                <h2 className="text-center mb-4">Sign Up</h2>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formNom">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                    />
                  </Form.Group>

                  <Form.Group controlId="formPrenom" className="mt-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                    />
                  </Form.Group>

                  <Form.Group controlId="formEmail" className="mt-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                    />
                  </Form.Group>

                  <Form.Group controlId="formUserType" className="mt-3">
                    <Form.Label>Type of user</Form.Label>
                    <Form.Control
                      as="select"
                      name="userType"
                      value={formData.userType}
                      onChange={handleChange}
                    >
                      <option value="">Select a type</option>
                      <option value="etudiant">Étudiant</option>
                      <option value="professeur">Professeur</option>
                      <option value="administration">Administration</option>
                    </Form.Control>
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

                  <Form.Group controlId="formConfirmPassword" className="mt-3 position-relative">
                    <Form.Label>Confirm password</Form.Label>
                    <Form.Control
                      type={showConfirmPassword ? 'text' : 'password'} // Afficher ou masquer le mot de passe de confirmation
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm password"
                    />
                    <span 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                      style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', cursor: 'pointer' }}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />} {/* Afficher l'icône d'œil */}
                    </span>
                  </Form.Group>

                  {error && <div className="text-danger mt-3">{error}</div>}

                  <Button variant="primary" type="submit" className="mt-4 w-100">
                    Sign up
                  </Button>
                </Form>

                <div className="mt-3 text-center">
                  <p>
                  Already registered?<Link to="/signin">  Sign in</Link>
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

export default SignUpPage;
