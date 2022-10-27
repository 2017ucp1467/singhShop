import React, { useEffect, useState } from "react";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getOrderDetail, payOrder } from "../features/order/orderSlice";
import { useParams } from "react-router-dom";
// import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { PayPalButton } from "react-paypal-button-v2";

//AWJZtfOInUTT4pt59tySlrGPZJGKXc2cxJYgvKgRnuDAn4eMZkE4rtA-rOuhSFbyMF1aUi__GpJ6VcPT

function OrderPage() {
  const { id } = useParams();
  const order = useSelector((state) => state.order);
  const { detailLoading:isLoading, error, orderDetail, paymentSuccess } = order;
  let orderInfo = {};
  // const CLIENT_ID =
  //   "AWJZtfOInUTT4pt59tySlrGPZJGKXc2cxJYgvKgRnuDAn4eMZkE4rtA-rOuhSFbyMF1aUi__GpJ6VcPT";

  if (!isLoading && !error) {
    const itemsPrice = orderDetail.orderItems
      .reduce((acc, item) => acc + item.price * item.qty, 0)
      .toFixed(2);
    orderInfo = { ...orderDetail, itemsPrice };
  }

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sdkReady, setSdkReady] = useState(false);

  const addPayPalScript = () => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://www.paypal.com/sdk/js?client-id=AV9b1BIs8-Evy0DyN54xYq3OOULFiYEmqtk6CRmJfy7K504mD1NVd4hOVRftQau7OiVU0hBD3CZ8V4oO";
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };

  useEffect(() => {
    if (!orderInfo || paymentSuccess || orderInfo._id !== Number(id)) {
      dispatch(getOrderDetail(id));
    } else if (!orderInfo.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, orderInfo, id, paymentSuccess]);

  const successPaymentHandle = (paymentResult) => {
    dispatch(payOrder({ id, paymentResult }));
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <div>
      <h1>Order: {orderInfo._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name:</strong>
                {orderInfo.user.name}
              </p>
              <p>
                <strong>Email:</strong>
                <a href={`mailto:${orderInfo.user.email}`}>
                  {orderInfo.user.email}
                </a>
              </p>
              <p>
                <strong>Shipping:</strong>
                {orderInfo.shippingAddress.address},
                {orderInfo.shippingAddress.city}
                {"     "}
                {orderInfo.shippingAddress.postalCode},{"     "}
                {orderInfo.shippingAddress.country}
              </p>

              {orderInfo.isDelivered ? (
                <Message variant='success'>
                  Delivered on {orderInfo.deliveredAt}
                </Message>
              ) : (
                <Message variant='warning'>Not Delivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method:</strong>
                {orderInfo.paymentMethod}
              </p>
              {orderInfo.isPaid ? (
                <Message variant='success'>Paid on {orderInfo.paidAt}</Message>
              ) : (
                <Message variant='warning'>Not Paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {orderInfo.orderItems.length === 0 ? (
                <Message variant='info'>Your order is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {orderInfo.orderItems.map((item, index) => {
                    return (
                      <ListGroup.Item key={item._id}>
                        <Row>
                          <Col md={1}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fluid
                              rounded
                            />
                          </Col>
                          <Col>
                            <Link to={`/product/${item._id}`}>{item.name}</Link>
                          </Col>
                          <Col md={4}>
                            {item.qty} X ${item.price} = $
                            {(item.qty * item.price).toFixed(2)}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Item:</Col>
                  <Col>${orderInfo.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${orderInfo.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>${orderInfo.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${orderInfo.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!orderInfo.isPaid && (
                <ListGroup.Item>
                  {isLoading && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={orderInfo.totalPrice}
                      onSuccess={successPaymentHandle}
                    />
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
      {/* <PayPalScriptProvider options={{ "client-id": CLIENT_ID }} /> */}
    </div>
  );
}

export default OrderPage;
