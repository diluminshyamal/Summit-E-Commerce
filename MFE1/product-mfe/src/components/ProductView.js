import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProductsInCategory } from "../services/productCategoryService";
import { getProductById } from "../services/productService";
import { Row, Col, Card, Button, Spin, Empty } from "antd";

const ProductsView = ({ approvePermission, removePermission }) => {
  const { categoryId, search } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const isSearchTrue = search === "true";

  const fetchProducts = async () => {
    setLoading(true);
    try {
      if (isSearchTrue) {
        const product = await getProductById(categoryId);
        setProducts(product?.data ? [product.data] : []);
      } else {
        const response = await getProductsInCategory(categoryId);
        setProducts(response?.data || []);
      }
    } catch (error) {
      console.error("Error fetching products: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, status: "approved" } : product
      )
    );
  };

  const handleRemove = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId)
    );
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryId]);

  if (loading) {
    return (
      <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
    );
  }

  if (!products || products.length === 0) {
    return (
      <Empty description="Products not found!" style={{ marginTop: 20 }} />
    );
  }

  return (
    <Row gutter={[16, 16]} style={{ padding: "20px" }}>
      {products.map(
        (product) =>
          (product.status === "approved" ||
            approvePermission ||
            removePermission) && (
            <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
              <Card title={product.name} bordered={true}>
                <p>{product.description}</p>
                <p>Status: {product.status}</p>
                {approvePermission && product.status !== "approved" && (
                  <Button
                    type="primary"
                    onClick={() => handleApprove(product.id)}
                  >
                    Approve
                  </Button>
                )}
                {removePermission && (
                  <Button
                    type="danger"
                    onClick={() => handleRemove(product.id)}
                    style={{ marginLeft: "8px" }}
                  >
                    Remove
                  </Button>
                )}
              </Card>
            </Col>
          )
      )}
    </Row>
  );
};

export default ProductsView;
