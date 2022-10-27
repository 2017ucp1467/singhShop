import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import { getProductList } from "../features/productList/productListSlice";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function HomePage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const { products, isLoading, error, page, pages } = useSelector(
    (store) => store.productList
  );

  let keyword = searchParams.get("keyword") ? searchParams.get("keyword") : "";
  let pageParam = searchParams.get("page");
  useEffect(() => {
    dispatch(getProductList({ keyword, page: pageParam }));
  }, [dispatch, keyword, pageParam]);
  return (
    <div>
      {!keyword && <ProductCarousel />}
      <h1>Latest Products</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
      <Paginate page={page} pages={pages} keyword={keyword} />
    </div>
  );
}

export default HomePage;
