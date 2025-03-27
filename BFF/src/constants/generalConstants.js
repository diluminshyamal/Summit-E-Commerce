const HTTP_METHODS = {
  GET: "get",
  POST: "post",
  PUT: "put",
  PATCH: "patch",
  DELETE: "delete",
  OPTIONS: "options",
};

const HTTP_STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  DELETED: 204,
  BAD_REQUEST: 400,
  ERROR: 500,
  NOT_FOUND: 404,
};

const generalConstants = {
  HTTP_METHODS,
  HTTP_STATUS_CODES,
};

export default generalConstants;
