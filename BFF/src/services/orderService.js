import logger from "../shared/loggerUtils.js";
import generalConstants from "../constants/generalConstants.js";
import { orderServiceApiInstance } from "../api/apiInstances/apiInstance.js";
import SharedResponses from "../shared/sharedResponses.js";
import { HttpStatusCode } from "axios";

const getOrderByUserId = async (userId) => {
  try {
    const response = await orderServiceApiInstance.request({
      url: `v1/api/orders/user/${userId}`,
      method: generalConstants.HTTP_METHODS.GET,
    });

    return response?.data;
  } catch (error) {
    if (error.response?.status === 404) {
      logger.warn(`Cart not found for user ${userId}`);
      return null; // Return null instead of throwing an error
    }
    logger.error(`Error fetching cart for cart ${userId}: ${error}`);
    throw SharedResponses.ErrorResponse(
      HttpStatusCode.InternalServerError,
      error,
      "Failed to fetch cart"
    );
  }
};
const orderService = {
  getOrderByUserId,
};

export default orderService;
