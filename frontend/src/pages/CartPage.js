import React, { useEffect } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import Message from "../components/Message";
import {
  addItem,
  addToCart,
  removeItem,
  clearCart,
} from "../features/cart/cartSlice";

function CartPage() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  let qty = searchParams.get("qty");
  qty = qty ? Number(qty) : 1;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.user);
  const { cartItems } = cart;

  useEffect(() => {
    if (id) {
      dispatch(addToCart({ id, qty })); //in dispatchin an async thunk we can only pass a single param, so multiple params need to be pass as either object or list.
    }
  }, [dispatch, id, qty]);

  const removeItemFromCart = (id) => {
    dispatch(removeItem(id));
  };

  const clearCartItems = () => {
    dispatch(clearCart());
  };

  const checkoutHandler = () => {
    if (userInfo) {
      navigate("/shipping");
    } else {
      navigate("/login?redirect=/shipping");
    }
  };

  return (
    <>
      <Row>
        <Col md={8}>
          <h1>Shopping Cart</h1>
          {cartItems.length === 0 ? (
            <Message variant='info'>
              Your cart is empty<Link to='/'>Go Back</Link>
            </Message>
          ) : (
            <ListGroup variant='flush'>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col md={3}>
                      <Link to={`/product/${item._id}`}>{item.name}</Link>
                    </Col>
                    <Col md={2}>${item.price}</Col>
                    <Col md={3}>
                      <Form.Control
                        as='select'
                        value={item.qty}
                        onChange={(e) =>
                          dispatch(
                            addItem({
                              qty: Number(e.target.value),
                              id: item._id,
                            })
                          )
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>

                    <Col md={1}>
                      <Button
                        type='button'
                        variant='light'
                        onClick={() => removeItemFromCart(item._id)}
                      >
                        <i className='fas fa-trash'></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>
                  Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}
                  ) items
                </h2>
                $
                {cartItems
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toFixed(2)}
              </ListGroup.Item>
            </ListGroup>

            <ListGroup.Item>
              <Button
                type='button'
                className='col-12'
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed to Checkout
              </Button>
            </ListGroup.Item>
          </Card>
        </Col>
      </Row>
      <Row>
        <Button type='button' onClick={() => clearCartItems()}>
          Clear Cart
        </Button>
      </Row>
    </>
  );
}

export default CartPage;

//Notes
// 1. toFixed allows us to set the decimal places 