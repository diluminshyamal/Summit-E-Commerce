import { bffApiInstance } from "../api/apiInstance";
import { HTTP_METHODS } from "../constants/constants";

export async function getProductCategories() {
  return bffApiInstance
    .request({
      url: `categories/`,
      method: HTTP_METHODS.GET,
    })
    .then((response) => {
      return response;
    })
    .catch((e) => {
      throw e;
    });
}

export async function getProductsInCategory(id) {
  return bffApiInstance
    .request({
      url: `categories/${id}/products`,
      method: HTTP_METHODS.GET,
    })
    .then((response) => {
      return response;
    })
    .catch((e) => {
      throw e;
    });
}

export async function addCategory(data) {
  return bffApiInstance
    .request({
      url: `categories/`,
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

export async function updateCategory(id, data) {
  return bffApiInstance
    .request({
      url: `categories/${id}`,
      method: HTTP_METHODS.PATCH,
      data: data,
    })
    .then((response) => {
      return response;
    })
    .catch((e) => {
      throw e;
    });
}

export async function deleteCategory(id) {
  return bffApiInstance
    .request({
      url: `categories/${id}`,
      method: HTTP_METHODS.DELETE,
    })
    .then((response) => {
      return response;
    })
    .catch((e) => {
      throw e;
    });
}
