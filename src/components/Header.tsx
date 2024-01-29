import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button, Dropdown, Modal, Offcanvas } from 'react-bootstrap';
import { UserContext } from '../context/common';

import './style.css';

const Header = () => {
   const [show, setShow] = useState(false);

   const closeSidebar = () => setShow(false);
   const openSidebar = () => setShow(true);

   const { isUserLogin, setIsUserLogin } = useContext(UserContext);
   const navigate = useNavigate();

   const [welcomeModal, setWelcomeModal] = useState(false);

   const signOutClick = () => {
      localStorage.removeItem('AuthToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      localStorage.removeItem('defaultTTSEngine');
      setIsUserLogin(false);
      navigate('/sign-in');
   };

   const { todayDate } = useContext(UserContext);

   return (
      <>
         <nav
            className="navbar navbar-expand-lg bg-dark navbar-dark py-3 fixed-top px-3"
            id="top-nav"
         >
            <div className="container">
               {isUserLogin && (
                  <i
                     className="bi bi-list"
                     onClick={openSidebar}
                     style={{
                        cursor: 'pointer',
                        color: '#fff',
                        fontSize: '30px',
                     }}
                  ></i>
               )}
               <Dropdown>
                  <Dropdown.Toggle
                     className="d-flex align-items-center"
                     variant="secondary"
                     id="dropdown-basic"
                     style={{ fontSize: 20, height: 35 }}
                  >
                     {localStorage.getItem('username')}
                  </Dropdown.Toggle>
                  {isUserLogin ? (
                     <Dropdown.Menu>
                        <Dropdown.Item
                           onClick={() => {
                              navigate('/user/setting');
                           }}
                        >
                           Setting
                        </Dropdown.Item>
                        <Dropdown.Item onClick={signOutClick}>
                           Exit
                        </Dropdown.Item>
                     </Dropdown.Menu>
                  ) : (
                     <Dropdown.Menu>
                        <Dropdown.Item>
                           <Link to={'/sign-in'}>Sign In</Link>
                        </Dropdown.Item>
                        <Dropdown.Item>
                           <Link to={'/sign-up'}>Sign Up</Link>
                        </Dropdown.Item>
                     </Dropdown.Menu>
                  )}
               </Dropdown>
               <div
                  className="navbar-brand hoverPointer"
                  onClick={() => {
                     setWelcomeModal(true);
                  }}
               >
                  <img src={`/plangual.png`} style={{ width: 30 }} alt="" />{' '}
                  Plangual{' '}
               </div>
            </div>
         </nav>
         <div style={{ width: '100%', height: '80px', display: 'block' }}></div>

         <Offcanvas show={show} onHide={closeSidebar}>
            <Offcanvas.Body className="sideNav">
               <button className="btn-close mx-auto" onClick={closeSidebar}>
                  &times;
               </button>
               <Link
                  to={`/days/${todayDate.shamsiDBBarcode}`}
                  onClick={closeSidebar}
               >
                  Day
               </Link>
               <Link to={'/tasks'} onClick={closeSidebar}>
                  Task
               </Link>
               <hr style={{ color: '#fff' }} />
               <Link to={'/pulses'} onClick={closeSidebar}>
                  Pulse
               </Link>
            </Offcanvas.Body>
         </Offcanvas>
         <Modal
            show={welcomeModal}
            onHide={() => {
               setWelcomeModal(false);
            }}
         >
            <Modal.Body>
               <div className="alert alert-primary" role="alert">
                  Welcome to Plangual!
               </div>
               <div className="alert alert-info" role="alert">
                  Use sidebar and explore application :-))))
               </div>
            </Modal.Body>
         </Modal>
      </>
   );
};

export default Header;
