import { bffApiInstance } from "../api/apiInstance";
import { HTTP_METHODS } from "../constants/constants";

export async function getProducts() {
  return bffApiInstance
    .request({
      url: `/v1/products?page=1&page_size=100`,
      method: HTTP_METHODS.GET,
    })
    .then((response) => {
      return response;
    })
    .catch((e) => {
      throw e;
    });
}

export async function getProductById(id) {
  return bffApiInstance
    .request({
      url: `/v1/products/${id}`,
      method: HTTP_METHODS.GET,
    })
    .then((response) => {
      return response;
    })
    .catch((e) => {
      throw e;
    });
}

// Create a new product
export async function addProduct(data) {
  return bffApiInstance
    .request({
      url: `/v1/products`,
      method: HTTP_METHODS.POST,
      data: data,
    })
    .then((response) => {
      return response;
    })
    .catch((e) => {
      throw e;
    });
}

// Update an existing product
export async function updateProduct(id, payload) {
  return bffApiInstance
    .request({
      url: `/v1/products/${id}`,
      method: HTTP_METHODS.PATCH,
      data: payload,
    })
    .then((response) => {
      return response;
    })
    .catch((e) => {
      throw e;
    });
}

export async function deleteProduct(id) {
  return bffApiInstance
    .request({
      url: `/${id}`,
      method: HTTP_METHODS.DELETE,
    })
    .then((response) => {
      return response;
    })
    .catch((e) => {
      throw e;
    });
}

export async function getProductByName(name) {
  return bffApiInstance
    .request({
      url: `/name/${name}`,
      method: HTTP_METHODS.GET,
    })
    .then((response) => {
      return response;
    })
    .catch((e) => {
      throw e;
    });
}
