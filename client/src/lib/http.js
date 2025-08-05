import apiClient from "./api";

export const get = (url, config = {}) => apiClient.get(url, config);
export const post = (url, data = {}, config = {}) =>
  apiClient.post(url, data, config);
export const put = (url, data = {}, config = {}) =>
  apiClient.put(url, data, config);
export const del = (url, config = {}) => apiClient.delete(url, config);
