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

    // Return the response data
    return response.data;
  } catch (error) {
    // Handle error and propagate it
    console.error('Error making request:', error.response || error.message);
    throw error.response || error.message;
  }
}