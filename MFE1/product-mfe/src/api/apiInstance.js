import axios from "axios";
import config from "../config.json";
import Cookies from "js-cookie";

const defaultBaseURL = "http://localhost:9508";
const baseApiUrl = config.bffApiInstance || defaultBaseURL;

export const bffApiInstance = axios.create({
  baseURL: `${baseApiUrl}/bff/api`,
  withCredentials: false,
  headers: { Authorization: Cookies.get("token") },
});
