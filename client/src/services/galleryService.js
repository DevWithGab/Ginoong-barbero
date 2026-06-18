import api from './api';

export const galleryAPI = {
  getGalleryImages: async (params = {}) => {
    const response = await api.get('/gallery', { params });
    return response.data;
  },

  getGalleryImage: async (id) => {
    const response = await api.get(`/gallery/${id}`);
    return response.data;
  },

  createGalleryImage: async (imageData) => {
    const response = await api.post('/gallery', imageData);
    return response.data;
  },

  updateGalleryImage: async (id, imageData) => {
    const response = await api.put(`/gallery/${id}`, imageData);
    return response.data;
  },

  deleteGalleryImage: async (id) => {
    const response = await api.delete(`/gallery/${id}`);
    return response.data;
  }
};
