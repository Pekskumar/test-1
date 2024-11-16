import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Logo from "../Assets/Images/Logo";
import Logo1 from "../Assets/Images/Logo12.png";
import UserPlaceholder from "../Assets/Images/userimages.jpg";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { useDispatch, useSelector } from "react-redux";
import { userInfo, userToken } from "../ReduxTookit/UserInfoSlice";
import ChangePasswordModal from "../Modals/ChangePasswordModal";

const Header = () => {
  const UserData = useSelector((state) => state.userinfo.UserInfo);
  console.log("UserData ::",UserData);
  
  const [ChangePWDModalShow, setChangePWDModalShow] = useState(false);
  let navigate = useNavigate();

  let dispatch = useDispatch();
  function fnLogout() {
    dispatch(userInfo(null));
    dispatch(userToken(null));    
    localStorage.clear();    
  }
  return (
    <header>
      <Container fluid>
        <div className="d-flex justify-content-between align-items-center p-2">
          <Navbar.Brand as={NavLink} to="/home">
            {/* <Logo /> */}
            <img src={Logo1} style={{ height: "50px", width: "50px" }} />
          </Navbar.Brand>
          <div className="d-flex align-items-center ml-auto">
            <Nav className="main-menu mr-3 me-2">
              <Nav.Link as={NavLink} to="/home" className="pe-0">
                Home
              </Nav.Link>
              <Nav.Link as={NavLink} to="/transactions" className="pe-1">
                Transactions
              </Nav.Link>
            </Nav>
            <div className="header-right">
              <Dropdown>
                <Dropdown.Toggle id="dropdown-basic">
                  {/* <div
                    className="pro-img me-1"
                    style={{
                      backgroundColor: `#404acb`,
                    }}
                  >
                    {UserData && UserData !== '' && UserData?.displayname && UserData?.displayname[0]}
                  </div> */}
                  <img
                    src={
                      UserData?.profilepic !== ""
                        ? UserData?.profilepic
                        : UserPlaceholder
                    }
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = UserPlaceholder;
                    }}
                    alt={UserData?.profilepic}
                    className="pro-img me-1"
                  />
                </Dropdown.Toggle>

                {/* <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setChangePWDModalShow(true)}>
                    Change Password
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => fnLogout()}>
                    Log Out
                  </Dropdown.Item>
                </Dropdown.Menu> */}
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setChangePWDModalShow(true)}>
                    Change Password
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate("/users")}>
                    Users
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate("/todos")}>
                    To Do List
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => fnLogout()}>
                    Log Out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
      </Container>
      {ChangePWDModalShow && (
        <ChangePasswordModal
          show={ChangePWDModalShow}
          onHide={() => setChangePWDModalShow(false)}
        />
      )}
    </header>
  );
};

export default Header;
