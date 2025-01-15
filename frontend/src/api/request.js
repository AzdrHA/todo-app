import axios from "axios";

export const makeRequest = async ({ url, method, data = {}, params = {}, headers = {} }) => {
  try {
    const response = await axios({
      url,
      method,
      data,
      params,
      headers,
    });

    return response.data;
  } catch (error) {
    console.error('Error making request:', error.response || error.message);
    throw error.response || error.message;
  }
}