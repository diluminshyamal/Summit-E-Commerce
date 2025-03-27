import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, Button, Modal, Image, Typography } from "antd";
import { capitalizeFirstLetter } from "../utils/titleConversion";
import {
  updateCategory,
  deleteCategory,
} from "../services/productCategoryService";

const { Title } = Typography;

const Category = ({
  category,
  image,
  approvePermission,
  removePermission,
  approved,
  onApprove,
  onRemove,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [message, setMessage] = useState("");

  const handleConfirm = async () => {
    if (modalAction) {
      await modalAction();
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setModalAction(null);
  };

  const approveCategory = async () => {
    try {
      await updateCategory(category.id, { status: "approved" });
      onApprove(category.id);
    } catch (error) {
      console.error("Failed to approve category:", error);
    }
  };

  const removeCategory = async () => {
    try {
      await deleteCategory(category.id);
      onRemove(category.id);
    } catch (error) {
      console.error("Failed to remove category:", error);
    }
  };

  const openConfirmationModal = (action) => {
    if (action === "approve") {
      setMessage(
        `Are you sure you want to approve the product "${category.categoryName}"?`
      );
      setModalAction(() => approveCategory);
    } else if (action === "remove") {
      setMessage(
        `Are you sure you want to remove the product "${category.categoryName}"?`
      );
      setModalAction(() => removeCategory);
    }
    setIsModalVisible(true);
  };

  return (
    <>
      <Link
        to={`/categories/${category.id}/${false}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <Card
          hoverable
          style={{ width: 220, margin: "16px" }}
          cover={
            <Image
              src={image}
              alt={category.category_name}
              width={200}
              height={150}
              style={{ objectFit: "cover" }}
            />
          }
        >
          <Title level={5}>
            {capitalizeFirstLetter(category.categoryName)}
          </Title>
          <div>
            {approvePermission && !approved && (
              <Button
                type="primary"
                style={{ marginRight: "8px" }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openConfirmationModal("approve");
                }}
              >
                Approve
              </Button>
            )}
            {((removePermission && !approved) || approvePermission) && (
              <Button
                danger
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openConfirmationModal("remove");
                }}
              >
                Remove
              </Button>
            )}
          </div>
        </Card>
      </Link>

      <Modal
        title="Confirmation"
        visible={isModalVisible}
        onOk={handleConfirm}
        onCancel={handleCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>{message}</p>
      </Modal>
    </>
  );
};

export default Category;
