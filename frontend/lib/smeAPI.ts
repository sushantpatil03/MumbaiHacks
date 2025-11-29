import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/sme';

export const smeAPI = {
  deductions: {
    upload: async (files: File[]) => {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      return axios.post(`${API_BASE_URL}/deductions/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    run: async () => {
      const response = await axios.post(`${API_BASE_URL}/deductions/run`);
      return response.data;
    }
  },
  gst: {
    upload: async (files: File[]) => {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      return axios.post(`${API_BASE_URL}/gst/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    run: async () => {
      const response = await axios.post(`${API_BASE_URL}/gst/run`);
      return response.data;
    }
  }
};
