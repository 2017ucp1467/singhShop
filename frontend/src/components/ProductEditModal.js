import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "./FormContainer";
import Loader from "./Loader";
import Message from "./Message";
import {
  createProduct,
  updateProductDetail,
} from "../features/productList/productDetailSlice";

function ProductEditModal({ showModal, setShowModal, isCreate, setIsCreate }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");

  const dispatch = useDispatch();

  const { isLoading, error, product } = useSelector(
    (state) => state.productDetail
  );

  useEffect(() => {
    if (!isLoading && product && !isCreate) {
      setName(product.name);
      setPrice(product.price);
      setCountInStock(product.countInStock);
      setBrand(product.brand);
      setCategory(product.category);
    } else {
      setName("");
      setPrice("");
      setCountInStock("");
      setBrand("");
      setCategory("");
    }
  }, [isLoading, product, isCreate]);

  const submitHandler = (id) => {
    if (isCreate) {
      dispatch(
        createProduct({ name, price, countInStock, brand, category, image })
      );
      setIsCreate(false);
      setShowModal(false);
    } else {
      dispatch(
        updateProductDetail({
          id,
          name,
          price,
          countInStock,
          brand,
          category,
          image,
        })
      );
      setShowModal(false);
    }
    console.log("Product Info updated.");
  };

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Modal
          show={showModal}
          onHide={() => {
            setShowModal(false);
            setIsCreate(false);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Product Information</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Failed to fetch Product details from backend.</p>
            <Message variant='danger'>{error}</Message>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant='primary'
              onClick={() => {
                setShowModal(false);
                setIsCreate(false);
              }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      ) : (
        <Modal
          size='lg'
          fullscreen='md-down'
          show={showModal}
          onHide={() => {
            setShowModal(false);
            setIsCreate(false);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {isCreate ? "Create Product" : "Edit Product Information"}
            </Modal.Title>
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
                <Form.Group as={Row} controlId='price'>
                  <Form.Label column sm={2}>
                    Price:
                  </Form.Label>
                  <Col sm={10} className='p-4'>
                    <Form.Control
                      type='number'
                      placeholder='Enter Price'
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    ></Form.Control>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId='brand'>
                  <Form.Label column sm={2}>
                    Brand:
                  </Form.Label>
                  <Col sm={10} className='p-4'>
                    <Form.Control
                      type='text'
                      placeholder='Enter Brand'
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                    ></Form.Control>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId='category'>
                  <Form.Label column sm={2}>
                    Category:
                  </Form.Label>
                  <Col sm={10} className='p-4'>
                    <Form.Control
                      type='text'
                      placeholder='Enter Category'
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    ></Form.Control>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId='stockCount'>
                  <Form.Label column sm={2}>
                    Stock:
                  </Form.Label>
                  <Col sm={10} className='p-4'>
                    <Form.Control
                      type='number'
                      placeholder='Enter Stock'
                      value={countInStock}
                      onChange={(e) => setCountInStock(e.target.value)}
                    ></Form.Control>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId='productImg'>
                  <Form.Label column sm={2}>
                    Product Img:
                  </Form.Label>
                  <Col sm={10} className='p-4'>
                    <Form.Control
                      type='file'
                      name='image'
                      onChange={(e) => setImage(e.target.files[0])}
                    ></Form.Control>

                    {!isCreate && (
                      <small style={{ color: "red" }}>
                        *Uploading a new Image will overwrite the existing one.
                      </small>
                    )}
                  </Col>
                </Form.Group>
              </Form>
            </FormContainer>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant='secondary'
              onClick={() => {
                setShowModal(false);
                setIsCreate(false);
              }}
            >
              Close
            </Button>
            <Button
              type='submit'
              onClick={() => submitHandler(product._id)}
              disabled={!product}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default ProductEditModal;
