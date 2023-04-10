import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'

function TopNavbar() {
    const navigate = useNavigate();
    const [colorChange, setColorchange] = useState(false);

    const changeNavbarColor = () =>{
        if(window.scrollY >= 80){
          setColorchange(true);
        }
        else{
          setColorchange(false);
        }
     };
     window.addEventListener('scroll', changeNavbarColor);
  return (
    <Navbar collapseOnSelect expand="lg" className={ colorChange ? 'header colorChange' : 'header' } >
      <Container className='navbar'>
        <Navbar.Brand className="logo" onClick={() => navigate("/")}>FutureFlow</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className=" nav-items">
            <Link to={"/"} className='Link'>Home</Link>
            <Link to={"/login"} className='Link'>Jobs</Link>
            <Link to={"/login"} className='Link'>Challenges</Link>
            <Link to={"/"} className='Link'>Contact</Link>
            <Link to={"/"} className='Link'>About</Link>
          </Nav>
          <Nav>
          <Link to={"/login"} className='Link'>login</Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopNavbar;                                                           

