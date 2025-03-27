import { HttpStatusCode } from "axios";

// Error Response Function
const ErrorResponse = (res, status = HttpStatusCode.InternalServerError, error, message) => {
  const errorResponse = {
    timestamp: new Date().toISOString(), 
    status: status,
    error,
    message,
  };

  return res.status(status).json(errorResponse); 
};

const SharedResponses = {
  ErrorResponse,
};

export default SharedResponses;
