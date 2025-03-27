import React, { useState, useEffect } from "react";
import { Button, Row, Col } from "antd";
import Category from "../components/Category";
import images from "../assets/imageMap";
import { getProductCategories } from "../services/productCategoryService";
import AddProductModal from "../components/AddProduct";

const HomeScreen = ({ approvePermission, removePermission }) => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleAddCategory = (newCategory) => {
    setCategories((prevCategories) => [...prevCategories, newCategory]);
  };

  const handleModalOpen = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  const handleApprove = (categoryId) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === categoryId
          ? { ...category, status: "approved" }
          : category
      )
    );
  };

  const handleRemove = (categoryId) => {
    setCategories((prevCategories) =>
      prevCategories.filter((category) => category.id !== categoryId)
    );
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getProductCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <div
        className="m-3"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {(approvePermission || removePermission) && (
          <Button type="primary" onClick={handleModalOpen}>
            Add Product
          </Button>
        )}
      </div>

      <Row gutter={[16, 16]} className="m-3">
        {categories.map(
          (category) =>
            (category.status === "approved" ||
              approvePermission ||
              removePermission) && (
              <Col key={category.id} xs={24} sm={12} md={8} lg={6}>
                <Category
                  category={category}
                  image={images[category.id]}
                  approvePermission={approvePermission}
                  removePermission={removePermission}
                  approved={category.status === "approved"}
                  onApprove={handleApprove}
                  onRemove={handleRemove}
                />
              </Col>
            )
        )}
      </Row>

      <AddProductModal
        show={showModal}
        handleClose={handleModalClose}
        categories={categories}
        handleAddCategory={handleAddCategory}
      />
    </>
  );
};

export default HomeScreen;
