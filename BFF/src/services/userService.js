import logger from "../shared/loggerUtils.js";
import generalConstants from "../constants/generalConstants.js";
import { userServiceApiInstance } from "../api/apiInstances/apiInstance.js";
import SharedResponses from "../shared/sharedResponses.js";
import { HttpStatusCode } from "axios";
import { response } from "express";

const createUser = async (username) => {
  try {
    const userData = { username: username };
    const response = await userServiceApiInstance.request({
      url: "/api/users",
      method: generalConstants.HTTP_METHODS.POST,
      data: userData,
    });

    return response?.data;
  } catch (error) {
    logger.error(`An error occurred when creating a new user: ${error}`);
    throw SharedResponses.ErrorResponse(
      response,
      HttpStatusCode.InternalServerError,
      error,
      "Failed to create user"
    );
  }
};
const getIdbyUsername = async (username) => {
  const endpoint = "/api/users/id";
  try {
    const response = await userServiceApiInstance.request({
      url: `${endpoint}?username=${username}`,
      method: generalConstants.HTTP_METHODS.GET,
    });

    return response?.data;
  } catch (error) {
    logger.error(
      `An error occurred while fetching user id at endpoint: ${endpoint} with username: ${username} - ${error}`
    );
    throw SharedResponses.ErrorResponse(
      response,
      HttpStatusCode.InternalServerError,
      error,
      "Failed to get the id of user"
    );
  }
};

const userService = {
  createUser,
  getIdbyUsername,
};

export default userService;
