import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { updateUserByAdmin } from "../features/user/adminUserSlice";
import FormContainer from "./FormContainer";
import Loader from "./Loader";
import Message from "./Message";

function AdminUserEditModal({ showModal, setShowModal }) {
  const {
    modalLoading: isLoading,
    getUserError: error,
    userDetail,
  } = useSelector((state) => state.admin);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoading && userDetail) {
      setName(userDetail.name);
      setEmail(userDetail.email);
      setIsAdmin(userDetail.isAdmin);
    }
  }, [isLoading, userDetail]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUserByAdmin({ name, email, isAdmin, id: userDetail._id }));
    setShowModal(false);
  };

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit User Information</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Failed to fetch user details from backend.</p>
            <Message variant='danger'>{error}</Message>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='primary' onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      ) : (
        <Modal
          size='lg'
          fullscreen='md-down'
          show={showModal}
          onHide={() => setShowModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit User Information</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormContainer>
              <Form>
                <Form.Group as={Row} controlId='name'>
                  <Form.Label column sm={2} className='float-left'>
                    Name:
                  </Form.Label>
                  <Col sm={10} className='p-2'>
                    <Form.Control
                      type='name'
                      placeholder='Enter Name'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId='email'>
                  <Form.Label column sm={2}>
                    Email Address:
                  </Form.Label>
                  <Col sm={10} className='p-4'>
                    <Form.Control
                      type='email'
                      placeholder='Enter Email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId='admin'>
                  <Col>
                    <Form.Check
                      type='checkbox'
                      label='IsAdmin'
                      checked={isAdmin}
                      onChange={(e) => setIsAdmin(e.target.checked)}
                    ></Form.Check>
                  </Col>
                </Form.Group>
              </Form>
            </FormContainer>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button
              type='submit'
              onClick={submitHandler}
              disabled={!userDetail}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default AdminUserEditModal;
