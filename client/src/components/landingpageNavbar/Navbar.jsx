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
            <Link to={"/"} className='Link'>Jobs</Link>
            <Link to={"/"} className='Link'>Challenges</Link>
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

// import React, { useState } from 'react'
// import { FaBars, FaTimes } from 'react-icons/fa'
// import {Link} from "react-router-dom"
// import './Navbar.css'

// const TopNavbar = () => {

//     const [click, setClick] = useState(false)
//     const handleClick = () => setClick(!click)

//     const closeMenu = () => setClick(false)

//     return (
//         <div className='header'>
//             <nav className='navbar'>
//                 <Link href='/' className='logo'>
//                     <img src={"/logo.png"} alt='logo' />
//                 </Link>
//                 <div className='hamburger' onClick={handleClick}>
//                     {click ? (<FaTimes size={30} style={{ color: '#ffffff' }} />)
//                         : (<FaBars size={30} style={{ color: '#ffffff' }} />)}
//                 </div>
//                 <ul className={click ? "nav-menu active" : "nav-menu"}>
//                     <li className='nav-item'>
//                         <Link to="/" onClick={closeMenu}>Home</Link>
//                     </li>
//                     <li className='nav-item'>
//                         <Link  onClick={closeMenu}>Jobs</Link>
//                     </li>
//                     <li className='nav-item'>
//                         <Link  onClick={closeMenu}>Challenges</Link>
//                     </li>
//                     <li className='nav-item'>
//                         <Link  onClick={closeMenu}>Contact</Link>
//                     </li>
//                     <li className='nav-item'>
//                         <Link to="/login" onClick={closeMenu}>login</Link> 
//                     </li>
//                 </ul>
//             </nav>
//         </div>
//     )
// }

// export default TopNavbar