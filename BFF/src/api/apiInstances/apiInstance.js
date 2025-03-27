import axios from "axios";
import config from "../../config.json" assert { type: "json" };

export const productServiceApiInstance = axios.create({
  baseURL: `${config.productServiceAPI}`,
  withCredentials: false,
});

export const cartServiceApiInstance = axios.create({
  baseURL: `${config.cartServiceAPI}`,
  withCredentials: false,
});

export const orderServiceApiInstance = axios.create({
  baseURL: `${config.orderServiceAPI}`,
  withCredentials: false,
});
