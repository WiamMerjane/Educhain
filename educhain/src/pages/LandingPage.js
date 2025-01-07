import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Button, Row, Col, Card } from 'react-bootstrap';
import './LandingPage.css'; // Assurez-vous d'ajouter un fichier CSS personnalisé
import { Link } from 'react-router-dom';
const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="landing-page">
      {/* HEADER */}
      <Navbar expand="lg" fixed={scrolled ? "top" : ""} className={scrolled ? "navbar-scroll" : "navbar"}>
        <Container>
          <Navbar.Brand href="#home" className="brand-text">Educhain</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarNav" />
          <Navbar.Collapse id="navbarNav" className="justify-content-end">
            <Nav>
              <Nav.Link as={Link} to="/aboutus" className="nav-link">About Us</Nav.Link>
              <Nav.Link as={Link} to="/contact" className="nav-link">Contact Us</Nav.Link>
              <Nav.Link as={Link} to="/signin" className="nav-link">Sign In</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* MAIN HERO SECTION */}
      <section className="hero-section text-center py-5">
        <Container>
          <h1 className="hero-heading">Welcome to Educhain</h1>
          <p className="lead hero-subheading">Blockchain at the service of learning</p>
          <Link to="/progress">
              <Button variant="primary" size="lg" className="cta-button">
                 Get Started
             </Button>
          </Link>
        </Container>
      </section>

      {/* STATISTICS SECTION */}
      <section className="statistics-section py-5 bg-light">
        <Container>
          <h2 className="section-title">Our Statistics</h2>
          <Row className="text-center">
            <Col md={4}>
              <Card className="stat-card">
                <Card.Body>
                  <h3>500+</h3>
                  <p>Students Enrolled</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="stat-card">
                <Card.Body>
                  <h3>300+</h3>
                  <p>Certificates Verified</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="stat-card">
                <Card.Body>
                  <h3>100+</h3>
                  <p>Courses Available</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* OFFERS FOR STUDENTS */}
      <section className="offer-section py-5" id="student">
        <Container>
          <h2 className="section-title">What We Offer Students</h2>
          <Row className="text-center">
            <Col md={4}>
              <Card className="offer-card">
                <Card.Body>
                  <h3>Access Online Courses</h3>
                  <p>Gain access to a wide range of online courses and start learning right away.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="offer-card">
                <Card.Body>
                  <h3>Earn Valuable Certificates</h3>
                  <p>Earn certifications that are validated through blockchain for authenticity.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="offer-card">
                <Card.Body>
                  <h3>Track Your Progress</h3>
                  <p>Monitor your learning progress and achieve your goals with ease.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* OFFERS FOR TEACHERS */}
      <section className="offer-section py-5" id="teacher">
        <Container>
          <h2 className="section-title">What We Offer Teachers</h2>
          <Row className="text-center">
            <Col md={4}>
              <Card className="offer-card">
                <Card.Body>
                  <h3>Manage Student Progress</h3>
                  <p>Track the learning progress of your students and help them achieve their goals.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="offer-card">
                <Card.Body>
                  <h3>Validate Certifications</h3>
                  <p>Verify the authenticity of certificates earned by students using blockchain.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="offer-card">
                <Card.Body>
                  <h3>Contribute to Education</h3>
                  <p>Help improve the educational system by contributing your expertise and content.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* OFFERS FOR ADMINISTRATION */}
      <section className="offer-section py-5" id="admin">
        <Container>
          <h2 className="section-title">What We Offer Administration</h2>
          <Row className="text-center">
            <Col md={4}>
              <Card className="offer-card">
                <Card.Body>
                  <h3>Monitor Educational Progress</h3>
                  <p>Ensure smooth operations and track the learning progress of students and teachers.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="offer-card">
                <Card.Body>
                  <h3>Ensure System Integrity</h3>
                  <p>Maintain a secure and reliable system for education management.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="offer-card">
                <Card.Body>
                  <h3>Verify Certificates</h3>
                  <p>Ensure all certificates are authentic and valid through blockchain verification.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* FOOTER */}
      <footer className="footer bg-dark text-white text-center py-3">
        <p>&copy; 2024 Educhain. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
