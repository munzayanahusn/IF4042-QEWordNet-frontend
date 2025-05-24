import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;

export const searchDocumentBatch = (formData) => {
  return axios.post(`${API_BASE}/search-batch`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};