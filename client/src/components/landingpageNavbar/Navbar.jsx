import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';

function TopNavbar() {
    const navigate = useNavigate();
  return (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
      <Container>
        <Navbar.Brand className="logo" onClick={() => navigate("/")}>Future Flow</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => navigate("/")}>Home</Nav.Link>
            <Nav.Link onClick={() => navigate("/signup")}>Jobs</Nav.Link>
            <Nav.Link onClick={() => navigate("/signup")}>Challenges</Nav.Link>
            <Nav.Link onClick={() => navigate("/signup")}>Contact</Nav.Link>
            <Nav.Link onClick={() => navigate("/signup")}>About</Nav.Link>
          </Nav>
          <Nav>
          <Nav.Link onClick={() => navigate("/login")}>login</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopNavbar;                                                           