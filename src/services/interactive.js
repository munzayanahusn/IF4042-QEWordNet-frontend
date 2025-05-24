import axios from 'axios';
import qs from 'qs';


const API_BASE = import.meta.env.VITE_API_URL;

export const getDCID = () => axios.get(`${API_BASE}/dc/all/`);

export const searchDocument = (data) =>
  axios.get(`${API_BASE}/search`, {
    params: data,
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
});

export const getDocumentById = (id) => axios.get(`${API_BASE}/docs/${id}`);
