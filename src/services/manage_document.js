import axios from 'axios';
import qs from 'qs';


const API_BASE = import.meta.env.VITE_API_URL;

export async function fetchCollections() {
  const res = await fetch(`${API_BASE}/dc/all/`);
  if (!res.ok) throw new Error('Failed to fetch document collections');
  return res.json();
}

export async function fetchDocumentsByCollection(id) {
  const res = await fetch(`${API_BASE}/dc/${id}/docs`);
  if (!res.ok) throw new Error('Failed to fetch documents for the selected collection');
  return res.json();
}

export async function fetchInvertedFile({ id_dc, id_doc, stem, stopword }) {
  const params = new URLSearchParams({
    id_dc,
    id_doc,
    stem: stem ? 'true' : 'false',
    stopword: stopword ? 'true' : 'false'
  });
  const res = await fetch(`${API_BASE}/inverted/?${params.toString()}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Failed to fetch inverted file');
  return data;
}

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/upload/`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Upload failed');
  return data;
}