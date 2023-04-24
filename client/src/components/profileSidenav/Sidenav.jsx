import "./Sidenav.css";
import { GrAttachment, GrProjects } from "react-icons/gr";
import { GiSkills} from "react-icons/gi";
import { SiExpensify} from "react-icons/si";
import { MdCastForEducation } from "react-icons/md";
import { RiProfileFill } from "react-icons/ri";
import { Suspense } from 'react';
import Loading from "../loading/Loading";

import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import BasicInfo from "../basicInfo/BasicInfo";




function Sidenav({ setDisplay, display }) {
  
  return (
    <>
    <Tab.Container id="left-tabs" defaultActiveKey="basic_info">
      <Row>
        <Col sm={3}>
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link className="Profile_link"  eventKey="basic_info"><RiProfileFill/> Basic Info</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className="Profile_link"  eventKey="experience"><SiExpensify /> Experience </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className="Profile_link"  eventKey="education"><MdCastForEducation /> Education </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className="Profile_link"  eventKey="skills"> <GiSkills /> Skills</Nav.Link>
            </Nav.Item>  
            <Nav.Item>
              <Nav.Link className="Profile_link"  eventKey="projects"> <GrProjects /> Projects </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className="Profile_link"  eventKey="attachments"> <GrAttachment /> Attachments</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col sm={9}>
          <Tab.Content>
            <Tab.Pane eventKey="basic_info">
            <Suspense fallback={<Loading/>}>
            <BasicInfo/>
            </Suspense>
            </Tab.Pane>
            <Tab.Pane eventKey="experience">
             hello
            </Tab.Pane>
            <Tab.Pane eventKey="education">
             ciao
            </Tab.Pane>
            <Tab.Pane eventKey="skills">
             kooi
            </Tab.Pane>
            <Tab.Pane eventKey="projects">
             hihih
            </Tab.Pane>
            <Tab.Pane eventKey="attachments">
             voila
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
    
    </>
  );
}

export default Sidenav;





