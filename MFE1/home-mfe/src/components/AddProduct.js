import React, { useState } from "react";
import { Modal, Button, Form, Input, Select, message } from "antd";
import ConfirmationModal from "../../../sysco-ecommerce-cart-mfe/src/components/ConfirmationModal";
import { addCategory } from "../services/productCategoryService";
import {
  addProduct,
  updateProduct,
  getProductByName,
} from "../services/productService";

const { Option } = Select;

const AddProductModal = ({
  show,
  handleClose,
  categories,
  handleAddCategory,
}) => {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [productData, setProductData] = useState({
    productName: "",
    quantity: null,
    costPerUnit: null,
    status: "pending",
    categoryId: null,
  });

  const handleCloseConfirmationModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateProduct = async () => {
    try {
      const response = await getProductByName(
        productData.productName.toLowerCase()
      );
      if (response?.data.id) {
        const updateData = {
          ...productData,
          productName: productData.productName.toLowerCase(),
        };
        await updateProduct(response.data.id, updateData);
      }
    } catch (error) {
      console.error("Error occurred: ", error);
    }
    handleClose();
    handleCloseConfirmationModal();
  };

  const handleNewCategorySubmit = async () => {
    if (newCategory.trim()) {
      try {
        const response = await addCategory({
          categoryName: newCategory.toLowerCase(),
          status: "pending",
        });
        handleAddCategory(response.data);
        setNewCategory("");
        setShowAddCategory(false);
        setErrorMessage("");
      } catch (error) {
        if (error.status === 409) {
          setErrorMessage(
            error.response?.data?.message || "Category already exists"
          );
        } else {
          setErrorMessage(
            error.response?.data?.message || "An unexpected error occurred"
          );
        }
      }
    } else {
      setErrorMessage("Category name cannot be empty.");
    }
  };

  const handleFormSubmit = async () => {
    const productDataToSend = {
      ...productData,
      productName: productData.productName.toLowerCase(),
    };
    try {
      await addProduct(productDataToSend);
      handleClose();
      message.success("Product added successfully");
    } catch (error) {
      if (error.status === 409) {
        setShowModal(true);
      } else {
        setErrorMessage(
          error.response?.data?.message || "An unexpected error occurred"
        );
      }
    }
  };

  return (
    <>
      <Modal
        title="Add New Product"
        open={show}
        onCancel={handleClose}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item label="Product Name" required>
            <Input
              name="productName"
              value={productData.productName}
              onChange={handleInputChange}
              required
            />
          </Form.Item>
          <Form.Item label="Quantity" required>
            <Input
              type="number"
              name="quantity"
              value={productData.quantity}
              onChange={handleInputChange}
              required
            />
          </Form.Item>
          <Form.Item label="Price per unit" required>
            <Input
              type="number"
              name="costPerUnit"
              value={productData.costPerUnit}
              onChange={handleInputChange}
              required
            />
          </Form.Item>
          <Form.Item label="Category" required>
            <Select
              value={productData.categoryId}
              onChange={(value) => {
                if (value === "add-new") {
                  setShowAddCategory(true);
                } else {
                  setProductData({ ...productData, categoryId: value });
                }
              }}
            >
              <Option value="">Select a category</Option>
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.categoryName}
                </Option>
              ))}
              <Option value="add-new">Add a New Category</Option>
            </Select>
          </Form.Item>
          {showAddCategory && (
            <Form.Item label="New Category Name">
              <Input
                value={newCategory}
                onChange={(e) => {
                  setNewCategory(e.target.value);
                  setErrorMessage("");
                }}
              />
              <Button
                type="primary"
                onClick={handleNewCategorySubmit}
                style={{ marginTop: 10 }}
              >
                Add Category
              </Button>
              {errorMessage && (
                <div style={{ color: "red", marginTop: 5 }}>{errorMessage}</div>
              )}
            </Form.Item>
          )}
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </Modal>

      <ConfirmationModal
        show={showModal}
        handleClose={handleCloseConfirmationModal}
        handleConfirm={handleUpdateProduct}
        message="Product already exists. Want to update?"
      />
    </>
  );
};

export default AddProductModal;
