import axios from 'axios';

export const getApi = async (endpoint) => {
  if (endpoint != '') {
    const response = await axios.get(endpoint);
    return response;
  }
}
