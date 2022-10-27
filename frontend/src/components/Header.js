import React from "react";
import { Navbar, Nav, Container, Row, NavDropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { userLogout } from "../features/user/userSlice";
import { getUserDetail } from "../features/user/userDetailSlice";
import { clearOrder, getOrderList } from "../features/order/orderSlice";
import { clearUserList } from "../features/user/adminUserSlice";
import SearchBox from "./SearchBox";
function Header() {
  const user = useSelector((state) => state.user);
  const { userInfo } = user;
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(userLogout());
    dispatch(clearOrder());
    dispatch(clearUserList());
  };

  const showProfile = () => {
    dispatch(getUserDetail());
    dispatch(getOrderList());
  };
  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>SinghShop</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <SearchBox />
            <Nav className='mr-auto'>
              <LinkContainer to='/cart'>
                <Nav.Link href='/cart'>
                  <i className='fas fa-shopping-cart'></i> Cart
                </Nav.Link>
              </LinkContainer>

              {userInfo ? (
                <NavDropdown title={userInfo.name} id='username'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item onClick={showProfile}>
                      Profile
                    </NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link>
                    <i className='fas fa-user'></i>Login
                  </Nav.Link>
                </LinkContainer>
              )}

              {userInfo && userInfo.isAdmin && (
                <NavDropdown title='Admin' id='adminmenu'>
                  <LinkContainer to='/admin/users/'>
                    <NavDropdown.Item onClick={showProfile}>
                      Users
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/products?page=1'>
                    <NavDropdown.Item onClick={showProfile}>
                      Products
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/orders/'>
                    <NavDropdown.Item onClick={showProfile}>
                      Orders
                    </NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
