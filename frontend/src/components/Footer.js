import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function Footer() {
  return (
    <div>
      <footer>
        <Container>
          <Col className='text-center py-3'>Copyright &copy; ProShop</Col>
        </Container>
      </footer>
    </div>
  );
}

export default Footer;
